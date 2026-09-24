import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CompanyBadge, Crumbs, LevelChip, Md, Resources } from '../components/ui'
import { topicById, trackTopicIds } from '../data'
import { companyById } from '../data/companies'
import { trackById } from '../data/tracks'
import { rateCard, toggleTopic, useStore } from '../lib/store'
import type { Question } from '../types'

export function QA({ id, n, q }: { id: string; n: number; q: Question }) {
  const [open, setOpen] = useState(false)
  const card = useStore((s) => s.cards[id])
  return (
    <div className="qa">
      <button className="qa-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="n">{n}</span>
        <span style={{ flex: 1 }}>{q.q}</span>
        {card && <span className={`chip ${card.last === 'know' ? 'easy' : card.last === 'dont' ? 'hard' : 'medium'}`}>{card.last === 'know' ? 'знаю' : card.last === 'dont' ? 'повторить' : 'сомневаюсь'}</span>}
        <span className="faint">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="qa-a">
          <Md text={q.a} compact />
          {q.companies?.length ? (
            <div className="row mt-s tiny faint">
              Встречалось:
              {q.companies.map((c) => companyById[c] && <span key={c} className="chip">{companyById[c].name}</span>)}
            </div>
          ) : null}
          <div className="row mt-s">
            <span className="tiny faint">Как ответили?</span>
            <button className="btn sm ok" onClick={() => rateCard(id, 'know')}>
              Знал
            </button>
            <button className="btn sm warm" onClick={() => rateCard(id, 'unsure')}>
              Частично
            </button>
            <button className="btn sm bad" onClick={() => rateCard(id, 'dont')}>
              Не знал
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function TopicPage() {
  const { id = '' } = useParams()
  const [sp] = useSearchParams()
  const t = topicById[id]
  const done = useStore((s) => !!s.topics[id])
  if (!t) return <div className="container empty">Тема пока не написана. <Link to="/tracks">К направлениям</Link></div>
  const track = sp.get('track') ? trackById[sp.get('track')!] : undefined
  const stack = sp.get('stack') ?? undefined
  const seq = track ? trackTopicIds(track, stack).filter((x) => topicById[x]) : []
  const idx = seq.indexOf(id)
  const prev = idx > 0 ? seq[idx - 1] : undefined
  const next = idx >= 0 && idx < seq.length - 1 ? seq[idx + 1] : undefined
  const qs = new URLSearchParams(sp).toString()
  const companiesMentioned = [...new Set(t.questions.flatMap((q) => q.companies ?? []))]

  return (
    <div className="container narrow">
      <Crumbs
        items={[
          ...(track ? [{ to: '/tracks', label: 'Направления' }, { to: `/tracks/${track.id}`, label: track.short }] : [{ to: '/tracks', label: 'Направления' }]),
          { label: t.area },
        ]}
      />
      <h1>{t.title}</h1>
      <div className="row mb">
        <LevelChip level={t.level} />
        <span className="chip">≈ {t.minutes} мин</span>
        <span className="chip">{t.questions.length} вопросов</span>
        {companiesMentioned.map((c) => companyById[c] && <span key={c} title={companyById[c].name} style={{ transform: 'scale(0.6)', margin: -9 }}><CompanyBadge c={companyById[c]} /></span>)}
      </div>
      <p className="muted" style={{ fontSize: 17 }}>
        {t.summary}
      </p>
      <article className="card mt">
        <Md text={t.body} />
      </article>

      <section className="section">
        <div className="section-head">
          <h2>Вопросы с собеседований</h2>
          <Link to={`/questions?topic=${t.id}&mode=cards`} className="btn sm">
            Учить карточками
          </Link>
        </div>
        <p className="muted small">Сначала ответьте вслух, потом откройте ответ и честно оцените себя — вопрос попадёт в интервальное повторение.</p>
        {t.questions.map((q, i) => (
          <QA key={i} id={`${t.id}#${i}`} n={i + 1} q={q} />
        ))}
      </section>

      {t.resources?.length ? (
        <section className="section card">
          <h3>Материалы</h3>
          <Resources items={t.resources} />
        </section>
      ) : null}

      <div className="row between section">
        <button className={done ? 'btn ok' : 'btn primary'} onClick={() => toggleTopic(t.id)}>
          {done ? '✓ Тема изучена' : 'Отметить тему изученной'}
        </button>
        <div className="row">
          {prev && (
            <Link className="btn" to={`/topics/${prev}?${qs}`}>
              ← {topicById[prev].title}
            </Link>
          )}
          {next && (
            <Link className="btn" to={`/topics/${next}?${qs}`}>
              {topicById[next].title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
