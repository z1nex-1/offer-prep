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
