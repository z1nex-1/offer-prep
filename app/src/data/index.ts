import type { Question, Topic, Track } from '../types'
import { algorithms } from './topics/algorithms.ts'
import { cs } from './topics/cs.ts'
import { python } from './topics/python.ts'
import { golang } from './topics/go.ts'
import { java } from './topics/java.ts'
import { cpp } from './topics/cpp.ts'
import { frontend } from './topics/frontend.ts'
import { mobile } from './topics/mobile.ts'
import { ml } from './topics/ml.ts'
import { analytics } from './topics/analytics.ts'
import { sa } from './topics/sa.ts'
import { qa } from './topics/qa.ts'
import { devops } from './topics/devops.ts'
import { security } from './topics/security.ts'
import { management } from './topics/management.ts'
import { design } from './topics/design.ts'
import { dataeng } from './topics/dataeng.ts'
import { soft } from './topics/soft.ts'

export const topics: Topic[] = [...algorithms, ...cs, ...python, ...golang, ...java, ...cpp, ...frontend, ...mobile, ...ml, ...analytics, ...sa, ...qa, ...devops, ...security, ...management, ...design, ...dataeng, ...soft]

export const topicById: Record<string, Topic> = Object.fromEntries(topics.map((t) => [t.id, t]))

export interface QuestionRef extends Question {
  id: string
  topic: Topic
}

export const questions: QuestionRef[] = topics.flatMap((t) =>
  t.questions.map((q, i) => ({ ...q, id: `${t.id}#${i}`, topic: t })),
)

export const questionById: Record<string, QuestionRef> = Object.fromEntries(questions.map((q) => [q.id, q]))

export function trackTopicIds(track: Track, stack?: string): string[] {
  const extra = track.stacks?.find((s) => s.id === stack)?.topics ?? []
  const ids = [...track.topics]
  const insertAt = ids.findIndex((id) => id.startsWith('soft-'))
  if (insertAt === -1) ids.push(...extra)
  else ids.splice(insertAt, 0, ...extra)
  return [...new Set(ids)]
}

export function trackTopics(track: Track, stack?: string): Topic[] {
  return trackTopicIds(track, stack)
    .map((id) => topicById[id])
    .filter(Boolean)
}

export const areas = [...new Set(topics.map((t) => t.area))]
