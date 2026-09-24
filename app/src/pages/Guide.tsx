import { Link, useParams } from 'react-router-dom'
import { Check, Md } from '../components/ui'
import { guide } from '../data/guide'
import { update, useStore } from '../lib/store'

export default function Guide() {
  const { id = 'overview' } = useParams()
  const a = guide.find((g) => g.id === id) ?? guide[0]
  const checks = useStore((s) => s.checklist)
  const toggle = (k: string) => update((s) => ({ ...s, checklist: { ...s.checklist, [k]: !s.checklist[k] } }))
  const idx = guide.indexOf(a)
  const next = guide[idx + 1]

  return (
    <div className="container">
      <div className="split" style={{ gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)' }}>
        <aside className="sticky card flat" style={{ padding: 10 }}>
          <div className="eyebrow" style={{ padding: '6px 8px' }}>
            Гайд по подготовке
          </div>
          <nav style={{ display: 'grid' }}>
            {guide.map((g, i) => (
              <Link key={g.id} to={`/guide/${g.id}`} style={{ padding: '8px 10px', borderRadius: 9, color: g.id === a.id ? 'var(--text)' : 'var(--muted)', background: g.id === a.id ? 'var(--surface-2)' : undefined, fontWeight: 600, fontSize: 15 }}>
                {i + 1}. {g.title}
              </Link>
            ))}
          </nav>
        </aside>
        <article>
          <h1>{a.title}</h1>
          <p className="lead muted">{a.summary}</p>
          <div className="card">
            <Md text={a.body} />
          </div>
          {a.checklist && (
            <div className="card mt">
              <h3>Чек-лист</h3>
              <div className="list">
                {a.checklist.map((c) => {
                  const k = `${a.id}:${c}`
                  return (
                    <div key={c} className="topic-row">
                      <Check on={!!checks[k]} onClick={() => toggle(k)} />
                      <span>{c}</span>
                    </div>
                  )
                })}
              </div>
              <div className="small muted mt-s">
                Готово {a.checklist.filter((c) => checks[`${a.id}:${c}`]).length} из {a.checklist.length}
              </div>
            </div>
          )}
          {next && (
            <div className="row mt" style={{ justifyContent: 'flex-end' }}>
              <Link className="btn" to={`/guide/${next.id}`}>
                {next.title} →
              </Link>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
