import { useMemo, useState } from 'react'
import { Crumbs, Check, plural } from '../../components/ui'
import { SELECTIONS, coderun, coderunLevel, coderunUrl } from '../../course/content'
import { modules } from '../../course/modules'
import { trackOf } from '../../course/tracks'
import { toggleIn, useStore } from '../../lib/store'

const LEVEL = { 1: 'Разминка', 2: 'Уровень контеста', 3: 'Сложные' }

export default function YandexBank() {
  const done = useStore((s) => s.iwo.coderun)
  const track = useStore((s) => trackOf(s.iwo))
  const [mod, setMod] = useState('')
  const [sel, setSel] = useState('')
  const [lvl, setLvl] = useState(0)
  const [status, setStatus] = useState<'all' | 'todo' | 'done'>('all')
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(60)

  const list = useMemo(() => {
    const tags = mod ? modules.find((m) => m.id === mod)?.coderunTags ?? [] : []
    return coderun.filter(
      (p) =>
        (!mod || p.tags.some((t) => tags.includes(t))) &&
        (!sel || p.sel.includes(sel)) &&
        (!lvl || coderunLevel(p) === lvl) &&
        (status === 'all' || (status === 'done') === !!done[p.slug]) &&
        (!q || p.title.toLowerCase().includes(q.toLowerCase())),
    )
  }, [mod, sel, lvl, status, q, done])

  const selCounts = Object.keys(SELECTIONS).map((k) => ({ k, n: coderun.filter((p) => p.sel.includes(k)).length })).filter((x) => x.n)
  const doneN = coderun.filter((p) => done[p.slug]).length

  return (
    <div className="container">
      <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'Задачи Яндекса' }]} />
      <h1>Задачи Яндекса по темам курса</h1>
      <p className="lead" style={{ maxWidth: 860 }}>
        {plural(coderun.length, 'задача', 'задачи', 'задач')} с CodeRun — тренажёра Яндекса, где собраны задачи прошлых отборов, тренировок по алгоритмам и собеседований. Все решаются на Python. Отмечено решённых: {doneN}.
      </p>
      <div className="notice mb">
        Как пользоваться: решайте задачу на CodeRun до вердикта OK, затем ставьте галочку здесь — прогресс попадёт в план.{' '}
        {track === 'ml'
          ? 'Здесь алгоритмические задачи — вторая половина контеста ML и алгоритмическое интервью. Для ML-половины решайте задачи тренажёра из модулей «Метрики и валидация», «Классические модели», «ML в коде» и «Нейросети» и тренировочный контест, который советует Яндекс.'
          : 'Для репетиции контеста лучше всего подходят подборка «Бэкенд, сезон CodeRun» (задачи трека бэкенда) и «Стажировка // Бэкенд» от интервьюеров Яндекса.'}
      </div>

      <div className="grid grid-3 mb">
        {selCounts.slice(0, 6).map(({ k, n }) => (
          <button key={k} className={sel === k ? 'card card-link on' : 'card card-link'} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }} onClick={() => setSel(sel === k ? '' : k)}>
            <b>{SELECTIONS[k].title}</b>
            <div className="small muted">
              {SELECTIONS[k].note} · {n} задач · <a href={`https://coderun.yandex.ru/selections/${k}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>на CodeRun ↗</a>
            </div>
          </button>
        ))}
      </div>

      <div className="row mb" style={{ flexWrap: 'wrap' }}>
        <select className="input" style={{ maxWidth: 260 }} value={mod} onChange={(e) => setMod(e.target.value)}>
          <option value="">Все темы</option>
          {modules
            .filter((m) => m.coderunTags.length)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
        </select>
        <select className="input" style={{ maxWidth: 260 }} value={sel} onChange={(e) => setSel(e.target.value)}>
          <option value="">Все подборки</option>
          {selCounts.map(({ k, n }) => (
            <option key={k} value={k}>
              {SELECTIONS[k].title} ({n})
            </option>
          ))}
        </select>
        <select className="input" style={{ maxWidth: 200 }} value={lvl} onChange={(e) => setLvl(Number(e.target.value))}>
          <option value={0}>Любая сложность</option>
          <option value={1}>Разминка</option>
          <option value={2}>Уровень контеста</option>
          <option value={3}>Сложные</option>
        </select>
        <select className="input" style={{ maxWidth: 170 }} value={status} onChange={(e) => setStatus(e.target.value as 'all' | 'todo' | 'done')}>
          <option value="all">Все</option>
          <option value="todo">Не решённые</option>
          <option value="done">Решённые</option>
        </select>
        <input className="input" style={{ maxWidth: 220 }} placeholder="Поиск по названию" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="small muted mb">Найдено: {list.length}</div>
      <div className="card">
        {list.slice(0, limit).map((p) => (
          <div key={p.slug} className={done[p.slug] ? 'task done' : 'task'}>
            <Check on={!!done[p.slug]} onClick={() => toggleIn('coderun', p.slug)} title="Решена на CodeRun" />
            <div className="task-body">
              <div className="row" style={{ gap: 8 }}>
                <a href={coderunUrl(p.slug)} target="_blank" rel="noreferrer">
                  {p.title} ↗
                </a>
                <span className={`chip ${['', 'easy', 'medium', 'hard'][coderunLevel(p)]}`}>{LEVEL[coderunLevel(p)]}</span>
                {p.sel
                  .filter((x) => SELECTIONS[x])
                  .slice(0, 2)
                  .map((x) => (
                    <span key={x} className="chip official">
                      {SELECTIONS[x].title}
                    </span>
                  ))}
              </div>
              <div className="tiny faint">{p.tags.join(' · ') || 'без тегов'}</div>
            </div>
          </div>
        ))}
        {list.length > limit && (
          <button className="btn sm mt-s" onClick={() => setLimit((n) => n + 100)}>
            Показать ещё
          </button>
        )}
        {!list.length && <p className="muted">Ничего не нашлось — ослабьте фильтры.</p>}
      </div>
    </div>
  )
}
