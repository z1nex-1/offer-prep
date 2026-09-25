import { plural } from '../components/ui.tsx'
import { problems } from '../data/problems.ts'
import type { State } from '../lib/store.ts'
import { coderunForModule, coderunLevel, contestProblems, moduleLessons, trackDiagnostic, trackModules, yandexPicks } from './content.ts'
import { modules } from './modules.ts'
import { IWO_REGISTER, addDays, daysBetween, fmtDay, moduleMastery, type Mastery } from './progress.ts'
import { TRACKS, trackOf } from './tracks.ts'
import type { Track } from './types.ts'

export type TaskKind = 'lesson' | 'problem' | 'contest' | 'coderun' | 'review' | 'virtual' | 'mock' | 'milestone' | 'interview' | 'setup'

export interface Task {
  id: string
  kind: TaskKind
  title: string
  detail?: string
  minutes: number
  to: string
  external?: boolean
  ref?: string
  module?: string
  optional?: boolean
}

export interface Day {
  date: string
  phase: 'learn' | 'contest' | 'interview' | 'sections'
  tasks: Task[]
  minutes: number
  capacity: number
  note?: string
}

export interface CoursePlan {
  days: Day[]
  extra: Task[]
  mastery: Record<string, Mastery>
  contestDate: string
}

const PROBLEM_MIN = { easy: 20, medium: 35, hard: 50 }
const CODERUN_MIN = { 1: 25, 2: 40, 3: 60 }

function problemTask(id: string, f: number, module: string): Task | null {
  const p = problems.find((x) => x.id === id)
  if (!p) return null
  return { id: `problem:${id}`, kind: 'problem', title: p.title, detail: `Своя задача · ${p.pattern}`, minutes: Math.round(PROBLEM_MIN[p.difficulty] * f), to: `/problems/${id}`, ref: id, module }
}

function moduleTasks(moduleId: string, mastery: Mastery, used: Set<string>, answers: Record<string, number>, track: Track): Task[] {
  const m = modules.find((x) => x.id === moduleId)!
  const out: Task[] = []
  const lessonFactor = mastery === 0 ? 1 : 0.5
  const diagnostic = trackDiagnostic(track)
  for (const l of moduleLessons(moduleId, track)) {
    if (mastery === 2 && moduleId !== 'start') continue
    // Урок пропускается, если все вопросы диагностики, помеченные этим уроком, отвечены верно.
    const tagged = diagnostic.filter((q) => q.lesson === l.id)
    if (tagged.length && tagged.every((q) => answers[q.id] === q.answer)) continue
    out.push({
      id: `lesson:${l.id}`,
      kind: 'lesson',
      title: l.title,
      detail: mastery === 0 ? `Теория и ${plural(l.check.length, "вопрос", "вопроса", "вопросов")} самопроверки` : 'Повторить теорию и пройти самопроверку',
      minutes: Math.max(10, Math.round((l.minutes + l.check.length * 1.5) * lessonFactor)),
      to: `/iwo/l/${l.id}`,
      ref: l.id,
      module: moduleId,
    })
  }
  const pick = <T,>(arr: T[], n: number) => arr.slice(0, Math.max(0, n))
  const own = m.problems
    .map((id) => problems.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .sort((a, b) => ['easy', 'medium', 'hard'].indexOf(a.difficulty) - ['easy', 'medium', 'hard'].indexOf(b.difficulty))
  const ownPick = mastery === 0 ? own.filter((p) => p.difficulty !== 'hard').slice(0, 3) : mastery === 1 ? own.filter((p) => p.difficulty !== 'easy').slice(0, 2) : own.filter((p) => p.difficulty !== 'easy').slice(-1)
  for (const p of ownPick) {
    const t = problemTask(p.id, 1, moduleId)
    if (t) out.push(t)
  }
  const contest = contestProblems.filter((p) => p.module === moduleId)
  const contestPick = mastery === 0 ? contest.slice(0, 2) : mastery === 1 ? contest.slice(0, 2) : contest.slice(-1)
  for (const p of contestPick)
    out.push({ id: `contest:${p.id}`, kind: 'contest', title: p.title, detail: 'Задача в формате контеста: ввод и вывод', minutes: PROBLEM_MIN[p.difficulty] + 5, to: `/iwo/contest/${p.id}`, ref: p.id, module: moduleId })
  const picks = yandexPicks(moduleId).filter((x) => !used.has(x.p.slug))
  const cr = coderunForModule(moduleId).filter((p) => !used.has(p.slug) && p.d !== 'U')
  const levels: (1 | 2 | 3)[] = mastery === 0 ? [1, 1, 2] : mastery === 1 ? [2, 2, 3] : [2, 3, 3]
  const n = m.weight === 3 ? 3 : 2
  // Сначала задачи из официальных подборок для собеседований — они ближе всего к тому, что дадут.
  const ranked = [...cr].sort((a, b) => Number(b.sel.length > 0) - Number(a.sel.length > 0) || a.rate - b.rate)
  // Ручная подборка к модулю идёт первой: сколько задач брать — по уровню владения темой.
  const pickN = mastery === 0 ? 4 : mastery === 1 ? 3 : 2
  const fromPicks = (mastery === 2 ? picks.filter((x) => coderunLevel(x.p) >= 2) : picks).slice(0, pickN)
  for (const { p, note } of fromPicks) {
    used.add(p.slug)
    out.push({ id: `coderun:${p.slug}`, kind: 'coderun', title: p.title, detail: note ? `CodeRun · ${note}` : `CodeRun · ${p.tags.join(', ')}`, minutes: CODERUN_MIN[coderunLevel(p)], to: `https://coderun.yandex.ru/problem/${p.slug}`, external: true, ref: p.slug, module: moduleId })
  }
  for (const lv of fromPicks.length ? [] : pick(levels, n)) {
    const p = ranked.find((x) => coderunLevel(x) === lv && !used.has(x.slug))
    if (!p) continue
    used.add(p.slug)
    out.push({
      id: `coderun:${p.slug}`,
      kind: 'coderun',
      title: p.title,
      detail: `CodeRun · ${p.tags.join(', ')}`,
      minutes: CODERUN_MIN[lv],
      to: `https://coderun.yandex.ru/problem/${p.slug}`,
      external: true,
      ref: p.slug,
      module: moduleId,
      optional: lv === 3 && mastery === 0,
    })
  }
  return out
}

export function buildCoursePlan(s: State, today: string): CoursePlan | null {
  const st = s.iwo.settings
  if (!st) return null
  const track = trackOf(s.iwo)
  const T = TRACKS[track]
  const mastery = moduleMastery(s.iwo)
  const cap = st.hours * 60
  const start = st.start > today ? st.start : today
  // Дата из настроек могла быть выбрана для другого направления с более поздним дедлайном.
  const contestDate = st.contestDate > T.contestDeadline ? T.contestDeadline : st.contestDate
  const days: Day[] = []
  for (let d = start; d <= T.sectionsEnd; d = addDays(d, 1)) {
    const phase: Day['phase'] = d < contestDate ? 'learn' : d === contestDate ? 'contest' : d < T.sectionsStart ? 'interview' : 'sections'
    days.push({ date: d, phase, tasks: [], minutes: 0, capacity: phase === 'sections' ? Math.min(cap, 120) : cap })
  }
  const learnDays = days.filter((d) => d.phase === 'learn')
  const interviewDays = days.filter((d) => d.phase === 'interview')

  const put = (day: Day, t: Task) => {
    day.tasks.push(t)
    day.minutes += t.minutes
  }

  // Опорные точки: репетиции контеста, сам контест, повторение.
  const contestDay = days.find((d) => d.phase === 'contest')
  if (contestDay) {
    put(contestDay, { id: 'milestone:contest', kind: 'milestone', title: 'Контест Intern week offer', detail: `Зарегистрироваться и пройти контест в спокойной обстановке: ${T.contestTasks} задач за ${T.contestHours} часов. Дедлайн — ${fmtDay(T.contestDeadline, false)} 23:59 по Москве.`, minutes: T.contestHours * 60, to: IWO_REGISTER, external: true })
  }
  if (learnDays.length >= 3) {
    const rehearsal = learnDays[learnDays.length - 2]
    put(rehearsal, { id: 'virtual:final', kind: 'virtual', title: 'Генеральная репетиция контеста', detail: `${T.contestTasks} задач, ${T.contestHours} часов, без подсказок и разборов`, minutes: T.contestHours * 60, to: '/iwo/contest?virtual=final' })
  }
  if (learnDays.length >= 10) {
    const mid = learnDays[Math.floor(learnDays.length * 0.55)]
    put(mid, { id: 'virtual:mid', kind: 'virtual', title: 'Пробный контест', detail: '4 задачи, 3 часа — проверить темп и слабые темы', minutes: 180, to: '/iwo/contest?virtual=mid' })
  }
  learnDays.forEach((d, i) => {
    if (i >= 2 && d.minutes < d.capacity * 0.8)
      put(d, { id: `review:${d.date}`, kind: 'review', title: 'Повторение карточек', detail: 'Вопросы из пройденных уроков, которые пора повторить', minutes: 15, to: '/iwo/review' })
  })
  interviewDays.forEach((d, i) => {
    put(d, { id: `review:${d.date}`, kind: 'review', title: 'Повторение карточек', detail: 'Теория вслух: отвечать до того, как открыть ответ', minutes: 25, to: '/iwo/review' })
    put(d, { id: `interview:${d.date}`, kind: 'interview', title: 'Две задачи в режиме собеседования', detail: 'Без запуска кода, 25 минут на задачу, рассуждение вслух', minutes: 60, to: '/iwo/interview' })
    if (i % 2 === 1 || i === interviewDays.length - 1)
      put(d, { id: `mock:${d.date}`, kind: 'mock', title: 'Пробное интервью в формате Яндекса', detail: 'Код, теория и отчёт со слабыми темами', minutes: 75, to: `/mock?track=${T.mockTrack}&company=yandex` })
  })
  days
    .filter((d) => d.phase === 'sections')
    .forEach((d) =>
      put(d, { id: `sections:${d.date}`, kind: 'interview', title: 'Неделя секций', detail: 'Одна задача в режиме собеседования для разогрева, повторение карточек, выспаться перед секцией', minutes: 60, to: '/iwo/interview' }),
    )

  const used = new Set<string>()
  const learnQueue: Task[] = [{ id: 'setup:register', kind: 'setup', title: 'Зарегистрироваться на Intern week offer', detail: `Анкета: учёба, проекты, олимпиады. Контест можно пройти позже, до ${fmtDay(T.contestDeadline, false)}.`, minutes: 30, to: IWO_REGISTER, external: true }]
  const interviewQueue: Task[] = []
  const ms = trackModules(track)
  for (const m of ms) {
    const tasks = moduleTasks(m.id, mastery[m.id] ?? 0, used, s.iwo.diag?.answers ?? {}, track)
    if (m.stage === 'interview') interviewQueue.push(...tasks)
    else learnQueue.push(...tasks)
  }
  // Устная часть по алгоритмическим модулям идёт в фазу собеседований.
  interviewQueue.unshift(
    ...ms
      .filter((m) => (m.part === 'algo' || m.part === 'ml') && m.stage !== 'interview')
      .map<Task>((m) => ({ id: `oral:${m.id}`, kind: 'review', title: `Вопросы вслух: ${m.title.toLowerCase()}`, detail: 'Объяснить идеи и сложность, как на секции', minutes: 20, to: `/iwo/m/${m.id}#oral`, module: m.id, optional: m.weight < 3 })),
  )

  const extra: Task[] = []
  const fill = (queue: Task[], pool: Day[]) => {
    const mandatory = queue.filter((t) => !t.optional)
    const optional = queue.filter((t) => t.optional)
    let di = 0
    const place = (t: Task, strict: boolean) => {
      while (di < pool.length && pool[di].minutes + t.minutes > pool[di].capacity * (strict ? 1 : 1.1) && pool[di].minutes > pool[di].capacity * 0.5) di++
      if (di >= pool.length) return false
      // Задачи дня идут перед повторением и репетициями.
      const tail = pool[di].tasks.filter((x) => x.kind === 'review' || x.kind === 'virtual' || x.kind === 'mock').length
      pool[di].tasks.splice(pool[di].tasks.length - tail, 0, t)
      pool[di].minutes += t.minutes
      return true
    }
    for (const t of mandatory) if (!place(t, false)) extra.push(t)
    for (const t of optional) if (!place(t, true)) extra.push({ ...t, optional: true })
  }
  // Дни с репетицией контеста не нагружаем новой теорией.
  fill(learnQueue, learnDays.filter((d) => !d.tasks.some((t) => t.kind === 'virtual' && t.id === 'virtual:final')))
  fill(interviewQueue, interviewDays)

  if (daysBetween(start, contestDate) < 7) {
    const first = days[0]
    if (first) first.note = 'До контеста меньше недели: план сжат до самого важного, остальное — в блоке «Если останется время».'
  }
  return { days, extra, mastery, contestDate }
}

export function taskDone(t: Task, s: State): boolean {
  if (s.iwo.done[t.id]) return true
  if (t.kind === 'lesson') return !!s.iwo.lessons[t.ref!]
  if (t.kind === 'problem') return !!s.problems[t.ref!]
  if (t.kind === 'contest') return !!s.iwo.contest[t.ref!]
  if (t.kind === 'coderun') return !!s.iwo.coderun[t.ref!]
  return false
}
