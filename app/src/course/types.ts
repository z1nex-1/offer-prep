export interface MCQ {
  q: string
  options: string[]
  answer: number
  explain: string
  level: 1 | 2 | 3
}

export interface OralQ {
  q: string
  a: string
}

export interface Lesson {
  id: string
  module: string
  title: string
  minutes: number
  summary: string
  body: string
  check: MCQ[]
  oral: OralQ[]
  track?: Track
}

export type Part = 'start' | 'python' | 'algo' | 'ml' | 'interview' | 'theory'

export type Track = 'backend' | 'ml'

export interface CourseModule {
  id: string
  title: string
  part: Part
  goal: string
  stage: 'contest' | 'interview' | 'both'
  weight: 1 | 2 | 3
  problems: string[]
  coderunTags: string[]
  handbook?: { title: string; url: string }[]
  // Направления Intern week offer, в план которых входит модуль; без поля — во все.
  tracks?: Track[]
}

export interface DiagQ extends MCQ {
  id: string
  module: string
  lesson?: string
}

export interface YandexPick {
  slug: string
  note?: string
}

export interface ContestTest {
  in: string
  out: string
}

export interface ContestProblem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  module: string
  statement: string
  explanation: string
  hints: string[]
  solution: string
  samples: ContestTest[]
  testCount: number
  float?: boolean
}

export interface CodeRunProblem {
  slug: string
  title: string
  d: 'E' | 'M' | 'H' | 'U'
  tags: string[]
  sel: string[]
  rate: number
}
