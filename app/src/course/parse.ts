import type { ContestProblem, DiagQ, Lesson, MCQ, OralQ } from './types.ts'

export function frontMatter(src: string): { meta: Record<string, string>; body: string } {
  const text = src.replace(/\r\n/g, '\n')
  if (!text.startsWith('---\n')) return { meta: {}, body: text }
  const end = text.indexOf('\n---\n', 4)
  if (end === -1) throw new Error('Не закрыт блок front matter')
  const meta: Record<string, string> = {}
  for (const line of text.slice(4, end).split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: text.slice(end + 5) }
}

// Раскладывает текст по заголовкам «## …», не заглядывая внутрь блоков кода.
function splitSections(body: string): { head: string; sections: Record<string, string> } {
  const lines = body.split('\n')
  const sections: Record<string, string> = {}
  let cur: string | null = null
  let buf: string[] = []
  const head: string[] = []
  let fence = false
  const flush = () => {
    if (cur !== null) sections[cur] = buf.join('\n').trim()
  }
  for (const line of lines) {
    if (line.startsWith('```')) fence = !fence
    if (!fence && line.startsWith('## ') && /^## (Самопроверка|Вопросы на собеседовании|Разбор|Подсказки)\s*$/.test(line)) {
      flush()
      cur = line.slice(3).trim()
      buf = []
      continue
    }
    if (cur === null) head.push(line)
    else buf.push(line)
  }
  flush()
  return { head: head.join('\n').trim(), sections }
}

function chunks(text: string): string[] {
  const out: string[] = []
  let buf: string[] | null = null
  let fence = false
  for (const line of text.split('\n')) {
    if (line.startsWith('```')) fence = !fence
    if (!fence && line.startsWith('### ')) {
      if (buf) out.push(buf.join('\n'))
      buf = [line.slice(4)]
      continue
    }
    if (buf) buf.push(line)
  }
  if (buf) out.push(buf.join('\n'))
  return out
}

export function parseMCQ(chunk: string, where: string): MCQ {
  const lines = chunk.split('\n')
  let level: 1 | 2 | 3 = 1
  const m = lines[0].match(/^\[(\d)\]\s*/)
  if (m) {
    level = Number(m[1]) as 1 | 2 | 3
    lines[0] = lines[0].slice(m[0].length)
  }
  const q: string[] = []
  const options: string[] = []
  const explain: string[] = []
  let answer = -1
  let fence = false
  let stage: 'q' | 'o' | 'e' = 'q'
  for (const line of lines) {
    if (line.startsWith('```')) fence = !fence
    const opt = !fence && line.match(/^- \[( |x)\] (.*)$/)
    if (opt && stage !== 'e') {
      stage = 'o'
      if (opt[1] === 'x') {
        if (answer !== -1) throw new Error(`${where}: два правильных ответа в «${lines[0]}»`)
        answer = options.length
      }
      options.push(opt[2])
      continue
    }
    if (!fence && stage !== 'q' && line.startsWith('>')) {
      stage = 'e'
      explain.push(line.replace(/^> ?/, ''))
      continue
    }
    if (stage === 'q') q.push(line)
    else if (stage === 'e') explain.push(line)
    else if (line.trim()) throw new Error(`${where}: лишняя строка среди вариантов: ${line}`)
  }
  if (options.length < 2) throw new Error(`${where}: меньше двух вариантов в «${lines[0]}»`)
  if (answer === -1) throw new Error(`${where}: нет правильного ответа в «${lines[0]}»`)
  if (!explain.join('').trim()) throw new Error(`${where}: нет пояснения в «${lines[0]}»`)
  return { q: q.join('\n').trim(), options, answer, explain: explain.join('\n').trim(), level }
}

function parseOral(chunk: string): OralQ {
  const i = chunk.indexOf('\n')
  return { q: (i === -1 ? chunk : chunk.slice(0, i)).trim(), a: i === -1 ? '' : chunk.slice(i + 1).trim() }
}

export function parseLesson(src: string, file: string): Lesson {
  const { meta, body } = frontMatter(src)
  for (const k of ['id', 'module', 'title', 'minutes', 'summary']) if (!meta[k]) throw new Error(`${file}: нет поля ${k}`)
  const { head, sections } = splitSections(body)
  return {
    id: meta.id,
    module: meta.module,
    title: meta.title,
    minutes: Number(meta.minutes),
    summary: meta.summary,
    body: head,
    check: chunks(sections['Самопроверка'] ?? '').map((c) => parseMCQ(c, file)),
    oral: chunks(sections['Вопросы на собеседовании'] ?? '').map(parseOral),
    ...(meta.track ? { track: meta.track as Lesson['track'] } : {}),
  }
}

export function parseDiag(src: string, file: string): DiagQ[] {
  const { meta, body } = frontMatter(src)
  if (!meta.module) throw new Error(`${file}: нет поля module`)
  return chunks(body).map((c, i) => {
    // Метка урока в конце первой строки: «### [2] Вопрос… @lesson-id».
    const nl = c.indexOf('\n')
    const head = nl === -1 ? c : c.slice(0, nl)
    const tag = head.match(/\s@([\w-]+)\s*$/)
    const chunk = tag ? head.slice(0, tag.index) + (nl === -1 ? '' : c.slice(nl)) : c
    return { ...parseMCQ(chunk, file), id: `${meta.module}:${i}`, module: meta.module, lesson: tag?.[1] }
  })
}

export function parseContest(src: string, file: string): Omit<ContestProblem, 'solution' | 'samples' | 'testCount'> & { samples: number } {
  const { meta, body } = frontMatter(src)
  for (const k of ['id', 'title', 'difficulty', 'module']) if (!meta[k]) throw new Error(`${file}: нет поля ${k}`)
  const { head, sections } = splitSections(body)
  return {
    id: meta.id,
    title: meta.title,
    difficulty: meta.difficulty as ContestProblem['difficulty'],
    module: meta.module,
    samples: Number(meta.samples ?? 2),
    float: meta.float === 'true',
    statement: head,
    explanation: sections['Разбор'] ?? '',
    hints: (sections['Подсказки'] ?? '')
      .split('\n')
      .filter((l) => l.startsWith('- '))
      .map((l) => l.slice(2)),
  }
}
