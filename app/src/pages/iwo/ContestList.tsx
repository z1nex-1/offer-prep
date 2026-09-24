import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Crumbs, DiffChip, plural } from '../../components/ui'
import { contestById, contestProblems } from '../../course/content'
import { moduleById, modules } from '../../course/modules'
import { toggleIn, updateIwo, useStore } from '../../lib/store'
import ContestProblemPage from './ContestProblemPage'

const FORMATS = {
  mid: { n: 4, minutes: 180, title: 'Пробный контест', note: '4 задачи за 3 часа' },
  final: { n: 5, minutes: 300, title: 'Генеральная репетиция', note: '5 задач за 5 часов — как классический контест бэкенда' },
  short: { n: 3, minutes: 90, title: 'Короткая тренировка', note: '3 задачи за 1,5 часа' },
}

// Задачи из разных модулей и по возрастанию сложности — так устроены настоящие контесты.
function pickSet(n: number, solved: Record<string, number>): string[] {
  const pool = contestProblems.filter((p) => !solved[p.id])
  const src = pool.length >= n ? pool : contestProblems
  const want = n >= 5 ? ['easy', 'easy', 'medium', 'medium', 'hard'] : n === 4 ? ['easy', 'medium', 'medium', 'hard'] : ['easy', 'medium', 'medium']
  const out: string[] = []
  const usedModules = new Set<string>()
  for (const d of want) {
    const cand = src.filter((p) => p.difficulty === d && !out.includes(p.id))
    const fresh = cand.filter((p) => !usedModules.has(p.module))
    const list = fresh.length ? fresh : cand.length ? cand : src.filter((p) => !out.includes(p.id))
    const p = list[Math.floor(Math.random() * list.length)]
    if (!p) continue
    out.push(p.id)
    usedModules.add(p.module)
  }
  return out
}

function useNow() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function Virtual() {
  const v = useStore((s) => s.iwo.virtual)!
  const solvedAt = useStore((s) => s.iwo.contest)
  const now = useNow()
  const [cur, setCur] = useState(v.ids[0])
  const end = v.start + v.minutes * 60000
  const left = end - now
  const solved = v.ids.filter((id) => (solvedAt[id] ?? 0) >= v.start)
  const finish = () => {
    updateIwo((s) => ({ ...s, virtual: undefined, virtualHistory: [...s.virtualHistory, { at: Date.now(), solved: solved.length, total: v.ids.length, minutes: Math.round((Math.min(Date.now(), end) - v.start) / 60000) }] }))
  }
  useEffect(() => {
    if (left <= 0) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left <= 0])
  return (
    <div className="container">
      <div className="card row between" style={{ position: 'sticky', top: 64, zIndex: 5 }}>
        <div className="row">
          <b className="timer">{fmt(left)}</b>
          <div className="chips">
            {v.ids.map((id, i) => (
              <button key={id} className={cur === id ? 'chip on' : 'chip'} onClick={() => setCur(id)}>
                {String.fromCharCode(65 + i)}. {contestById[id]?.title}
                {(solvedAt[id] ?? 0) >= v.start ? ' ✓' : ''}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <span className="small">
            Решено {solved.length} из {v.ids.length}
          </span>
          <button className="btn sm bad" onClick={() => confirm('Завершить контест досрочно?') && finish()}>
            Завершить
          </button>
        </div>
      </div>
      <div className="mt">
        <ContestProblemPage key={cur} pid={cur} virtual />
      </div>
    </div>
  )
}

export default function ContestList() {
  const [sp] = useSearchParams()
  const s = useStore((x) => x)
  const v = s.iwo.virtual
  const preset = (sp.get('virtual') as keyof typeof FORMATS) || 'final'
  const [fmtKey, setFmtKey] = useState<keyof typeof FORMATS>(FORMATS[preset] ? preset : 'final')

  if (v && v.start + v.minutes * 60000 > Date.now()) return <Virtual />

  const start = () => {
    const f = FORMATS[fmtKey]
    const ids = pickSet(f.n, s.iwo.contest)
    // Решения из прошлых попыток не должны засчитываться в новой — сбрасываем отметки выбранных задач.
    ids.forEach((id) => toggleIn('contest', id, false))
    updateIwo((x) => ({ ...x, virtual: { start: Date.now(), minutes: f.minutes, ids } }))
  }

  const solvedN = contestProblems.filter((p) => s.iwo.contest[p.id]).length
  return (
    <div className="container">
      <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'Контест' }]} />
      <h1>Задачи в формате Яндекс Контеста</h1>
      <p className="lead" style={{ maxWidth: 820 }}>
        Полная программа: читаете входные данные из стандартного ввода, печатаете ответ. Проверка на скрытых тестах с вердиктами OK, WA, RE, TL — как в настоящем контесте. Решено {solvedN} из {contestProblems.length}.
      </p>

      <section className="card section" style={{ borderColor: 'var(--accent)' }}>
        <h2 style={{ marginTop: 0 }}>Пробный контест с таймером</h2>
        <p className="muted small">Случайный набор нерешённых задач из разных тем по возрастанию сложности. Подсказки, разборы и просмотр скрытых тестов отключены. Таймер не останавливается — как после кнопки «Начать» в Яндекс Контесте.</p>
        <div className="row">
          <select className="input" style={{ maxWidth: 360 }} value={fmtKey} onChange={(e) => setFmtKey(e.target.value as keyof typeof FORMATS)}>
            {Object.entries(FORMATS).map(([k, f]) => (
              <option key={k} value={k}>
                {f.title}: {f.note}
              </option>
            ))}
          </select>
          <button className="btn primary" onClick={start}>
            Начать
          </button>
        </div>
        {s.iwo.virtualHistory.length > 0 && (
          <div className="small muted mt-s">
            Прошлые попытки:{' '}
            {s.iwo.virtualHistory
              .slice(-5)
              .map((h) => `${new Date(h.at).toLocaleDateString('ru-RU')} — ${h.solved}/${h.total} за ${h.minutes} мин`)
              .join(' · ')}
          </div>
        )}
      </section>

      {modules
        .filter((m) => contestProblems.some((p) => p.module === m.id))
        .map((m) => {
          const list = contestProblems.filter((p) => p.module === m.id)
          return (
            <section key={m.id} className="section">
              <div className="section-head">
                <h2>{m.title}</h2>
                <span className="small muted">{plural(list.length, 'задача', 'задачи', 'задач')}</span>
              </div>
              <div className="card">
                {list.map((p) => (
                  <div key={p.id} className={s.iwo.contest[p.id] ? 'task done' : 'task'}>
                    <div className="task-body">
                      <Link to={`/iwo/contest/${p.id}`}>{p.title}</Link>
                    </div>
                    <DiffChip d={p.difficulty} />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      <p className="small muted">
        Ещё больше задач в этом формате — на <a href="https://coderun.yandex.ru/selections/2024-summer-backend" target="_blank" rel="noreferrer">CodeRun</a> и в <Link to="/iwo/yandex">банке задач Яндекса</Link> по темам. {moduleById.start && <Link to="/iwo/l/py-contest">Как устроен контест и как не терять баллы</Link>}
      </p>
    </div>
  )
}
