import { writeFileSync, mkdtempSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { quiz } from '../src/data/quiz.ts'

const dir = mkdtempSync(join(tmpdir(), 'quiz-'))
let fails = 0
for (const q of quiz) {
  const f = join(dir, `${q.id}.mjs`)
  writeFileSync(f, q.code)
  const out = execFileSync('node', [f]).toString().replace(/\n$/, '')
  if (out !== q.answer) {
    fails++
    console.log(`FAIL ${q.id}\n--- got:\n${out}\n--- expected:\n${q.answer}\n`)
  }
}
console.log(`quiz: ${quiz.length}, fails: ${fails}`)
