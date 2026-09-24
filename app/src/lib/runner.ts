import JsWorker from '../workers/js.worker.ts?worker'
import PyWorker from '../workers/py.worker.ts?worker'
import type { Problem } from '../types'

export interface TestResult {
  pass: boolean
  got?: string
  expected: string
  args: string
  error?: string
  ms: number
}

export interface RunResult {
  ok: boolean
  error?: string
  results: TestResult[]
  logs: string[]
}

let pyWorker: Worker | null = null
let pyReady = false

function getPy() {
  if (!pyWorker) pyWorker = new PyWorker()
  return pyWorker
}

export function warmPython(onReady?: (ok: boolean) => void) {
  if (pyReady) {
    onReady?.(true)
    return
  }
  const w = getPy()
  const handler = (e: MessageEvent) => {
    if ('ready' in e.data) {
      pyReady = e.data.ready
      w.removeEventListener('message', handler)
      onReady?.(e.data.ready)
    }
  }
  w.addEventListener('message', handler)
  w.postMessage({ warm: true })
}

export function isPythonReady() {
  return pyReady
}

export function runCode(lang: 'js' | 'py', code: string, p: Problem): Promise<RunResult> {
  const payload = { code, fn: p.fn, tests: p.tests, mode: p.compare ?? 'exact' }
  if (lang === 'js') {
    return new Promise((resolve) => {
      const w = new JsWorker()
      const timer = setTimeout(() => {
        w.terminate()
        resolve({ ok: false, error: 'Превышено время: 4 секунды. Возможно, бесконечный цикл или слишком медленное решение.', results: [], logs: [] })
      }, 4000)
      w.onmessage = (e) => {
        clearTimeout(timer)
        w.terminate()
        resolve(e.data)
      }
    w.postMessage(payload)
    })
  }
  return new Promise((resolve) => {
    const w = getPy()
    const limit = pyReady ? 8000 : 60000
    const timer = setTimeout(() => {
      w.terminate()
      pyWorker = null
      pyReady = false
      resolve({ ok: false, error: `Превышено время: ${limit / 1000} секунд. Возможно, бесконечный цикл или слишком медленное решение.`, results: [], logs: [] })
    }, limit)
    const handler = (e: MessageEvent) => {
      if ('ready' in e.data) return
      clearTimeout(timer)
      w.removeEventListener('message', handler)
      pyReady = true
      resolve(e.data)
    }
    w.addEventListener('message', handler)
    w.postMessage(payload)
  })
}

export interface ProgramRun {
  out: string
  err?: string
  ms: number
}

export interface ProgramResult {
  runs: ProgramRun[]
  fatal?: string
  timeoutAt?: number
}

// Лимит на один тест. Pyodide в 2–4 раза медленнее CPython, поэтому запас больше, чем в Контесте.
const TEST_LIMIT = 6000

export function runProgram(code: string, inputs: string[], onProgress?: (done: number) => void): Promise<ProgramResult> {
  return new Promise((resolve) => {
    const w = getPy()
    const runs: ProgramRun[] = []
    let timer: ReturnType<typeof setTimeout>
    const arm = (ms: number) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        w.removeEventListener('message', handler)
        w.terminate()
        pyWorker = null
        pyReady = false
        resolve({ runs, timeoutAt: runs.length })
      }, ms)
    }
    const handler = (e: MessageEvent) => {
      const d = e.data
      if ('ready' in d) return
      if ('progress' in d) {
        runs.push({ out: d.out, err: d.err ?? undefined, ms: d.ms })
        onProgress?.(runs.length)
        arm(TEST_LIMIT)
        return
      }
      if ('done' in d) {
        clearTimeout(timer)
        w.removeEventListener('message', handler)
        pyReady = true
        resolve({ runs, fatal: d.fatal })
      }
    }
    w.addEventListener('message', handler)
    arm(pyReady ? TEST_LIMIT : 60000)
    w.postMessage({ program: true, code, inputs })
  })
}

export function sameOutput(got: string, want: string, float = false): boolean {
  const a = got.trim().split(/\s+/).filter(Boolean)
  const b = want.trim().split(/\s+/).filter(Boolean)
  if (a.length !== b.length) return false
  return a.every((x, i) => {
    if (x === b[i]) return true
    if (!float) return false
    const p = Number(x)
    const q = Number(b[i])
    return Number.isFinite(p) && Number.isFinite(q) && Math.abs(p - q) <= 1e-6 * Math.max(1, Math.abs(q))
  })
}
