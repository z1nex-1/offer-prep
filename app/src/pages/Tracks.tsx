import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, CompanyBadge, Crumbs, LevelChip, Progress, Resources, plural } from '../components/ui'
import { trackTopics } from '../data'
import { companies } from '../data/companies'
import { trackById, tracks } from '../data/tracks'
import { toggleTopic, update, useStore } from '../lib/store'
import type { Topic } from '../types'

const PRACTICE: Record<string, string> = { must: 'Обязательно', should: 'Желательно', light: 'Базовый уровень', none: 'Не нужно' }

export function Tracks() {
  const cats = [...new Set(tracks.map((t) => t.category))]
  const done = useStore((s) => s.topics)
  return (
    <div className="container">
      <h1>Направления</h1>
      <p className="lead muted" style={{ maxWidth: 760 }}>
        Для каждого направления — чем занимается специалист, из каких секций состоит собеседование, какие темы учить по порядку и что положить в портфолио.
      </p>
      {cats.map((cat) => (
        <section key={cat} className="section">
          <div className="eyebrow">{cat}</div>
          <div className="grid grid-3">
            {tracks
              .filter((t) => t.category === cat)
              .map((t) => {
                const got = t.topics.filter((x) => done[x]).length
                const hiring = companies.filter((c) => c.tracks.some((ct) => ct.track === t.id))
                return (
                  <Link key={t.id} to={`/tracks/${t.id}`} className="card card-link stack">
                    <div className="row between">
                      <b style={{ fontSize: 18 }}>{t.name}</b>
                      <span className="chip">{t.glyph || t.short}</span>
                    </div>
                    <p className="muted small" style={{ margin: 0 }}>
                      {t.about.split('. ')[0]}.
                    </p>
                    <div className="row" style={{ gap: 4 }}>
                      {hiring.slice(0, 8).map((c) => (
                        <span key={c.id} title={c.name} style={{ transform: 'scale(0.62)', margin: -8 }}>
                          <CompanyBadge c={c} />
                        </span>
                      ))}
                      <span className="tiny faint" style={{ marginLeft: 10 }}>
                        {plural(hiring.length, 'компания', 'компании', 'компаний')}
                      </span>
                    </div>
                    {got > 0 && <Progress value={(got / t.topics.length) * 100} />}
                  </Link>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}

export function TrackPage() {
  const { id = '' } = useParams()
  const t = trackById[id]
  const profile = useStore((s) => s.profile)
  const done = useStore((s) => s.topics)
  const [stack, setStack] = useState<string | undefined>(profile.track === id && profile.stack ? profile.stack : t?.stacks?.[0]?.id)
  if (!t) return <div className="container empty">Направление не найдено.</div>
  const list = trackTopics(t, stack)
  const got = list.filter((x) => done[x.id]).length
  const hiring = companies.filter((c) => c.tracks.some((ct) => ct.track === t.id))
  const byArea = list.reduce<Record<string, Topic[]>>((acc, x) => {
    ;(acc[x.area] ||= []).push(x)
    return acc
  }, {})
  const setStackPersist = (s: string) => {
    setStack(s)
    update((st) => ({ ...st, profile: { ...st.profile, track: t.id, stack: s } }))
  }

  return (
    <div className="container">
      <Crumbs items={[{ to: '/tracks', label: 'Направления' }, { label: t.name }]} />
      <div className="row between" style={{ alignItems: 'start' }}>
        <div style={{ maxWidth: 820 }}>
          <div className="eyebrow">{t.category}</div>
          <h1>{t.name}</h1>
          <p style={{ fontSize: 17 }}>{t.about}</p>
        </div>
        <div className="card stack" style={{ minWidth: 260 }}>
          <div className="row">
            <div className="ring" style={{ ['--p' as string]: list.length ? Math.round((got / list.length) * 100) : 0 }}>
              <span>{list.length ? Math.round((got / list.length) * 100) : 0}%</span>
            </div>
            <div className="small muted">
              Изучено {got} из {list.length} тем
            </div>
          </div>
          <Link className="btn primary" to={`/plan?track=${t.id}${stack ? `&stack=${stack}` : ''}`}>
            Составить план
          </Link>
          <Link className="btn" to={`/mock?track=${t.id}`}>
            Пробное интервью
          </Link>
        </div>
      </div>

      <section className="section grid grid-2">
        <div className="card">
          <h3>Что проверяют на собеседованиях</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {t.checks.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Чем занимается на работе</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {t.daily.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Типичные секции</h2>
        </div>
        <div className="grid grid-4">
          {t.sections.map((s) => (
            <div key={s.name} className="card flat">
              <b>{s.name}</b>
              {s.duration && <div className="faint tiny">{s.duration}</div>}
              <ul className="small muted" style={{ paddingLeft: 16, marginBottom: 0 }}>
                {s.what.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Где берут стажёров</h2>
        </div>
        <div className="grid grid-4">
          {hiring.map((c) => (
            <Link key={c.id} to={`/companies/${c.id}?track=${t.id}`} className="card card-link row" style={{ padding: 14 }}>
              <CompanyBadge c={c} />
              <div>
                <b>{c.name}</b>
                <div className="tiny faint">Как проходит отбор →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Программа подготовки</h2>
          {t.stacks && (
            <div className="chips">
              <span className="small muted" style={{ alignSelf: 'center' }}>
                Язык:
              </span>
              {t.stacks.map((s) => (
                <button key={s.id} className={stack === s.id ? 'chip on' : 'chip'} onClick={() => setStackPersist(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="masonry">
          {Object.entries(byArea).map(([area, items]) => (
            <div key={area} className="card">
              <div className="row between">
                <h3 style={{ margin: 0 }}>{area}</h3>
                <span className="tiny faint">
                  {items.filter((x) => done[x.id]).length}/{items.length}
                </span>
              </div>
              <div className="list mt-s">
                {items.map((x) => (
                  <div key={x.id} className="topic-row">
                    <Check on={!!done[x.id]} onClick={() => toggleTopic(x.id)} title="Отметить изученной" />
                    <Link to={`/topics/${x.id}?track=${t.id}${stack ? `&stack=${stack}` : ''}`}>{x.title}</Link>
                    <span className="meta">
                      <LevelChip level={x.level} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section grid grid-3">
        <div className="card">
          <h3>Практика</h3>
          <div className="list small">
            <div className="row between">
              <Link to="/problems">Алгоритмы</Link>
              <span className="chip">{PRACTICE[t.practice.algorithms]}</span>
            </div>
            <div className="row between">
              <Link to="/sql">SQL</Link>
              <span className="chip">{PRACTICE[t.practice.sql]}</span>
            </div>
            {t.practice.jsQuiz && (
              <div className="row between">
                <Link to="/quiz">Что выведет JS</Link>
                <span className="chip">Обязательно</span>
              </div>
            )}
            {t.practice.caseTypes?.length ? (
              <div className="row between">
                <Link to={`/cases?track=${t.id}`}>Кейсы</Link>
                <span className="chip">Обязательно</span>
              </div>
            ) : null}
            <div className="row between">
              <Link to={`/questions?track=${t.id}`}>Вопросы по направлению</Link>
              <span className="chip">Карточки</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>Что показать в портфолио</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }} className="small">
            {t.portfolio.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Частые ошибки</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }} className="small">
            {t.mistakes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section card">
        <h3>Материалы</h3>
        <Resources items={t.resources} />
      </section>
    </div>
  )
}
