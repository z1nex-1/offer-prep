import { compare, formatValue } from '../lib/compare'

// Дистрибутив full, а не npm-пакет: в npm нет колёс пакетов, и import numpy не скачивается.
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/'

interface Req {
  code: string
  fn: string
  tests: { args: unknown[]; expected: unknown }[]
  mode: string
}

interface ProgramReq {
  program: true
  code: string
  inputs: string[]
}

interface Pyodide {
  runPython: (code: string) => unknown
  globals: { set: (k: string, v: unknown) => void; get: (k: string) => unknown }
  setStdout: (o: { batched: (s: string) => void }) => void
  loadPackagesFromImports: (code: string) => Promise<unknown>
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

// Программа целиком, как в Яндекс Контесте: stdin -> stdout. У sys.stdin и sys.stdout есть .buffer,
// а потоки выполняются синхронно — в браузере их нет, а решения с threading для глубокой рекурсии встречаются часто.
const PROGRAM = `
import sys, io, time, traceback, threading
threading.Thread.start = lambda self: self.run()
threading.Thread.join = lambda self, *a, **k: None
threading.stack_size = lambda *a: 0
def __run_program(src, inp):
    raw_out = io.BytesIO()
    out = io.TextIOWrapper(raw_out, encoding="utf-8", write_through=True)
    stdin = io.TextIOWrapper(io.BytesIO(inp.encode("utf-8")), encoding="utf-8")
    old_in, old_out = sys.stdin, sys.stdout
    sys.stdin, sys.stdout = stdin, out
    err = None
    t0 = time.perf_counter()
    try:
        exec(compile(src, "solution.py", "exec"), {"__name__": "__main__"})
    except SystemExit as e:
        if e.code not in (None, 0):
            err = "Программа завершилась с кодом " + str(e.code)
    except BaseException:
        lines = traceback.format_exc().strip().splitlines()
        keep = [l for l in lines if "solution.py" in l or not l.startswith("  File")]
        err = "\\n".join(keep[-4:])
    finally:
        try:
            out.flush()
        except Exception:
            pass
        sys.stdin, sys.stdout = old_in, old_out
    ms = (time.perf_counter() - t0) * 1000
    return [raw_out.getvalue().decode("utf-8", "replace"), err, ms]
`

async function runProgram(req: ProgramReq) {
  try {
    const p = await boot()
    // В контесте ML решения пишут с NumPy; пакет качается с CDN только при первом import.
    await p.loadPackagesFromImports(req.code)
    p.runPython(PROGRAM)
    p.globals.set('__src', req.code)
    for (let i = 0; i < req.inputs.length; i++) {
      p.globals.set('__inp', req.inputs[i])
      const res = p.runPython('__run_program(__src, __inp)') as { toJs: () => [string, string | null, number]; destroy: () => void }
      const [out, err, ms] = res.toJs()
      res.destroy()
      // Порог выше любого эталонного вывода (тесты задачи — до 1 МБ) и защищает только от бесконечной печати.
      self.postMessage({ progress: i, out: out.length > 4000000 ? out.slice(0, 4000000) : out, err, ms })
    }
    self.postMessage({ done: true })
  } catch (err) {
    self.postMessage({ done: true, fatal: String(err).split('\n').filter(Boolean).slice(-3).join('\n') })
  }
}

self.onmessage = async (e: MessageEvent<Req | ProgramReq | { warm: true }>) => {
  if ('program' in e.data) {
    await runProgram(e.data)
    return
  }
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
