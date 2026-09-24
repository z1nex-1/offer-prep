import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { compare } from '../src/data/../lib/compare.ts'
import { problemsA } from '../src/data/problems-a.ts'

let all = [...problemsA]
try {
  const { problemsB } = await import('../src/data/problems-b.ts')
  all = all.concat(problemsB)
} catch (e) {
  if (!String(e).includes('Cannot find module')) throw e
}

const ids = new Set()
let fails = 0
for (const p of all) {
  if (ids.has(p.id)) { console.log('DUP id', p.id); fails++ }
  ids.add(p.id)
  let fn
  try {
    fn = new Function(`${p.solution.js}\n;return ${p.fn}`)()
  } catch (e) { console.log('JS compile', p.id, e.message); fails++; continue }
  p.tests.forEach((t, i) => {
    try {
      const got = fn(...structuredClone(t.args))
      if (!compare(got, t.expected, p.compare ?? 'exact')) { console.log(`JS FAIL ${p.id} #${i}`, JSON.stringify(got), '!=', JSON.stringify(t.expected)); fails++ }
    } catch (e) { console.log(`JS ERR ${p.id} #${i}`, e.message); fails++ }
  })
}

const payload = join(tmpdir(), 'offer-problems.json')
writeFileSync(payload, JSON.stringify(all.map((p) => ({ id: p.id, fn: p.fn, py: p.solution.py, tests: p.tests, mode: p.compare ?? 'exact' }))))
const py = `
import json, sys, copy
def norm(v): return json.loads(json.dumps(v))
def key(v): return json.dumps(v, sort_keys=True, ensure_ascii=False)
def eq(a, b, fl):
    if isinstance(a, bool) or isinstance(b, bool): return a == b and type(a) == type(b)
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) <= 1e-6 * max(1, abs(b)) if fl else a == b
    if isinstance(a, list) and isinstance(b, list): return len(a) == len(b) and all(eq(x, y, fl) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict): return a.keys() == b.keys() and all(eq(a[k], b[k], fl) for k in a)
    return a == b
fails = 0
for p in json.load(open(sys.argv[1])):
    ns = {}
    exec(p["py"], ns)
    f = ns[p["fn"]]
    for i, t in enumerate(p["tests"]):
        try:
            got = norm(f(*copy.deepcopy(t["args"])))
            exp = norm(t["expected"])
            if p["mode"] == "unordered" and isinstance(got, list): got = sorted(got, key=key); exp = sorted(exp, key=key)
            if p["mode"] == "unordered-nested" and isinstance(got, list):
                got = sorted([sorted(x, key=key) if isinstance(x, list) else x for x in got], key=key)
                exp = sorted([sorted(x, key=key) if isinstance(x, list) else x for x in exp], key=key)
            if not eq(got, exp, p["mode"] == "float"):
                print("PY FAIL", p["id"], i, got, "!=", exp); fails += 1
        except Exception as e:
            print("PY ERR", p["id"], i, repr(e)); fails += 1
print("PY fails:", fails)
`
writeFileSync(join(tmpdir(), 'offer-verify.py'), py)
const out = execFileSync('python3', [join(tmpdir(), 'offer-verify.py'), payload]).toString()
console.log(out.trim())
console.log(`problems: ${all.length}, JS fails: ${fails}`)
