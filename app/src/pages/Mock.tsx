import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CompanyBadge, fmtTime, Md, useCountdown } from '../components/ui'
import { questions, trackTopicIds, type QuestionRef } from '../data'
import { behavioral } from '../data/behavioral'
import { cases } from '../data/cases'
import { companies, companyById } from '../data/companies'
import { problems } from '../data/problems'
import { quiz } from '../data/quiz'
import { sqlTasks } from '../data/sql'
import { trackById, tracks } from '../data/tracks'
import { getState, rateCard, update, useStore } from '../lib/store'
import type { CaseItem, Problem, QuizItem, SqlTask, TrackId } from '../types'

type Step =
  | { kind: 'problem'; p: Problem; minutes: number }
  | { kind: 'sql'; t: SqlTask; minutes: number }
  | { kind: 'question'; q: QuestionRef; minutes: number }
  | { kind: 'quiz'; item: QuizItem; minutes: number }
  | { kind: 'case'; c: CaseItem; minutes: number }
  | { kind: 'behavioral'; idx: number; minutes: number }

interface Score {
  got: number
  max: number
  weakTopic?: string
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

function buildSteps(trackId: TrackId, stack: string | undefined, company?: string): Step[] {
  const t = trackById[trackId]
  const st = getState()
  const steps: Step[] = []
  const unsolvedFirst = <T extends { id: string }>(arr: T[], solved: Record<string, unknown>) => [...shuffle(arr.filter((x) => !solved[x.id])), ...shuffle(arr.filter((x) => solved[x.id]))]

  if (t.practice.algorithms === 'must' || t.practice.algorithms === 'should') {
    const pool = problems.filter((p) => (t.practice.algorithms === 'must' ? p.difficulty !== 'hard' : p.difficulty === 'easy'))
    // в Яндексе, Т-Банке, VK и Ozon на алгоритмической секции обычно 2–3 задачи
    const heavy = t.practice.algorithms === 'must' && ['yandex', 'tbank', 'vk', 'ozon'].includes(company ?? '')
    const byCompany = pool.filter((p) => company && p.companies?.includes(company))
    const picked = [...unsolvedFirst(byCompany, st.problems), ...unsolvedFirst(pool, st.problems)]
    const chosen = [...new Map(picked.map((p) => [p.id, p])).values()].slice(0, heavy ? 2 : 1)
    chosen.forEach((p) => steps.push({ kind: 'problem', p, minutes: heavy ? 30 : t.practice.algorithms === 'must' ? 35 : 25 }))
  }
  if (t.practice.sql === 'must' || t.practice.sql === 'should') {
    const pool = sqlTasks.filter((x) => x.difficulty !== 'hard')
    unsolvedFirst(pool, st.sql)
      .slice(0, t.practice.sql === 'must' ? 2 : 1)
      .forEach((x) => steps.push({ kind: 'sql', t: x, minutes: 12 }))
  }
  if (t.practice.jsQuiz) shuffle(quiz).slice(0, 3).forEach((item) => steps.push({ kind: 'quiz', item, minutes: 3 }))
  const ids = new Set(trackTopicIds(t, stack).filter((x) => !x.startsWith('soft-')))
  const pool = questions.filter((q) => ids.has(q.topic.id) && q.topic.level !== 'plus')
  const nonAlgo = pool.filter((q) => !q.topic.id.startsWith('algo-'))
  const shuffled = shuffle(nonAlgo.length >= 6 ? nonAlgo : pool)
  const picked = company ? [...shuffled.filter((q) => q.companies?.includes(company)), ...shuffled.filter((q) => !q.companies?.includes(company))] : shuffled
  const byTopic = new Set<string>()
  const theory: QuestionRef[] = []
  for (const q of picked) {
    if (theory.length >= 7) break
    if (byTopic.has(q.topic.id)) continue
    byTopic.add(q.topic.id)
    theory.push(q)
  }
  theory.forEach((q) => steps.push({ kind: 'question', q, minutes: 3 }))
  const caseTypes = t.practice.caseTypes ?? []
  const cpool = cases.filter((c) => caseTypes.includes(c.type) && c.tracks.includes(trackId))
  const nCases = t.practice.algorithms === 'none' ? 2 : 1
  shuffle(cpool)
    .slice(0, nCases)
    .forEach((c) => steps.push({ kind: 'case', c, minutes: Math.min(c.minutes, 25) }))
  if (behavioral.length) shuffle(behavioral.map((_, i) => i)).slice(0, 2).forEach((idx) => steps.push({ kind: 'behavioral', idx, minutes: 3 }))
  return steps
}

const STEP_NAME: Record<Step['kind'], string> = {
  problem: 'Алгоритмическая задача',
  sql: 'SQL',
  question: 'Теория',
  quiz: 'Что выведет JS',
  case: 'Кейс',
  behavioral: 'Поведенческий вопрос',
}

export default function Mock() {
  const [sp] = useSearchParams()
  const profile = useStore((s) => s.profile)
  const history = useStore((s) => s.mocks)
  const [track, setTrack] = useState<TrackId>((sp.get('track') as TrackId) || profile.track || 'backend')
  const [company, setCompany] = useState(sp.get('company') ?? profile.company ?? '')
  const [stack, setStack] = useState(profile.stack ?? trackById[track]?.stacks?.[0]?.id)
  const [steps, setSteps] = useState<Step[] | null>(null)
  const [started, setStarted] = useState(0)

  const t = trackById[track]
  const c = company ? companyById[company] : undefined
  const ct = c?.tracks.find((x) => x.track === track)

  if (steps) return <Session steps={steps} started={started} track={track} company={company || undefined} onExit={() => setSteps(null)} />

  const total = t ? buildPreview(t.id) : 0

  return (
    <div className="container">
      <h1>Пробное интервью</h1>
      <p className="lead muted" style={{ maxWidth: 780 }}>
        Сессия в формате реального отбора: задача на код с таймером, теоретические вопросы, кейс и поведенческая часть. Отвечайте вслух, как будто перед вами интервьюер, — потом честно оцените себя. В конце получите разбор и список тем, которые стоит подтянуть.
      </p>
      <div className="grid grid-3">
        <div className="card stack" style={{ gridColumn: 'span 2' }}>
          <div className="grid grid-2">
            <div className="field">
              <label>Направление</label>
              <select className="input" value={track} onChange={(e) => (setTrack(e.target.value as TrackId), setStack(trackById[e.target.value]?.stacks?.[0]?.id))}>
                {tracks.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Компания</label>
              <select className="input" value={company} onChange={(e) => setCompany(e.target.value)}>
                <option value="">Без привязки</option>
                {companies
                  .filter((x) => x.tracks.some((y) => y.track === track))
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
              </select>
            </div>
            {t?.stacks && (
              <div className="field">
                <label>Язык</label>
                <select className="input" value={stack} onChange={(e) => setStack(e.target.value)}>
                  {t.stacks.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="notice small">
            Длительность ≈ {total} минут. Задачи на код и SQL открываются в соседней вкладке — решите их там, решение засчитается автоматически. Лучше проходить с камерой и вслух: запишите себя на видео и пересмотрите.
          </div>
          <button
            className="btn primary"
            style={{ justifySelf: 'start' }}
            onClick={() => {
              setStarted(Date.now())
              setSteps(buildSteps(track, stack, company || undefined))
            }}
          >
            Начать интервью
          </button>
        </div>
        <div className="card">
          {c && ct ? (
            <>
              <div className="row">
                <CompanyBadge c={c} />
                <b>Как это устроено в {c.name}</b>
              </div>
              <div className="list mt-s small">
                {ct.stages.map((s) => (
                  <div key={s.name}>
                    <b>{s.name}</b> {s.duration && <span className="faint">· {s.duration}</span>}
                    <div className="muted">{s.details}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <b>Типичные секции</b>
              <div className="list mt-s small">
                {t?.sections.map((s) => (
                  <div key={s.name}>
                    <b>{s.name}</b> {s.duration && <span className="faint">· {s.duration}</span>}
                    <div className="muted">{s.what.join(', ')}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {history.length > 0 && (
        <section className="section">
          <h2>История</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Направление</th>
                  <th>Результат</th>
                  <th className="hide-mobile">Подтянуть</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((m) => (
                  <tr key={m.at}>
                    <td>{new Date(m.at).toLocaleDateString('ru-RU')}</td>
                    <td>
                      {trackById[m.track]?.short}
                      {m.company ? ` · ${companyById[m.company]?.name}` : ''}
                    </td>
                    <td>
                      <b>{Math.round((m.score / Math.max(1, m.total)) * 100)}%</b>
                    </td>
                    <td className="hide-mobile small muted">{m.weak.slice(0, 4).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function buildPreview(trackId: TrackId) {
  const t = trackById[trackId]
  let m = 0
  if (t.practice.algorithms === 'must') m += 35
  else if (t.practice.algorithms === 'should') m += 25
  if (t.practice.sql === 'must') m += 24
  else if (t.practice.sql === 'should') m += 12
  if (t.practice.jsQuiz) m += 9
  m += 21
  m += (t.practice.algorithms === 'none' ? 2 : 1) * 22
  m += 6
  return m
}

function Session({ steps, started, track, company, onExit }: { steps: Step[]; started: number; track: TrackId; company?: string; onExit: () => void }) {
  const [i, setI] = useState(0)
  const [scores, setScores] = useState<Record<number, Score>>({})
  const [finished, setFinished] = useState(false)
  const step = steps[i]

  const record = (s: Score) => {
    setScores((x) => ({ ...x, [i]: s }))
    if (i + 1 < steps.length) setI(i + 1)
    else finish({ ...scores, [i]: s })
  }

  const finish = (all: Record<number, Score>) => {
    const vals = Object.values(all)
    const got = vals.reduce((m, v) => m + v.got, 0)
    const max = vals.reduce((m, v) => m + v.max, 0)
    const weak = [...new Set(vals.filter((v) => v.weakTopic && v.got < v.max).map((v) => v.weakTopic!))]
    update((s) => ({ ...s, mocks: [...s.mocks, { at: Date.now(), track, company, score: got, total: max, weak }] }))
    setFinished(true)
  }

  if (finished) return <Report steps={steps} scores={scores} onExit={onExit} />

  return (
    <div className="container narrow">
      <div className="row between mb">
        <div className="small muted">
          Шаг {i + 1} из {steps.length} · {STEP_NAME[step.kind]}
        </div>
        <button className="btn sm ghost" onClick={() => finish(scores)}>
          Завершить досрочно
        </button>
      </div>
      <div className="progress mb">
        <div style={{ width: `${(i / steps.length) * 100}%` }} />
      </div>
      <StepView key={i} step={step} started={started} onDone={record} />
    </div>
  )
}

function StepTimer({ minutes }: { minutes: number }) {
  const t = useCountdown(minutes * 60)
  const { start } = t
  useEffect(() => {
    start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <span className={t.left < 30 ? 'timer low' : 'timer'}>{fmtTime(t.left)}</span>
}

function Rate({ onRate, labels = ['Не ответил', 'Частично', 'Уверенно'] }: { onRate: (n: 0 | 1 | 2) => void; labels?: string[] }) {
  return (
    <div className="row">
      <button className="btn bad" onClick={() => onRate(0)}>
        {labels[0]}
      </button>
      <button className="btn warm" onClick={() => onRate(1)}>
        {labels[1]}
      </button>
      <button className="btn ok" onClick={() => onRate(2)}>
        {labels[2]}
      </button>
    </div>
  )
}

function StepView({ step, started, onDone }: { step: Step; started: number; onDone: (s: Score) => void }) {
  const [shown, setShown] = useState(false)
  const [notes, setNotes] = useState('')
  const [checks, setChecks] = useState<Record<number, boolean>>({})
  const state = useStore((s) => s)

  if (step.kind === 'problem') {
    const solved = (state.problems[step.p.id]?.at ?? 0) > started
    return (
      <div className="card stack">
        <div className="row between">
          <h2 style={{ margin: 0 }}>{step.p.title}</h2>
          <StepTimer minutes={step.minutes} />
        </div>
        <Md text={step.p.statement} />
        <div className="notice small">Проговорите идею и сложность вслух, затем решите задачу в редакторе. Не открывайте подсказки — на интервью их не будет.</div>
        <div className="row">
          <a className="btn primary" href={`#/problems/${step.p.id}`} target="_blank" rel="noreferrer">
            Открыть редактор
          </a>
          {solved && <span className="chip easy">✓ Все тесты пройдены</span>}
        </div>
        <div className="row">
          <button className="btn ok" disabled={!solved} onClick={() => onDone({ got: 3, max: 3, weakTopic: step.p.pattern })}>
            Решено
          </button>
          <button className="btn warm" onClick={() => onDone({ got: 1, max: 3, weakTopic: step.p.pattern })}>
            Придумал идею, не дописал
          </button>
          <button className="btn bad" onClick={() => onDone({ got: 0, max: 3, weakTopic: step.p.pattern })}>
            Не решил
          </button>
        </div>
      </div>
    )
  }
  if (step.kind === 'sql') {
    const solved = (state.sql[step.t.id] ?? 0) > started
    return (
      <div className="card stack">
        <div className="row between">
          <h2 style={{ margin: 0 }}>SQL: {step.t.title}</h2>
          <StepTimer minutes={step.minutes} />
        </div>
        <Md text={step.t.statement} />
        <div className="row">
          <a className="btn primary" href={`#/sql/${step.t.id}`} target="_blank" rel="noreferrer">
            Открыть SQL-редактор
          </a>
          {solved && <span className="chip easy">✓ Совпало с эталоном</span>}
        </div>
        <div className="row">
          <button className="btn ok" disabled={!solved} onClick={() => onDone({ got: 2, max: 2, weakTopic: 'SQL' })}>
            Решено
          </button>
          <button className="btn bad" onClick={() => onDone({ got: 0, max: 2, weakTopic: 'SQL' })}>
            Не справился
          </button>
        </div>
      </div>
    )
  }
  if (step.kind === 'question' || step.kind === 'behavioral') {
    const q = step.kind === 'question' ? step.q : null
    const b = step.kind === 'behavioral' ? behavioral[step.idx] : null
    return (
      <div className="card flash">
        <div className="row between">
          <span className="small muted">{q ? `${q.topic.area} · ${q.topic.title}` : 'Поведенческое интервью'}</span>
          <StepTimer minutes={step.minutes} />
        </div>
        <div className="flash-q">{q ? q.q : b!.q}</div>
        {!shown ? (
          <button className="btn primary" style={{ justifySelf: 'start' }} onClick={() => setShown(true)}>
            Ответил вслух — показать эталон
          </button>
        ) : (
          <div className="stack">
            <div className="card flat" style={{ background: 'var(--surface-2)', border: 0 }}>
              {q ? (
                <Md text={q.a} compact />
              ) : (
                <>
                  <p className="small">
                    <b>Что проверяют:</b> {b!.why}
                  </p>
                  <Md text={b!.how} compact />
                </>
              )}
            </div>
            <Rate
              onRate={(n) => {
                if (q) rateCard(q.id, n === 2 ? 'know' : n === 1 ? 'unsure' : 'dont')
                onDone({ got: n, max: 2, weakTopic: q ? q.topic.title : 'Поведенческое интервью' })
              }}
            />
          </div>
        )}
      </div>
    )
  }
  if (step.kind === 'quiz') {
    return (
      <div className="card stack">
        <div className="row between">
          <span className="small muted">Что выведет код?</span>
          <StepTimer minutes={step.minutes} />
        </div>
        <Md text={'```js\n' + step.item.code + '\n```'} />
        {!shown ? (
          <button className="btn primary" style={{ justifySelf: 'start' }} onClick={() => setShown(true)}>
            Показать вывод
          </button>
        ) : (
          <>
            <pre className="result pass">{step.item.answer}</pre>
            <Md text={step.item.explanation} compact />
            <Rate labels={['Ошибся', 'Почти', 'Верно']} onRate={(n) => onDone({ got: n, max: 2, weakTopic: `JS: ${step.item.topic}` })} />
          </>
        )}
      </div>
    )
  }
  const c = step.c
  return (
    <div className="card stack">
      <div className="row between">
        <h2 style={{ margin: 0 }}>{c.title}</h2>
        <StepTimer minutes={step.minutes} />
      </div>
      <Md text={c.prompt} />
      <textarea className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Тезисы ответа: уточнения, структура, решение, метрики, риски" style={{ minHeight: 160 }} />
      {!shown ? (
        <button className="btn primary" style={{ justifySelf: 'start' }} onClick={() => setShown(true)}>
          Сравнить с эталоном
        </button>
      ) : (
        <>
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Эталонный разбор</summary>
            <Md text={c.answer} compact />
          </details>
          <b>Что было в вашем ответе:</b>
          <div className="list">
            {c.rubric.map((r, k) => (
              <label key={k} className="row" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={!!checks[k]} onChange={(e) => setChecks((s) => ({ ...s, [k]: e.target.checked }))} />
                <span className="small">{r}</span>
              </label>
            ))}
          </div>
          <button className="btn primary" style={{ justifySelf: 'start' }} onClick={() => onDone({ got: Object.values(checks).filter(Boolean).length, max: c.rubric.length, weakTopic: `Кейс: ${c.title}` })}>
            Дальше
          </button>
        </>
      )}
    </div>
  )
}

function Report({ steps, scores, onExit }: { steps: Step[]; scores: Record<number, Score>; onExit: () => void }) {
  const rows = useMemo(() => steps.map((s, i) => ({ s, sc: scores[i] })), [steps, scores])
  const got = rows.reduce((m, r) => m + (r.sc?.got ?? 0), 0)
  const max = rows.reduce((m, r) => m + (r.sc?.max ?? 0), 0)
  const pct = max ? Math.round((got / max) * 100) : 0
  const verdict = pct >= 80 ? 'Уровень, с которым проходят отбор. Держите форму и тренируйтесь на задачах компании.' : pct >= 55 ? 'Близко к проходному. Закройте слабые темы из списка ниже и повторите интервью через неделю.' : 'Пока рано подаваться: база ещё проседает. Вернитесь к плану и темам ниже.'
  const weak = rows.filter((r) => r.sc && r.sc.got < r.sc.max)
  return (
    <div className="container narrow">
      <h1>Итоги интервью</h1>
      <div className="card row" style={{ gap: 20 }}>
        <div className="ring" style={{ ['--p' as string]: pct, width: 90, height: 90 }}>
          <span style={{ width: 72, height: 72, fontSize: 20 }}>{pct}%</span>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <b style={{ fontSize: 18 }}>{verdict}</b>
          <div className="small muted">
            Набрано {got} из {max} баллов
          </div>
        </div>
      </div>
      <div className="card mt">
        <h3>По шагам</h3>
        <div className="list">
          {rows.map((r, i) => (
            <div key={i} className="row between">
              <span>
                <span className="chip">{STEP_NAME[r.s.kind]}</span>{' '}
                {r.s.kind === 'question' ? r.s.q.q : r.s.kind === 'problem' ? r.s.p.title : r.s.kind === 'sql' ? r.s.t.title : r.s.kind === 'case' ? r.s.c.title : r.s.kind === 'quiz' ? r.s.item.topic : behavioral[r.s.idx]?.q}
              </span>
              <b className={r.sc && r.sc.got === r.sc.max ? '' : 'muted'}>{r.sc ? `${r.sc.got}/${r.sc.max}` : '—'}</b>
            </div>
          ))}
        </div>
      </div>
      {weak.length > 0 && (
        <div className="card mt">
          <h3>Что подтянуть</h3>
          <div className="list">
            {weak.map((r, i) => (
              <div key={i}>
                {r.s.kind === 'question' ? (
                  <Link to={`/topics/${r.s.q.topic.id}`}>{r.s.q.topic.title}</Link>
                ) : r.s.kind === 'problem' ? (
                  <Link to={`/problems/${r.s.p.id}`}>Разбор задачи «{r.s.p.title}» и приём «{r.s.p.pattern}»</Link>
                ) : r.s.kind === 'sql' ? (
                  <Link to={`/sql/${r.s.t.id}`}>SQL: {r.s.t.title}</Link>
                ) : r.s.kind === 'case' ? (
                  <Link to={`/cases/${r.s.c.id}`}>Кейс «{r.s.c.title}» — эталон и критерии</Link>
                ) : r.s.kind === 'quiz' ? (
                  <Link to="/quiz">Что выведет JS: {r.s.item.topic}</Link>
                ) : (
                  <Link to="/behavioral">Поведенческие вопросы</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="row mt">
        <button className="btn primary" onClick={onExit}>
          Новое интервью
        </button>
        <Link className="btn" to="/plan">
          К плану
        </Link>
      </div>
    </div>
  )
}
