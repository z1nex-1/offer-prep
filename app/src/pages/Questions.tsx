import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Md, plural } from '../components/ui'
import { areas, questions, topicById, trackTopicIds, type QuestionRef } from '../data'
import { companies } from '../data/companies'
import { trackById, tracks } from '../data/tracks'
import { rateCard, useStore, type CardState } from '../lib/store'
import { QA } from './Topic'

function pickDeck(list: QuestionRef[], cards: Record<string, CardState>) {
  const now = Date.now()
  const due = list.filter((q) => cards[q.id] && cards[q.id].due <= now).sort((a, b) => cards[a.id].due - cards[b.id].due)
  const fresh = list.filter((q) => !cards[q.id])
  return [...due, ...fresh]
}

export default function Questions() {
  const [sp, setSp] = useSearchParams()
  const cards = useStore((s) => s.cards)
  const track = sp.get('track') ?? ''
  const area = sp.get('area') ?? ''
  const topic = sp.get('topic') ?? ''
  const company = sp.get('company') ?? ''
  const mode = sp.get('mode') ?? 'cards'
  const [query, setQuery] = useState('')

  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp)
    if (v) n.set(k, v)
    else n.delete(k)
    if (k !== 'mode') n.delete('topic')
    setSp(n, { replace: true })
  }

  const list = useMemo(() => {
    let l = questions
    if (topic) l = l.filter((q) => q.topic.id === topic)
    if (track) {
      const t = trackById[track]
      const ids = new Set([...trackTopicIds(t), ...(t.stacks?.flatMap((s) => s.topics) ?? [])])
      l = l.filter((q) => ids.has(q.topic.id))
    }
    if (area) l = l.filter((q) => q.topic.area === area)
    if (company) l = l.filter((q) => q.companies?.includes(company))
    if (query.trim()) {
      const s = query.trim().toLowerCase()
      l = l.filter((q) => q.q.toLowerCase().includes(s) || q.a.toLowerCase().includes(s))
    }
    return l
  }, [topic, track, area, company, query])

  const known = list.filter((q) => cards[q.id]?.last === 'know').length
  const due = list.filter((q) => cards[q.id] && cards[q.id].due <= Date.now()).length
  const areaOptions = track ? [...new Set(list.map((q) => q.topic.area))] : areas

  return (
    <div className="container">
      <h1>Вопросы с собеседований</h1>
      <p className="lead muted" style={{ maxWidth: 780 }}>
        {plural(questions.length, 'вопрос', 'вопроса', 'вопросов')} с разобранными ответами. Режим карточек работает по интервальному повторению: то, что вы не знаете, вернётся через 10 минут, выученное — через 1, 3, 7, 16 и 35 дней.
      </p>

      <div className="card flat mb">
        <div className="grid grid-4">
          <div className="field">
            <label>Направление</label>
            <select className="input" value={track} onChange={(e) => set('track', e.target.value)}>
              <option value="">Все</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Раздел</label>
            <select className="input" value={area} onChange={(e) => set('area', e.target.value)}>
              <option value="">Все</option>
              {areaOptions.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Встречалось в компании</label>
            <select className="input" value={company} onChange={(e) => set('company', e.target.value)}>
              <option value="">Любая</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Поиск</label>
            <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Например, индекс" />
          </div>
        </div>
        {topic && topicById[topic] && (
          <div className="row mt-s small">
            Тема: <b>{topicById[topic].title}</b>
            <button className="btn sm ghost" onClick={() => set('topic', '')}>
              Сбросить
            </button>
          </div>
        )}
      </div>

      <div className="row between mb">
        <div className="tabs" style={{ margin: 0, border: 0 }}>
          <button className={mode === 'cards' ? 'on' : ''} onClick={() => set('mode', 'cards')}>
            Карточки
          </button>
          <button className={mode === 'list' ? 'on' : ''} onClick={() => set('mode', 'list')}>
            Список
          </button>
        </div>
        <div className="small muted">
          Отобрано {list.length} · знаю {known} · к повторению {due}
        </div>
      </div>

      {mode === 'cards' ? <Deck list={list} /> : <ListView list={list} />}
    </div>
  )
}

function ListView({ list }: { list: QuestionRef[] }) {
  const [limit, setLimit] = useState(60)
  if (!list.length) return <div className="empty">По этим фильтрам вопросов нет.</div>
  let lastTopic = ''
  return (
    <div>
      {list.slice(0, limit).map((q) => {
        const header = q.topic.id !== lastTopic
        lastTopic = q.topic.id
        return (
          <div key={q.id}>
            {header && (
              <h3 className="mt">
                <Link to={`/topics/${q.topic.id}`} style={{ color: 'var(--text)' }}>
                  {q.topic.title}
                </Link>
              </h3>
            )}
            <QA id={q.id} n={Number(q.id.split('#')[1]) + 1} q={q} />
          </div>
        )
      })}
      {limit < list.length && (
        <div className="row mt" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={() => setLimit((l) => l + 60)}>
            Показать ещё
          </button>
        </div>
      )}
    </div>
  )
}

function Deck({ list }: { list: QuestionRef[] }) {
  const cards = useStore((s) => s.cards)
  const [shown, setShown] = useState(false)
  const [session, setSession] = useState(0)
  const deck = useMemo(() => pickDeck(list, cards), [list, cards])
  const q = deck[0]
  if (!list.length) return <div className="empty">По этим фильтрам вопросов нет.</div>
  if (!q)
    return (
      <div className="card empty">
        <h3>На сегодня всё повторено</h3>
        <p>Новых карточек в этой выборке нет, а изученные вернутся по расписанию. Выберите другое направление или раздел.</p>
      </div>
    )
  const rate = (g: 'know' | 'unsure' | 'dont') => {
    rateCard(q.id, g)
    setShown(false)
    setSession((s) => s + 1)
  }
  const state = cards[q.id]
  return (
    <div className="card flash" style={{ maxWidth: 860, margin: '0 auto' }}>
      <div className="row between">
        <Link to={`/topics/${q.topic.id}`} className="small">
          {q.topic.area} · {q.topic.title}
        </Link>
        <span className="tiny faint">
          {state ? `повторение, уровень ${state.box}` : 'новая'} · в очереди {deck.length} · за сессию {session}
        </span>
      </div>
      <div className="flash-q">{q.q}</div>
      {shown ? (
        <div>
          <div className="card flat" style={{ background: 'var(--surface-2)', border: 0 }}>
            <Md text={q.a} compact />
          </div>
          <div className="row mt-s">
            <button className="btn ok" onClick={() => rate('know')}>
              Знал
            </button>
            <button className="btn warm" onClick={() => rate('unsure')}>
              Частично
            </button>
            <button className="btn bad" onClick={() => rate('dont')}>
              Не знал
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          <button className="btn primary" onClick={() => setShown(true)}>
            Показать ответ
          </button>
          <span className="small faint">Сначала ответьте вслух — как на собеседовании</span>
        </div>
      )}
    </div>
  )
}
