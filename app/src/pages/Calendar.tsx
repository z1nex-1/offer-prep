import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { CompanyBadge, MONTHS_FULL } from '../components/ui'
import { companies } from '../data/companies'
import { tracks } from '../data/tracks'

const SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export default function Calendar() {
  const now = new Date().getMonth() + 1
  const [track, setTrack] = useState('')
  const list = track ? companies.filter((c) => c.tracks.some((t) => t.track === track)) : companies
  const openNow = list.filter((c) => c.months.includes(now))
  const soon = list.filter((c) => !c.months.includes(now) && (c.months.includes((now % 12) + 1) || c.months.includes(((now + 1) % 12) + 1)))

  return (
    <div className="container">
      <h1>Календарь наборов</h1>
      <p className="lead muted" style={{ maxWidth: 780 }}>
        Когда компании обычно открывают набор на стажировки. Расписание повторяется из года в год с точностью до пары недель, но донаборы бывают в любой момент — подписывайтесь на каналы компаний.
      </p>
      <div className="chips mb">
        <button className={track ? 'chip' : 'chip on'} onClick={() => setTrack('')}>
          Все направления
        </button>
        {tracks.map((t) => (
          <button key={t.id} className={track === t.id ? 'chip on' : 'chip'} onClick={() => setTrack(t.id)}>
            {t.short}
          </button>
        ))}
      </div>
      <div className="grid grid-2 mb">
        <div className="card">
          <div className="eyebrow">Сейчас, {MONTHS_FULL[now - 1]}</div>
          <div className="chips">
            {openNow.map((c) => (
              <Link key={c.id} to={`/companies/${c.id}`} className="chip on">
                {c.name}
              </Link>
            ))}
            {!openNow.length && <span className="muted small">Обычно в этом месяце крупных наборов нет</span>}
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">Скоро откроются — начинайте готовиться</div>
          <div className="chips">
            {soon.map((c) => (
              <Link key={c.id} to={`/companies/${c.id}`} className="chip">
                {c.name}
              </Link>
            ))}
            {!soon.length && <span className="muted small">—</span>}
          </div>
        </div>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <div className="cal">
          <div />
          {SHORT.map((m, i) => (
            <div key={m} className="h" style={i + 1 === now ? { color: 'var(--warm)' } : undefined}>
              {m}
            </div>
          ))}
          {list.map((c) => (
            <Fragment key={c.id}>
              <Link to={`/companies/${c.id}`} className="name" style={{ color: 'var(--text)' }}>
                <span style={{ transform: 'scale(0.6)', margin: -9 }}>
                  <CompanyBadge c={c} />
                </span>
                {c.name}
              </Link>
              {SHORT.map((m, i) => (
                <div key={m} className={`cell ${c.months.includes(i + 1) ? 'on' : ''} ${i + 1 === now ? 'now' : ''}`} title={`${c.name}: ${MONTHS_FULL[i]}`} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="grid grid-2 mt">
        {list.map((c) => (
          <div key={c.id} className="card flat">
            <b>{c.name}</b>
            <p className="small muted" style={{ margin: '4px 0 0' }}>
              {c.hiring}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
