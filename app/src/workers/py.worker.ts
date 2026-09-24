import { compare, formatValue } from '../lib/compare'

const PYODIDE = 'https://cdn.jsdelivr.net/npm/pyodide@314.0.7/'

interface Req {
  code: string
  fn: string
  tests: { args: unknown[]; expected: unknown }[]
  mode: string
}

interface Pyodide {
  runPython: (code: string) => unknown
  globals: { set: (k: string, v: unknown) => void; get: (k: string) => unknown }
  setStdout: (o: { batched: (s: string) => void }) => void
}

let py: Promise<Pyodide> | null = null

function boot(): Promise<Pyodide> {
  if (!py) {
    py = (async () => {
      const mod = await import(/* @vite-ignore */ `${PYODIDE}pyodide.mjs`)
      return (await mod.loadPyodide({ indexURL: PYODIDE })) as Pyodide
    })()
  }
  return py
}

const HARNESS = `
import json, time, traceback, sys
def __run_tests(src, fn, tests_json):
    ns = {}
    exec(src, ns)
    if fn not in ns:
        raise NameError(f"Функция {fn} не найдена. Не меняйте её имя.")
    f = ns[fn]
    out = []
    for t in json.loads(tests_json):
        t0 = time.perf_counter()
        try:
            got = f(*t["args"])
            try:
                enc = json.dumps(got)
            except TypeError:
                enc = json.dumps(list(got)) if hasattr(got, "__iter__") else json.dumps(str(got))
            out.append({"ok": True, "got": enc, "ms": (time.perf_counter() - t0) * 1000})
        except Exception:
            tb = traceback.format_exc().strip().splitlines()
            out.append({"ok": False, "error": tb[-1], "ms": (time.perf_counter() - t0) * 1000})
    return json.dumps(out)
`

self.onmessage = async (e: MessageEvent<Req | { warm: true }>) => {
  if ('warm' in e.data) {
    try {
      await boot()
      self.postMessage({ ready: true })
    } catch (err) {
      self.postMessage({ ready: false, error: String(err) })
    }
    return
  }
  const { code, fn, tests, mode } = e.data
  const logs: string[] = []
  try {
    const p = await boot()
    p.setStdout({ batched: (s: string) => logs.length < 200 && logs.push(s) })
    p.runPython(HARNESS)
    p.globals.set('__src', code)
    p.globals.set('__fn', fn)
    p.globals.set('__tests', JSON.stringify(tests))
    const raw = p.runPython('__run_tests(__src, __fn, __tests)') as string
    const outs = JSON.parse(raw) as { ok: boolean; got?: string; error?: string; ms: number }[]
    const results = outs.map((o, i) => {
      const t = tests[i]
      if (!o.ok) return { pass: false, error: o.error, expected: formatValue(t.expected), args: formatValue(t.args), ms: o.ms }
      const got = JSON.parse(o.got!)
      return { pass: compare(got, t.expected, mode), got: formatValue(got), expected: formatValue(t.expected), args: formatValue(t.args), ms: o.ms }
    })
    self.postMessage({ ok: true, results, logs })
  } catch (err) {
    const msg = String(err)
    const line = msg.split('\n').filter(Boolean)
    self.postMessage({ ok: false, error: line.slice(-3).join('\n'), results: [], logs })
  }
}
