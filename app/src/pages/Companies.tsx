import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CompanyBadge, Crumbs, Months, MONTHS_FULL, Resources } from '../components/ui'
import { companies, companyById } from '../data/companies'
import { trackById, tracks } from '../data/tracks'
import type { TrackId } from '../types'

export function Companies() {
  const [track, setTrack] = useState<string>('')
  const list = track ? companies.filter((c) => c.tracks.some((t) => t.track === track)) : companies
  return (
    <div className="container">
      <h1>Компании</h1>
      <p className="lead muted" style={{ maxWidth: 760 }}>
        Как устроен отбор на стажировки у крупных российских работодателей: этапы, длительность секций, что проверяют на каждом направлении и когда открывается набор.
      </p>
      <div className="chips mb">
        <button className={track ? 'chip' : 'chip on'} onClick={() => setTrack('')}>
          Все
        </button>
        {tracks.map((t) => (
          <button key={t.id} className={track === t.id ? 'chip on' : 'chip'} onClick={() => setTrack(t.id)}>
            {t.short}
          </button>
        ))}
      </div>
      <div className="grid grid-3">
        {list.map((c) => (
          <Link key={c.id} to={`/companies/${c.id}${track ? `?track=${track}` : ''}`} className="card card-link stack">
            <div className="row">
              <CompanyBadge c={c} />
              <div style={{ minWidth: 0 }}>
                <b style={{ fontSize: 17 }}>{c.name}</b>
                <div className="faint tiny">{c.kind}</div>
              </div>
            </div>
            <p className="muted small" style={{ margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {c.about}
            </p>
            <div className="chips">
              {[...new Set(c.tracks.map((t) => t.track))].slice(0, 6).map((t) => (
                <span key={t} className="chip">
                  {trackById[t]?.short}
                </span>
              ))}
            </div>
            <Months on={c.months} />
            {c.confidence === 'official' && <span className="chip official" style={{ justifySelf: 'start' }}>Данные с официальных страниц</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function CompanyPage() {
  const { id = '' } = useParams()
  const [sp, setSp] = useSearchParams()
  const c = companyById[id]
  if (!c) return <div className="container empty">Компания не найдена. <Link to="/companies">Все компании</Link></div>
  const trackIds = [...new Set(c.tracks.map((t) => t.track))]
  const current = (sp.get('track') as TrackId) || trackIds[0]
  const ctracks = c.tracks.filter((t) => t.track === current)
  const monthsText = c.months.length === 12 ? 'круглый год' : c.months.map((m) => MONTHS_FULL[m - 1]).join(', ')

  return (
    <div className="container">
      <Crumbs items={[{ to: '/companies', label: 'Компании' }, { label: c.name }]} />
      <div className="row" style={{ gap: 16, alignItems: 'center' }}>
        <CompanyBadge c={c} lg />
        <div>
          <h1 style={{ margin: 0 }}>{c.name}</h1>
          <div className="muted">{c.kind}</div>
        </div>
      </div>
      <p className="mt" style={{ maxWidth: 860, fontSize: 17 }}>
        {c.about}
      </p>
      {c.confidence === 'mixed' && (
        <div className="notice warm small" style={{ maxWidth: 860 }}>
          Часть сведений собрана из публичных отзывов и разборов, а не с официальной страницы. Детали отбора зависят от команды — перед подачей сверьтесь с источниками внизу страницы.
        </div>
      )}

      <div className="grid grid-3 mt">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3>Путь кандидата</h3>
          <div className="steps">
            {c.flow.map((f) => (
              <div className="step" key={f}>
                <div className="step-body">{f}</div>
              </div>
            ))}
          </div>
          <h3 className="mt">Программы и ресурсы</h3>
          <div className="list">
            {c.programs.map((p) => (
              <div key={p.url}>
                <a href={p.url} target="_blank" rel="noreferrer">
                  <b>{p.name}</b>
                </a>
                <div className="small muted">{p.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Условия</h3>
          <div className="list">
            {c.conditions.map((x) => (
              <div key={x.label}>
                <div className="faint tiny">{x.label}</div>
                <div className="small">{x.value}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="faint tiny mb" style={{ marginBottom: 6 }}>
              Когда набор: {monthsText}
            </div>
            <Months on={c.months} />
            <p className="small muted mt-s" style={{ marginBottom: 0 }}>
              {c.hiring}
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Отбор по направлениям</h2>
        </div>
        <div className="tabs">
          {trackIds.map((t) => (
            <button key={t} className={t === current ? 'on' : ''} onClick={() => setSp({ track: t }, { replace: true })}>
              {trackById[t]?.short}
            </button>
          ))}
        </div>
        {ctracks.map((ct, i) => (
          <div key={i} className="grid grid-3" style={{ marginBottom: 16 }}>
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <h3>{ct.title ?? trackById[ct.track]?.name}</h3>
              <div className="steps">
                {ct.stages.map((s) => (
                  <div className="step" key={s.name}>
                    <div className="step-body">
                      <b>
                        {s.name}
                        {s.duration && <span className="chip" style={{ marginLeft: 8, verticalAlign: 'middle' }}>{s.duration}</span>}
                      </b>
                      <span className="muted">{s.details}</span>
                    </div>
                  </div>
                ))}
              </div>
              {ct.note && <div className="notice small">{ct.note}</div>}
            </div>
            <div className="card stack">
              <h3 style={{ margin: 0 }}>Что подтянуть</h3>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {ct.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link className="btn primary" to={`/plan?track=${ct.track}&company=${c.id}`}>
                План под {c.name}
              </Link>
              <Link className="btn" to={`/mock?track=${ct.track}&company=${c.id}`}>
                Пробное интервью
              </Link>
              <Link className="small" to={`/tracks/${ct.track}`}>
                Всё о направлении →
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="section grid grid-2">
        <div className="card">
          <h3>Что ценят</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {c.values.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Советы</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {c.tips.map((v) => (
              <li key={v} style={{ marginBottom: 6 }}>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h3>Источники</h3>
          <Resources items={c.sources} />
        </div>
      </section>
    </div>
  )
}
