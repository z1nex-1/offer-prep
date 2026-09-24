import { compare, formatValue } from '../lib/compare'

interface Req {
  code: string
  fn: string
  tests: { args: unknown[]; expected: unknown }[]
  mode: string
}

const clone = <T,>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)))

self.onmessage = (e: MessageEvent<Req>) => {
  const { code, fn, tests, mode } = e.data
  const logs: string[] = []
  const log = (...args: unknown[]) => {
    if (logs.length < 200) logs.push(args.map((a) => (typeof a === 'string' ? a : formatValue(a))).join(' '))
  }
  const consoleShim = { log, info: log, warn: log, error: log, debug: log }
  let target: (...a: unknown[]) => unknown
  try {
    const factory = new Function('console', `${code}\n;return typeof ${fn} === 'function' ? ${fn} : undefined;`)
    target = factory(consoleShim)
    if (typeof target !== 'function') throw new Error(`Функция ${fn} не найдена. Не меняйте её имя.`)
  } catch (err) {
    self.postMessage({ ok: false, error: String(err), results: [], logs })
    return
  }
  const results = tests.map((t) => {
    const started = performance.now()
    try {
      const got = target(...clone(t.args))
      const pass = compare(got, t.expected, mode)
      return { pass, got: formatValue(got), expected: formatValue(t.expected), args: formatValue(t.args), ms: performance.now() - started }
    } catch (err) {
      return { pass: false, error: String(err), expected: formatValue(t.expected), args: formatValue(t.args), ms: performance.now() - started }
    }
  })
  self.postMessage({ ok: true, results, logs })
}
