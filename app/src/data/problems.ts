import type { Problem } from '../types'
import { problemsA } from './problems-a.ts'
import { problemsB } from './problems-b.ts'

const ORDER = ['algo-arrays', 'algo-hash', 'algo-sorting', 'algo-binsearch', 'algo-prefix-window', 'algo-stack-queue', 'algo-linked-list', 'algo-recursion', 'algo-trees', 'algo-graphs', 'algo-heap', 'algo-dp']
const DIFF = { easy: 0, medium: 1, hard: 2 }

export const problems: Problem[] = [...problemsA, ...problemsB].sort(
  (a, b) => ORDER.indexOf(a.topic) - ORDER.indexOf(b.topic) || DIFF[a.difficulty] - DIFF[b.difficulty],
)
