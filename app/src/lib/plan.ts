import { topicById, trackTopics } from '../data'
import { cases } from '../data/cases'
import { companyById } from '../data/companies'
import { problems } from '../data/problems'
import { sqlTasks } from '../data/sql'
import { trackById } from '../data/tracks'
import type { PlanSettings, State } from './store'

export type PlanKind = 'setup' | 'topic' | 'problems' | 'sql' | 'quiz' | 'case' | 'review' | 'mock' | 'contest'

export interface PlanItem {
  id: string
  kind: PlanKind
  title: string
  detail?: string
  minutes: number
  to: string
  optional?: boolean
  refs?: string[]
}

export interface PlanWeek {
  n: number
  items: PlanItem[]
  minutes: number
  focus: string
}

export interface Plan {
  weeks: PlanWeek[]
  dropped: PlanItem[]
  totalMinutes: number
  capacity: number
}

const LEVEL_FACTOR = { zero: 1.5, base: 1, strong: 0.6 }
const PRACTICE_PER_TOPIC = { must: 4, should: 2, light: 1, none: 0 }

function sqlTitle(b: { title: string }[]) {
  return b.length > 1 ? `SQL: «${b[0].title}» и ещё ${b.length - 1}` : `SQL: «${b[0].title}»`
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

export function buildPlan(s: PlanSettings): Plan {
  const track = trackById[s.track]
  const company = s.company ? companyById[s.company] : undefined
  const f = LEVEL_FACTOR[s.level]
  const q = new URLSearchParams({ track: s.track })
  if (s.stack) q.set('stack', s.stack)
  const qs = q.toString()
  const queue: PlanItem[] = []

  if (company) {
    queue.push({
      id: `setup:company:${company.id}`,
      kind: 'setup',
      title: `Разобрать отбор в ${company.name}`,
      detail: 'Этапы, секции, сроки набора, что ценят',
      minutes: 25,
      to: `/companies/${company.id}?track=${s.track}`,
    })
  }
  queue.push({ id: 'setup:resume', kind: 'setup', title: 'Резюме и анкета', detail: 'Собрать по чек-листу, добавить ссылки на проекты', minutes: 90, to: '/guide/resume' })
  queue.push({ id: 'setup:story', kind: 'setup', title: 'Самопрезентация и 3 истории по STAR', detail: 'Рассказ о себе на 2 минуты и примеры из проектов', minutes: 60, to: '/behavioral' })

  const list = trackTopics(track, s.stack).filter((t) => !t.id.startsWith('soft-'))
  const perTopic = PRACTICE_PER_TOPIC[track.practice.algorithms]
  const usedProblems = new Set<string>()
  const sqlQueue = track.practice.sql === 'none' ? [] : [...sqlTasks].sort((a, b) => ['easy', 'medium', 'hard'].indexOf(a.difficulty) - ['easy', 'medium', 'hard'].indexOf(b.difficulty))
  const sqlBatches = chunk(sqlQueue, 4).slice(0, track.practice.sql === 'must' ? 99 : track.practice.sql === 'should' ? 4 : 2)
  let sqlIdx = 0
  const caseTypes = track.practice.caseTypes ?? []
  const caseQueue = cases.filter((c) => caseTypes.includes(c.type) && (c.tracks.includes(s.track) || !c.tracks.length))
  let caseIdx = 0

  list.forEach((t, i) => {
    queue.push({
      id: `topic:${t.id}`,
      kind: 'topic',
      title: t.title,
      detail: `${t.area} · конспект и ${t.questions.length} вопросов`,
      minutes: Math.round((t.minutes + t.questions.length * 4) * f),
      to: `/topics/${t.id}?${qs}`,
      optional: t.level === 'plus',
      refs: [t.id],
    })
    if (t.id.startsWith('algo-') && perTopic > 0) {
      const pool = problems.filter((p) => p.topic === t.id && !usedProblems.has(p.id))
      const take = pool.slice(0, perTopic)
      take.forEach((p) => usedProblems.add(p.id))
      if (take.length) {
        queue.push({
          id: `problems:${t.id}`,
          kind: 'problems',
          title: `Задачи: ${t.title.split(':')[0].toLowerCase()}`,
          detail: take.map((p) => p.title).join(' · '),
          minutes: Math.round(take.reduce((m, p) => m + (p.difficulty === 'easy' ? 25 : p.difficulty === 'medium' ? 40 : 60), 0) * f),
          to: `/problems/${take[0].id}`,
          refs: take.map((p) => p.id),
        })
      }
    }
    if ((t.id === 'cs-sql' || (i % 3 === 2 && sqlIdx > 0)) && sqlIdx < sqlBatches.length) {
      const b = sqlBatches[sqlIdx++]
      queue.push({
        id: `sql:${sqlIdx}`,
        kind: 'sql',
        title: sqlTitle(b),
        detail: b.map((x) => x.title).join(' · '),
        minutes: Math.round(b.length * 18 * f),
        to: `/sql/${b[0].id}`,
        refs: b.map((x) => x.id),
      })
    }
    if (caseTypes.length && i % 4 === 3 && caseIdx < caseQueue.length) {
      const c = caseQueue[caseIdx++]
      queue.push({ id: `case:${c.id}`, kind: 'case', title: `Кейс: ${c.title}`, detail: 'С таймером и самопроверкой', minutes: c.minutes + 15, to: `/cases/${c.id}` })
    }
    if (track.practice.jsQuiz && t.id.startsWith('js-')) {
      queue.push({ id: `quiz:${t.id}`, kind: 'quiz', title: 'Что выведет JS: 10 задач', detail: 'Порядок выполнения, this, замыкания', minutes: 25, to: '/quiz' })
    }
  })
  while (sqlIdx < sqlBatches.length) {
    const b = sqlBatches[sqlIdx++]
    queue.push({ id: `sql:${sqlIdx}`, kind: 'sql', title: sqlTitle(b), detail: b.map((x) => x.title).join(' · '), minutes: Math.round(b.length * 18 * f), to: `/sql/${b[0].id}`, refs: b.map((x) => x.id), optional: true })
  }
  while (caseIdx < caseQueue.length) {
    const c = caseQueue[caseIdx++]
    queue.push({ id: `case:${c.id}`, kind: 'case', title: `Кейс: ${c.title}`, minutes: c.minutes + 15, to: `/cases/${c.id}`, optional: true })
  }
  if (perTopic > 0) {
    const rest = problems.filter((p) => !usedProblems.has(p.id))
    chunk(rest, 3).forEach((b, i) =>
      queue.push({
        id: `problems:extra:${i}`,
        kind: 'problems',
        title: 'Дополнительные задачи',
        detail: b.map((p) => p.title).join(' · '),
        minutes: Math.round(b.length * 40 * f),
        to: `/problems/${b[0].id}`,
        refs: b.map((p) => p.id),
        optional: true,
      }),
    )
  }

  const capacity = s.hours * 60
  const weeks: PlanWeek[] = Array.from({ length: s.weeks }, (_, i) => ({ n: i + 1, items: [], minutes: 0, focus: '' }))
  const mockFrom = Math.max(1, Math.floor(s.weeks * 0.45))
  weeks.forEach((w) => {
    if (w.n >= 2) {
      const r: PlanItem = { id: `review:${w.n}`, kind: 'review', title: 'Повторение карточек', detail: 'Вопросы, которые пора повторить', minutes: 30, to: `/questions?track=${s.track}&mode=cards` }
      w.items.push(r)
      w.minutes += r.minutes
    }
    if (w.n > mockFrom || w.n === s.weeks) {
      const m: PlanItem = { id: `mock:${w.n}`, kind: 'mock', title: 'Пробное интервью', detail: company ? `В формате ${company.name}` : 'По выбранному направлению', minutes: 75, to: `/mock?track=${s.track}${company ? `&company=${company.id}` : ''}` }
      w.items.push(m)
      w.minutes += m.minutes
    }
  })
  if (company && s.weeks >= 2) {
    const w = weeks[s.weeks - 2]
    const program = company.programs[0]
    const c: PlanItem = { id: 'contest:rehearsal', kind: 'contest', title: `Генеральная репетиция отбора ${company.name}`, detail: 'Тренировочный контест или тестовое прошлых лет в реальных условиях', minutes: 180, to: program ? program.url : '/problems' }
    w.items.push(c)
    w.minutes += c.minutes
  }

  const mandatory = queue.filter((x) => !x.optional)
  const optional = queue.filter((x) => x.optional)
  const dropped: PlanItem[] = []
  let wi = 0
  const place = (item: PlanItem, strict: boolean) => {
    while (wi < weeks.length && weeks[wi].minutes + item.minutes > capacity * (strict ? 1 : 1.05) && weeks[wi].minutes > capacity * 0.6) wi++
    if (wi >= weeks.length) return false
    weeks[wi].items.splice(weeks[wi].items.length - weeks[wi].items.filter((x) => x.kind === 'review' || x.kind === 'mock' || x.kind === 'contest').length, 0, item)
    weeks[wi].minutes += item.minutes
    return true
  }
  for (const item of mandatory) if (!place(item, false)) dropped.push(item)
  for (const item of optional) if (!place(item, true)) dropped.push(item)

  weeks.forEach((w) => {
    const areas = [...new Set(w.items.filter((x) => x.kind === 'topic').map((x) => topicById[x.refs![0]]?.area))].filter(Boolean)
    w.focus = areas.length ? areas.slice(0, 3).join(', ') : w.items.some((x) => x.kind === 'mock') ? 'Пробные интервью и повторение' : 'Подготовка'
  })

  const totalMinutes = queue.reduce((m, x) => m + x.minutes, 0)
  return { weeks, dropped, totalMinutes, capacity }
}

export function itemDone(item: PlanItem, s: State): boolean {
  if (s.planDone[item.id]) return true
  if (item.kind === 'topic') return !!s.topics[item.refs![0]]
  if (item.kind === 'problems') return !!item.refs?.length && item.refs.every((r) => s.problems[r])
  if (item.kind === 'sql') return !!item.refs?.length && item.refs.every((r) => s.sql[r])
  if (item.kind === 'case') return s.cases[item.id.slice(5)] !== undefined
  return false
}
