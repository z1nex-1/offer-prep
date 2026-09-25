import { modules } from './modules.ts'
import { parseContest, parseDiag, parseLesson } from './parse.ts'
import { TRACKS, inTrack } from './tracks.ts'
import type { CodeRunProblem, ContestProblem, DiagQ, Lesson, Track, YandexPick } from './types.ts'
import coderunRaw from './content/coderun.json'
import contestGen from './content/contest.gen.json'

const lessonFiles = import.meta.glob('./content/lessons/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const diagFiles = import.meta.glob('./content/diag/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const contestFiles = import.meta.glob('./content/contest/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const yandexFiles = import.meta.glob('./content/yandex/*.json', { import: 'default', eager: true }) as Record<string, YandexPick[]>
const contestSolutions = import.meta.glob('./content/contest/*.sol.py', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const moduleOrder = new Map(modules.map((m, i) => [m.id, i]))

export const lessons: Lesson[] = Object.entries(lessonFiles)
  .map(([file, src]) => ({ ...parseLesson(src, file), order: Number(file.match(/\/(\d+)-/)?.[1] ?? 0) }))
  .sort((a, b) => (moduleOrder.get(a.module) ?? 99) - (moduleOrder.get(b.module) ?? 99) || a.order - b.order)
  .map(({ order: _order, ...l }) => l)

export const lessonById: Record<string, Lesson> = Object.fromEntries(lessons.map((l) => [l.id, l]))

const lessonInTrack = (l: Lesson, t?: Track) => !t || !l.track || l.track === t

// Без направления — все уроки модуля; с направлением — без уроков, написанных под другое направление.
export function moduleLessons(moduleId: string, t?: Track): Lesson[] {
  return lessons.filter((l) => l.module === moduleId && lessonInTrack(l, t))
}

export function trackModules(t: Track) {
  const parts = TRACKS[t].parts
  return modules.filter((m) => inTrack(m, t) && parts.includes(m.part)).sort((a, b) => parts.indexOf(a.part) - parts.indexOf(b.part))
}

const trackModuleIds = (t: Track) => new Set(trackModules(t).map((m) => m.id))

export function trackLessons(t: Track): Lesson[] {
  const ids = trackModuleIds(t)
  return lessons.filter((l) => ids.has(l.module) && lessonInTrack(l, t))
}

export const diagnostic: DiagQ[] = Object.entries(diagFiles)
  .flatMap(([file, src]) => parseDiag(src, file))
  .sort((a, b) => (moduleOrder.get(a.module) ?? 99) - (moduleOrder.get(b.module) ?? 99) || a.level - b.level)

const gen = contestGen as Record<string, { samples: { in: string; out: string }[]; count: number }>

export const contestProblems: ContestProblem[] = Object.entries(contestFiles)
  .map(([file, src]) => {
    const p = parseContest(src, file)
    const g = gen[p.id] ?? { samples: [], count: 0 }
    return {
      ...p,
      solution: contestSolutions[file.replace(/\.md$/, '.sol.py')] ?? '',
      samples: g.samples,
      testCount: g.count,
    }
  })
  .sort((a, b) => (moduleOrder.get(a.module) ?? 99) - (moduleOrder.get(b.module) ?? 99) || ['easy', 'medium', 'hard'].indexOf(a.difficulty) - ['easy', 'medium', 'hard'].indexOf(b.difficulty))

export function trackDiagnostic(t: Track): DiagQ[] {
  const ids = trackModuleIds(t)
  return diagnostic.filter((q) => ids.has(q.module) && (!q.lesson || !lessonById[q.lesson] || lessonInTrack(lessonById[q.lesson], t)))
}

export function trackContest(t: Track): ContestProblem[] {
  const ids = trackModuleIds(t)
  return contestProblems.filter((p) => ids.has(p.module))
}

export const contestById: Record<string, ContestProblem> = Object.fromEntries(contestProblems.map((p) => [p.id, p]))

export const coderun = coderunRaw as CodeRunProblem[]

export const SELECTIONS: Record<string, { title: string; note: string }> = {
  'backend-interview': { title: 'Стажировка // Бэкенд', note: 'Подборка от интервьюеров Яндекса для бэкенд-стажёров' },
  'yandex-interview': { title: 'Собеседование в Яндекс', note: 'Задачи из официальной статьи об алгоритмических секциях' },
  '2024-summer-backend': { title: 'Бэкенд, сезон CodeRun', note: 'Задачи трека «Бэкенд» — ближе всего к контесту' },
  'algorithm-training-march-2026': { title: 'Тренировки: от алгоритмов к стажировке', note: 'Каждая задача — до 30 минут, как на секции' },
  'algorithm-training-september-2025': { title: 'Тренировки: забег по алгоритмам', note: 'Востребованные на собеседованиях темы' },
  quickstart: { title: 'Быстрый старт', note: 'Разминка для знакомства с платформой' },
  'dev-go-interview': { title: 'Собеседование в Городские сервисы', note: 'Задачи с секций команды' },
  'hr-tech-interview': { title: 'Собеседование в Эйчартех', note: 'Задачи с секций команды' },
  'winter-intern-2024': { title: 'Зимний день стажёра', note: 'Задачи для стажёров' },
  'autumn-intern-2023': { title: 'Осенний день стажёра', note: 'Задачи для стажёров' },
  mgustokashin: { title: 'Подборка Михаила Густокашина', note: 'Тренер чемпионов ICPC, автор тренировок Яндекса' },
  atolstikov: { title: 'Подборка Алексея Толстикова', note: 'Руководитель ШАД' },
}

// Пороги по «цифровой сложности» CodeRun: ниже 20 — разминка, от 40 — уровень сильного контеста.
export function coderunLevel(p: CodeRunProblem): 1 | 2 | 3 {
  if (p.rate < 20) return 1
  if (p.rate < 40) return 2
  return 3
}

export function coderunForModule(moduleId: string): CodeRunProblem[] {
  const m = modules.find((x) => x.id === moduleId)
  if (!m || !m.coderunTags.length) return []
  const primary = m.coderunTags
  return coderun
    .filter((p) => p.tags.some((t) => primary.includes(t)))
    .sort((a, b) => a.rate - b.rate)
}

const coderunBySlug = new Map(coderun.map((p) => [p.slug, p]))

// Ручная подборка задач Яндекса к модулю: порядок задан автором и идёт в план первым.
export function yandexPicks(moduleId: string): { p: CodeRunProblem; note?: string }[] {
  const list = yandexFiles[`./content/yandex/${moduleId}.json`] ?? []
  return list.flatMap((x) => {
    const p = coderunBySlug.get(x.slug)
    return p ? [{ p, note: x.note }] : []
  })
}

export const coderunUrl = (slug: string) => `https://coderun.yandex.ru/problem/${slug}`

const testCache = new Map<string, Promise<{ in: string; out: string }[]>>()

export function loadContestTests(id: string) {
  if (!testCache.has(id))
    testCache.set(
      id,
      fetch(`contest/${id}.json`).then((r) => {
        if (!r.ok) throw new Error('Не удалось загрузить тесты')
        return r.json()
      }),
    )
  const pr = testCache.get(id)!
  pr.catch(() => testCache.delete(id))
  return pr
}
