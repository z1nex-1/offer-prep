import { topics } from '../src/data/index.ts'
import { tracks } from '../src/data/tracks.ts'
import { companies } from '../src/data/companies.ts'
import { cases } from '../src/data/cases.ts'
import { problems } from '../src/data/problems.ts'

const ids = new Set(topics.map((t) => t.id))
const dup = topics.map((t) => t.id).filter((id, i, a) => a.indexOf(id) !== i)
if (dup.length) console.log('DUP topics', dup)
let missing = 0
for (const t of tracks) {
  for (const id of [...t.topics, ...(t.stacks?.flatMap((s) => s.topics) ?? [])]) {
    if (!ids.has(id)) { console.log('MISSING topic', id, 'in', t.id); missing++ }
  }
}
const trackIds = new Set(tracks.map((t) => t.id))
for (const c of companies) for (const ct of c.tracks) if (!trackIds.has(ct.track)) console.log('BAD track', c.id, ct.track)
for (const c of cases) for (const t of c.tracks) if (!trackIds.has(t)) console.log('BAD case track', c.id, t)
for (const p of problems) if (!ids.has(p.topic)) console.log('BAD problem topic', p.id)
const unused = topics.filter((t) => !tracks.some((tr) => tr.topics.includes(t.id) || tr.stacks?.some((s) => s.topics.includes(t.id))))
console.log('unused topics', unused.map((t) => t.id))
console.log(`topics ${topics.length}, questions ${topics.reduce((m, t) => m + t.questions.length, 0)}, missing ${missing}`)
for (const t of tracks) {
  const n = t.topics.length
  const caseN = cases.filter((c) => c.tracks.includes(t.id) && (t.practice.caseTypes ?? []).includes(c.type)).length
  console.log(`  ${t.id}: ${n} topics, cases ${caseN}, companies ${companies.filter((c) => c.tracks.some((x) => x.track === t.id)).length}`)
}
