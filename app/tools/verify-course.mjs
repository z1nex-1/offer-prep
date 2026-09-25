// Проверяет контент курса: разбор всех уроков, диагностики и задач, ссылки между ними,
// а вопросы «Что выведет код?» — запуском кода в python3 и сравнением с отмеченным ответом.
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { parseContest, parseDiag, parseLesson } from '../src/course/parse.ts'
import { modules } from '../src/course/modules.ts'
import { TRACKS } from '../src/course/tracks.ts'
import { problems } from '../src/data/problems.ts'

const ROOT = new URL('../src/course/content/', import.meta.url).pathname
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
let fails = 0
const fail = (...a) => {
  console.log(...a)
  fails++
}

const moduleIds = new Set(modules.map((m) => m.id))
const TRACK_IDS = new Set(Object.keys(TRACKS))
for (const m of modules) for (const t of m.tracks ?? []) if (!TRACK_IDS.has(t)) fail('НЕТ НАПРАВЛЕНИЯ', t, 'в модуле', m.id)
const problemIds = new Set(problems.map((p) => p.id))
for (const m of modules) for (const p of m.problems) if (!problemIds.has(p)) fail('НЕТ ЗАДАЧИ', p, 'в модуле', m.id)

const printQs = []
const lessonIds = new Set()
const perModule = {}
let words = 0
let checks = 0
let orals = 0
for (const f of walk(join(ROOT, 'lessons')).filter((f) => f.endsWith('.md'))) {
  const rel = relative(ROOT, f)
  try {
    const l = parseLesson(readFileSync(f, 'utf8'), rel)
    if (lessonIds.has(l.id)) fail('ДУБЛЬ урока', l.id)
    lessonIds.add(l.id)
    if (!moduleIds.has(l.module)) fail('НЕТ МОДУЛЯ', l.module, rel)
    if (!rel.startsWith(`lessons/${l.module}/`)) fail('УРОК НЕ В СВОЕЙ ПАПКЕ', rel)
    if (l.track && !TRACK_IDS.has(l.track)) fail('НЕТ НАПРАВЛЕНИЯ', l.track, rel)
    if (/\$[^$\n]+\$/.test(l.body)) fail('LaTeX не отображается', rel)
    perModule[l.module] = (perModule[l.module] ?? 0) + 1
    words += l.body.split(/\s+/).length
    checks += l.check.length
    orals += l.oral.length
    if (l.check.length < 4) fail('МАЛО САМОПРОВЕРКИ', rel, l.check.length)
    for (const q of [...l.check]) if (/выведет/i.test(q.q)) printQs.push({ where: rel, q })
    for (const o of l.oral) if (!o.a) fail('ПУСТОЙ ОТВЕТ', rel, o.q)
  } catch (e) {
    fail(String(e.message ?? e))
  }
}

let diagN = 0
const diagPer = {}
for (const f of walk(join(ROOT, 'diag')).filter((f) => f.endsWith('.md'))) {
  const rel = relative(ROOT, f)
  try {
    const qs = parseDiag(readFileSync(f, 'utf8'), rel)
    diagN += qs.length
    for (const q of qs) {
      if (!moduleIds.has(q.module)) fail('НЕТ МОДУЛЯ', q.module, rel)
      diagPer[q.module] = (diagPer[q.module] ?? 0) + 1
      if (/выведет/i.test(q.q)) printQs.push({ where: rel, q })
    }
  } catch (e) {
    fail(String(e.message ?? e))
  }
}

// Воркер тренажёра обрезает вывод программы; эталон длиннее порога получил бы WA даже у верного решения.
const outCap = Number(readFileSync(new URL('../src/workers/py.worker.ts', import.meta.url), 'utf8').match(/out\.length > (\d+)/)?.[1] ?? 0)
const PUB = new URL('../public/contest/', import.meta.url).pathname
const gen = existsSync(join(ROOT, 'contest.gen.json')) ? JSON.parse(readFileSync(join(ROOT, 'contest.gen.json'), 'utf8')) : {}
let contestN = 0
for (const f of walk(join(ROOT, 'contest')).filter((f) => f.endsWith('.md'))) {
  const rel = relative(ROOT, f)
  try {
    const p = parseContest(readFileSync(f, 'utf8'), rel)
    contestN++
    if (!moduleIds.has(p.module)) fail('НЕТ МОДУЛЯ', p.module, rel)
    if (!gen[p.id]) fail('НЕТ ТЕСТОВ — запустите tools/build-contest.py', p.id)
    else if (existsSync(join(PUB, p.id + '.json'))) {
      const longest = Math.max(...JSON.parse(readFileSync(join(PUB, p.id + '.json'), 'utf8')).map((t) => t.out.length))
      if (!outCap || longest > outCap) fail('ВЫВОД ДЛИННЕЕ ПОРОГА ВОРКЕРА', p.id, longest, '>', outCap)
    }
    if (!p.explanation) fail('НЕТ РАЗБОРА', rel)
    if (/\$[^$\n]+\$/.test(p.statement)) fail('LaTeX не отображается', rel)
  } catch (e) {
    fail(String(e.message ?? e))
  }
}

const coderunSlugs = new Set(JSON.parse(readFileSync(join(ROOT, 'coderun.json'), 'utf8')).map((p) => p.slug))
let picksN = 0
if (existsSync(join(ROOT, 'yandex')))
  for (const f of readdirSync(join(ROOT, 'yandex')).filter((f) => f.endsWith('.json'))) {
    if (!moduleIds.has(f.replace(/\.json$/, ''))) fail('НЕТ МОДУЛЯ для подборки', f)
    for (const x of JSON.parse(readFileSync(join(ROOT, 'yandex', f), 'utf8'))) {
      picksN++
      if (!coderunSlugs.has(x.slug)) fail('НЕТ ЗАДАЧИ CodeRun', x.slug, 'в', f)
    }
  }
for (const f of walk(join(ROOT, 'diag')).filter((f) => f.endsWith('.md')))
  for (const q of parseDiag(readFileSync(f, 'utf8'), relative(ROOT, f))) if (q.lesson && !lessonIds.has(q.lesson)) fail('НЕТ УРОКА', q.lesson, 'в', relative(ROOT, f))

// Вопросы «что выведет»: код из первого блока ```python, правильный вариант — в обратных кавычках.
const runnable = printQs
  .map(({ where, q }) => {
    const code = q.q.match(/```python\n([\s\S]*?)```/)?.[1]
    const right = q.options[q.answer].match(/^`([^`]*)`$/)?.[1]
    return code && right !== undefined ? { where, title: q.q.split('\n')[0], code, right, options: q.options } : null
  })
  .filter(Boolean)
const payload = join(tmpdir(), 'iwo-print.json')
writeFileSync(payload, JSON.stringify(runnable))
const py = `
import json, sys, io, contextlib
bad = 0
for item in json.load(open(sys.argv[1])):
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            exec(item["code"], {"__name__": "__main__"})
        got = buf.getvalue().strip()
    except Exception as e:
        got = buf.getvalue().strip()
        got = (got + "\\n" if got else "") + type(e).__name__
    want = item["right"].replace("\\\\n", "\\n").strip()
    if got != want:
        bad += 1
        print("ВЫВОД НЕ СОВПАЛ", item["where"], "|", item["code"].strip().splitlines()[0][:60], "| ждали:", repr(want), "получили:", repr(got))
    others = [o.strip("\`") for i, o in enumerate(item["options"]) if o.startswith("\`")]
    if len(set(others)) != len(others):
        bad += 1
        print("ОДИНАКОВЫЕ ВАРИАНТЫ", item["where"])
print("print-bad", bad)
`
writeFileSync(join(tmpdir(), 'iwo-print.py'), py)
const out = execFileSync('python3', [join(tmpdir(), 'iwo-print.py'), payload]).toString().trim()
const bad = Number(out.match(/print-bad (\d+)/)?.[1] ?? 0)
if (out.replace(/print-bad \d+/, '').trim()) console.log(out.replace(/print-bad \d+/, '').trim())
fails += bad

console.log(`уроков ${lessonIds.size}, слов теории ~${words}, самопроверка ${checks}, устных вопросов ${orals}, диагностика ${diagN}, контест-задач ${contestN}, подборка CodeRun ${picksN}, проверено запуском ${runnable.length}`)
console.log('уроков по модулям:', modules.map((m) => `${m.id}:${perModule[m.id] ?? 0}/${diagPer[m.id] ?? 0}`).join(' '))
if (fails) {
  console.log('ОШИБОК:', fails)
  process.exit(1)
}
