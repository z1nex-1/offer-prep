import type { IwoState, State } from '../lib/store.ts'
import { contestProblems, moduleLessons, trackDiagnostic, trackModules } from './content.ts'
import { modules } from './modules.ts'
import { trackOf } from './tracks.ts'

export type Mastery = 0 | 1 | 2

export const MASTERY_LABEL: Record<Mastery, string> = { 0: 'Учить с нуля', 1: 'Повторить и закрепить', 2: 'Знаю — только практика' }
export const MASTERY_CLASS: Record<Mastery, string> = { 0: 'hard', 1: 'medium', 2: 'easy' }

export const IWO_REGISTER = 'https://yandex.ru/yaintern/intern-week-offer/'

// Вес вопроса растёт с уровнем: верный ответ на сложный вопрос говорит о теме больше, чем на простой.
export function diagScores(iwo: IwoState): Record<string, { score: number; asked: number; total: number } | undefined> {
  const out: Record<string, { score: number; asked: number; total: number } | undefined> = {}
  if (!iwo.diag) return out
  const t = trackOf(iwo)
  const diagnostic = trackDiagnostic(t)
  for (const m of trackModules(t)) {
    const qs = diagnostic.filter((q) => q.module === m.id)
    if (!qs.length) continue
    let got = 0
    let max = 0
    let asked = 0
    for (const q of qs) {
      max += q.level
      const a = iwo.diag.answers[q.id]
      if (a === undefined) continue
      asked++
      if (a === q.answer) got += q.level
    }
    out[m.id] = { score: max ? got / max : 0, asked, total: qs.length }
  }
  return out
}

export function masteryFromScore(score: number): Mastery {
  if (score >= 0.75) return 2
  if (score >= 0.4) return 1
  return 0
}

export function moduleMastery(iwo: IwoState): Record<string, Mastery> {
  const scores = diagScores(iwo)
  const out: Record<string, Mastery> = {}
  const t = trackOf(iwo)
  for (const m of trackModules(t)) {
    const s = scores[m.id]
    let base: Mastery = s ? masteryFromScore(s.score) : iwo.settings?.startLevel === 'zero' || !iwo.diag ? 0 : 1
    if (m.id === 'start') base = 0
    // Пройденные уроки с хорошей самопроверкой поднимают уровень модуля.
    const ls = moduleLessons(m.id, t)
    if (ls.length && base < 2) {
      const good = ls.filter((l) => iwo.lessons[l.id] && (!l.check.length || (iwo.checks[l.id]?.score ?? 0) >= 0.8 * (iwo.checks[l.id]?.total ?? 1))).length
      if (good === ls.length) base = 2
      else if (good > 0 && base === 0) base = 1
    }
    out[m.id] = base
  }
  return out
}

export interface ModuleProgress {
  lessons: number
  lessonsDone: number
  practice: number
  practiceDone: number
  pct: number
}

export function moduleProgress(s: State, moduleId: string): ModuleProgress {
  const m = modules.find((x) => x.id === moduleId)!
  const ls = moduleLessons(moduleId, trackOf(s.iwo))
  const lessonsDone = ls.filter((l) => s.iwo.lessons[l.id]).length
  const contest = contestProblems.filter((p) => p.module === moduleId)
  const practice = m.problems.length + contest.length
  const practiceDone = m.problems.filter((id) => s.problems[id]).length + contest.filter((p) => s.iwo.contest[p.id]).length
  const total = ls.length + practice
  return { lessons: ls.length, lessonsDone, practice, practiceDone, pct: total ? ((lessonsDone + practiceDone) / total) * 100 : 0 }
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b + 'T00:00:00') - Date.parse(a + 'T00:00:00')) / 86400000)
}

export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
export function fmtDay(iso: string, withWeekday = true): string {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getDate()} ${MON[d.getMonth()]}${withWeekday ? `, ${WD[d.getDay()]}` : ''}`
}
