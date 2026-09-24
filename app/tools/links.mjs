import { topics } from '../src/data/index.ts'
import { tracks } from '../src/data/tracks.ts'
import { companies } from '../src/data/companies.ts'
const urls = new Set()
const add = (u) => u && u.startsWith('http') && urls.add(u)
topics.forEach((t) => t.resources?.forEach((r) => add(r.url)))
tracks.forEach((t) => t.resources.forEach((r) => add(r.url)))
companies.forEach((c) => { c.programs.forEach((p) => add(p.url)); c.sources.forEach((s) => add(s.url)) })
console.log([...urls].join('\n'))
