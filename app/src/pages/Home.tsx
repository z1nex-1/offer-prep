import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CompanyBadge, Months, Progress, plural } from '../components/ui'
import { companies } from '../data/companies'
import { tracks } from '../data/tracks'
import { useStore } from '../lib/store'

export function Home() {
  const nav = useNavigate()
  const profile = useStore((s) => s.profile)
  const plan = useStore((s) => s.plan)
  const done = useStore((s) => s.topics)
  const [track, setTrack] = useState<string>(profile.track ?? 'backend')
  const [company, setCompany] = useState<string>(profile.company ?? '')
  const month = new Date().getMonth() + 1
  const openNow = companies.filter((c) => c.months.includes(month))
  const cats = [...new Set(tracks.map((t) => t.category))]
  const [stats, setStats] = useState({ topics: 150, questions: 690, tasks: 150 })
  useEffect(() => {
    Promise.all([import('../data'), import('../data/problems'), import('../data/sql'), import('../data/cases')]).then(([d, p, s, c]) =>
      setStats({ topics: d.topics.length, questions: d.questions.length, tasks: p.problems.length + s.sqlTasks.length + c.cases.length }),
    )
  }, [])

  const go = () => {
    const q = new URLSearchParams({ track })
    if (company) q.set('company', company)
    nav(`/plan?${q}`)
  }

  return (
    <div className="container">
      <section className="hero hero-grid">
        <div>
        <div className="eyebrow">Стажировки и первые офферы в IT</div>
        <h1>Готовьтесь к собеседованию так, как отбирает конкретная компания</h1>
        <p className="lead">
          Этапы отбора Яндекса, Т-Банка, Сбера, VK, Ozon, Авито и ещё {companies.length - 6} работодателей — по их собственным описаниям. План по неделям, конспекты, вопросы с ответами, задачи с автопроверкой и пробное интервью с таймером.
        </p>
        <div className="picker">
          <div className="field">
            <label htmlFor="pick-track">Направление</label>
            <select id="pick-track" className="input" value={track} onChange={(e) => setTrack(e.target.value)}>
              {cats.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {tracks
                    .filter((t) => t.category === cat)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="pick-company">Компания</label>
            <select id="pick-company" className="input" value={company} onChange={(e) => setCompany(e.target.value)}>
              <option value="">Любая — общая подготовка</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn primary" style={{ height: 42 }} onClick={go}>
            Собрать план подготовки
          </button>
        </div>
        {company && (
          <p className="small mt-s">
            <Link to={`/companies/${company}?track=${track}`}>Как проходит отбор в эту компанию на это направление →</Link>
          </p>
        )}
        </div>
        <SelectionPreview track={track} company={company} />
      </section>

      {plan && (
        <section className="card mt">
          <div className="row between">
            <div>
              <div className="eyebrow">Вы остановились здесь</div>
              <h3 style={{ margin: 0 }}>
                План: {tracks.find((t) => t.id === plan.track)?.name}
                {plan.company ? ` · ${companies.find((c) => c.id === plan.company)?.name}` : ''}
              </h3>
              <p className="muted small" style={{ margin: '6px 0 0' }}>
                Изучено тем: {Object.keys(done).length}
              </p>
            </div>
            <Link className="btn primary" to="/plan">
              Продолжить
            </Link>
          </div>
        </section>
      )}

      <section className="section grid grid-4">
        <div className="card flat stat">
          <b>{companies.length}</b>
          <span>компаний с разбором отбора по направлениям</span>
        </div>
        <div className="card flat stat">
          <b>{tracks.length}</b>
          <span>направлений: от бэкенда до продукта и дизайна</span>
        </div>
        <div className="card flat stat">
          <b>{stats.questions}</b>
          <span>вопросов с разобранными ответами в {plural(stats.topics, 'теме', 'темах', 'темах')}</span>
        </div>
        <div className="card flat stat">
          <b>{stats.tasks}</b>
          <span>задач с автопроверкой и кейсов с эталонными решениями</span>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Как устроена подготовка</h2>
        </div>
        <div className="grid grid-2">
          <div className="card">
            <div className="steps">
              <div className="step">
                <div className="step-body">
                  <b>Выберите цель</b>
                  <span className="muted">Направление и компанию. Мы покажем, из каких секций состоит отбор, сколько длится каждая и что на ней проверяют.</span>
                </div>
              </div>
              <div className="step">
                <div className="step-body">
                  <b>Получите план по неделям</b>
                  <span className="muted">С учётом срока, часов в неделю и стартового уровня. Прогресс сохраняется в браузере.</span>
                </div>
              </div>
              <div className="step">
                <div className="step-body">
                  <b>Закройте теорию и практику</b>
                  <span className="muted">Конспекты, вопросы в режиме карточек, задачи на JS и Python, SQL на настоящей базе, кейсы с эталоном.</span>
                </div>
              </div>
              <div className="step">
                <div className="step-body">
                  <b>Проверьте себя на пробном интервью</b>
                  <span className="muted">Секции в формате выбранной компании, таймер, самооценка и список слабых тем.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="eyebrow">Сейчас идёт набор</div>
            <h3>Обычно открыты в этом месяце</h3>
            <div className="list">
              {openNow.slice(0, 7).map((c) => (
                <Link key={c.id} to={`/companies/${c.id}`} className="row" style={{ color: 'var(--text)' }}>
                  <CompanyBadge c={c} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{c.name}</b>
                    <div className="faint tiny">{c.kind}</div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/calendar" className="small">
              Календарь наборов на год →
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Компании</h2>
          <Link to="/companies">Все компании →</Link>
        </div>
        <div className="grid grid-4">
          {companies.slice(0, 8).map((c) => (
            <Link key={c.id} to={`/companies/${c.id}`} className="card card-link">
              <div className="row">
                <CompanyBadge c={c} />
                <div>
                  <b>{c.name}</b>
                  <div className="faint tiny">{plural(c.tracks.length, 'направление', 'направления', 'направлений')}</div>
                </div>
              </div>
              <div className="mt-s">
                <Months on={c.months} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Направления</h2>
          <Link to="/tracks">Подробнее о каждом →</Link>
        </div>
        <div className="grid grid-3">
          {tracks.map((t) => (
            <TrackCard key={t.id} id={t.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

function SelectionPreview({ track, company }: { track: string; company: string }) {
  const withTrack = companies.filter((c) => c.tracks.some((t) => t.track === track))
  const c = companies.find((x) => x.id === company && x.tracks.some((t) => t.track === track)) ?? withTrack[0]
  const t = tracks.find((x) => x.id === track)
  if (!c || !t) return null
  const ct = c.tracks.find((x) => x.track === track)!
  return (
    <Link to={`/companies/${c.id}?track=${track}`} className="card card-link hero-card">
      <div className="row">
        <CompanyBadge c={c} />
        <div style={{ minWidth: 0 }}>
          <b>{c.name}</b>
          <div className="tiny faint">{ct.title ?? t.name}</div>
        </div>
      </div>
      <div className="eyebrow mt">Как проходит отбор</div>
      <div className="steps">
        {ct.stages.slice(0, 4).map((s) => (
          <div className="step" key={s.name}>
            <div className="step-body">
              <b>
                {s.name}
                {s.duration && <span className="chip" style={{ marginLeft: 8, verticalAlign: 'middle' }}>{s.duration}</span>}
              </b>
              <span className="muted small" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {s.details}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="chips">
        {ct.focus.slice(0, 3).map((f) => (
          <span key={f} className="chip on">
            {f}
          </span>
        ))}
      </div>
    </Link>
  )
}

function TrackCard({ id }: { id: string }) {
  const t = tracks.find((x) => x.id === id)!
  const done = useStore((s) => s.topics)
  const total = t.topics.length
  const got = t.topics.filter((x) => done[x]).length
  return (
    <Link to={`/tracks/${t.id}`} className="card card-link">
      <div className="row between">
        <b style={{ fontSize: 17 }}>{t.name}</b>
        <span className="chip">{t.glyph || t.short}</span>
      </div>
      <p className="muted small mt-s" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {t.about}
      </p>
      {got > 0 && (
        <div className="stack" style={{ gap: 4 }}>
          <Progress value={(got / total) * 100} />
          <span className="tiny faint">
            {got} из {total} тем
          </span>
        </div>
      )}
    </Link>
  )
}
