import { useSyncExternalStore } from 'react'
import type { Track } from '../course/types.ts'
import type { CompanyId, TrackId } from '../types'

export interface CardState {
  box: number
  due: number
  seen: number
  last: 'know' | 'unsure' | 'dont'
}

export interface MockResult {
  at: number
  track: TrackId
  company?: CompanyId
  score: number
  total: number
  weak: string[]
}

export interface PlanSettings {
  track: TrackId
  stack?: string
  company?: CompanyId
  weeks: number
  hours: number
  level: 'zero' | 'base' | 'strong'
  start: number
}

export interface State {
  v: 1
  profile: { track?: TrackId; stack?: string; company?: CompanyId }
  topics: Record<string, number>
  cards: Record<string, CardState>
  problems: Record<string, { at: number; lang: string }>
  sql: Record<string, number>
  quiz: Record<string, boolean>
  cases: Record<string, number>
  mocks: MockResult[]
  plan?: PlanSettings
  planDone: Record<string, number>
  checklist: Record<string, boolean>
  code: Record<string, string>
  notes: Record<string, string>
  iwo: IwoState
}
export interface IwoState {
  track?: Track
  diag?: { at: number; answers: Record<string, number> }
  lessons: Record<string, number>
  checks: Record<string, { at: number; score: number; total: number }>
  contest: Record<string, number>
  coderun: Record<string, number>
  settings?: { contestDate: string; hours: number; start: string; startLevel?: 'auto' | 'zero' }
  done: Record<string, number>
  virtual?: { start: number; minutes: number; ids: string[] }
  virtualHistory: { at: number; solved: number; total: number; minutes: number }[]
}

export const emptyIwo = (): IwoState => ({ lessons: {}, checks: {}, contest: {}, coderun: {}, done: {}, virtualHistory: [] })

const KEY = 'offer.state.v1'

const empty = (): State => ({
  v: 1,
  profile: {},
  topics: {},
  cards: {},
  problems: {},
  sql: {},
  quiz: {},
  cases: {},
  mocks: [],
  planDone: {},
  checklist: {},
  code: {},
  notes: {},
  iwo: emptyIwo(),
})

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw)
    return { ...empty(), ...parsed, iwo: { ...emptyIwo(), ...parsed.iwo } }
  } catch {
    return empty()
  }
}

let state: State = load()
const listeners = new Set<() => void>()

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return
    state = load()
    listeners.forEach((l) => l())
  })
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* приватный режим или переполнение — прогресс живёт до перезагрузки */
  }
}

export function update(fn: (s: State) => State) {
  state = fn(state)
  persist()
  listeners.forEach((l) => l())
}

export function getState() {
  return state
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => select(state),
  )
}

export function exportState(): string {
  return JSON.stringify(state, null, 2)
}

export function importState(json: string) {
  const parsed = JSON.parse(json)
  if (!parsed || parsed.v !== 1) throw new Error('Неизвестный формат файла')
  update(() => ({ ...empty(), ...parsed, iwo: { ...emptyIwo(), ...parsed.iwo } }))
}

export function resetState() {
  update(() => empty())
}

const DAY = 86400000
const INTERVALS = [0, 1, 3, 7, 16, 35]

export function rateCard(id: string, grade: 'know' | 'unsure' | 'dont') {
  update((s) => {
    const prev = s.cards[id]
    let box = prev?.box ?? 0
    if (grade === 'know') box = Math.min(box + 1, INTERVALS.length - 1)
    else if (grade === 'unsure') box = Math.max(1, box)
    else box = 0
    const due = Date.now() + (grade === 'dont' ? 10 * 60000 : INTERVALS[box] * DAY)
    return {
      ...s,
      cards: { ...s.cards, [id]: { box, due, seen: (prev?.seen ?? 0) + 1, last: grade } },
    }
  })
}

export function toggleTopic(id: string) {
  update((s) => {
    const topics = { ...s.topics }
    if (topics[id]) delete topics[id]
    else topics[id] = Date.now()
    return { ...s, topics }
  })
}

export function togglePlanItem(id: string) {
  update((s) => {
    const planDone = { ...s.planDone }
    if (planDone[id]) delete planDone[id]
    else planDone[id] = Date.now()
    return { ...s, planDone }
  })
}

export function updateIwo(fn: (s: IwoState) => IwoState) {
  update((s) => ({ ...s, iwo: fn(s.iwo) }))
}

export function toggleIn(key: 'lessons' | 'contest' | 'coderun' | 'done', id: string, on?: boolean) {
  updateIwo((s) => {
    const next = { ...s[key] }
    const want = on ?? !next[id]
    if (want) next[id] = next[id] || Date.now()
    else delete next[id]
    return { ...s, [key]: next }
  })
}
