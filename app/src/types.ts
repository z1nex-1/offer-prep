export type TrackId =
  | 'backend'
  | 'frontend'
  | 'ios'
  | 'android'
  | 'ml'
  | 'data-analyst'
  | 'data-engineer'
  | 'system-analyst'
  | 'qa'
  | 'devops'
  | 'security'
  | 'product'
  | 'project'
  | 'design'

export type CompanyId = string

export interface Link {
  title: string
  url: string
  kind?: 'book' | 'course' | 'article' | 'video' | 'practice' | 'official' | 'docs'
}

export interface Question {
  q: string
  a: string
  level?: 1 | 2 | 3
  companies?: CompanyId[]
}

export interface Topic {
  id: string
  title: string
  area: string
  level: 'base' | 'core' | 'plus'
  minutes: number
  summary: string
  body: string
  questions: Question[]
  resources?: Link[]
}

export interface InterviewSection {
  name: string
  duration?: string
  what: string[]
}

export interface Track {
  id: TrackId
  name: string
  short: string
  category: 'Разработка' | 'Данные и ML' | 'Качество и инфраструктура' | 'Менеджмент и дизайн'
  glyph: string
  about: string
  daily: string[]
  checks: string[]
  sections: InterviewSection[]
  topics: string[]
  stacks?: { id: string; name: string; topics: string[] }[]
  practice: {
    algorithms: 'must' | 'should' | 'light' | 'none'
    sql: 'must' | 'should' | 'light' | 'none'
    jsQuiz?: boolean
    caseTypes?: CaseType[]
  }
  portfolio: string[]
  mistakes: string[]
  resources: Link[]
}

export interface CompanyTrack {
  track: TrackId
  title?: string
  stages: { name: string; duration?: string; details: string }[]
  focus: string[]
  note?: string
}

export interface Company {
  id: CompanyId
  name: string
  short: string
  color: string
  kind: string
  about: string
  programs: { name: string; url: string; note: string }[]
  months: number[]
  hiring: string
  conditions: { label: string; value: string }[]
  flow: string[]
  tracks: CompanyTrack[]
  values: string[]
  tips: string[]
  sources: Link[]
  confidence: 'official' | 'mixed'
}

export interface TestCase {
  args: unknown[]
  expected: unknown
}

export interface Problem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  pattern: string
  topic: string
  statement: string
  fn: string
  params: string[]
  tests: TestCase[]
  compare?: 'exact' | 'unordered' | 'unordered-nested' | 'float'
  starter?: { js?: string; py?: string }
  solution: { js: string; py: string }
  explanation: string
  hints: string[]
  companies?: CompanyId[]
}

export interface SqlDataset {
  id: string
  title: string
  description: string
  sql: string
}

export interface SqlTask {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  dataset: string
  statement: string
  solution: string
  ordered?: boolean
  hint?: string
  skills: string[]
}

export interface QuizItem {
  id: string
  topic: string
  code: string
  answer: string
  explanation: string
  level: 1 | 2 | 3
}

export type CaseType =
  | 'product'
  | 'analytics'
  | 'system-design'
  | 'ml-design'
  | 'testing'
  | 'project'
  | 'design'
  | 'security'
  | 'incident'
  | 'estimation'
  | 'requirements'

export interface CaseItem {
  id: string
  type: CaseType
  tracks: TrackId[]
  title: string
  prompt: string
  clarify: string[]
  plan: string[]
  answer: string
  rubric: string[]
  companies?: CompanyId[]
  minutes: number
}

export interface BehavioralQ {
  q: string
  why: string
  how: string
  example?: string
}
