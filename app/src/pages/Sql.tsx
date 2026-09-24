import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CodeEditor } from '../components/CodeEditor'
import { Crumbs, DiffChip, Md, Progress } from '../components/ui'
import { datasets, sqlTasks } from '../data/sql'
import { runQuery, sameResult, schemaOf, type QueryResult } from '../lib/sqldb'
import { update, useStore } from '../lib/store'

export default function Sql() {
  const { id } = useParams()
  return id ? <SqlTaskPage id={id} /> : <SqlList />
}

function SqlList() {
  const solved = useStore((s) => s.sql)
  const [ds, setDs] = useState('')
  const count = sqlTasks.filter((t) => solved[t.id]).length
  const list = sqlTasks.filter((t) => !ds || t.dataset === ds)
  return (
    <div className="container">
      <h1>SQL-тренажёр</h1>
      <p className="lead muted" style={{ maxWidth: 780 }}>
        Задачи уровня тестовых Яндекса, Т-Банка и Авито: от JOIN и GROUP BY до оконных функций, когорт и воронок. Запросы выполняются на настоящей SQLite-базе прямо в браузере, результат сравнивается с эталонным.
      </p>
      <div className="card flat mb">
        <div className="small muted">
          Решено {count} из {sqlTasks.length}
        </div>
        <Progress value={sqlTasks.length ? (count / sqlTasks.length) * 100 : 0} ok />
        <div className="chips mt-s">
          <button className={ds === '' ? 'chip on' : 'chip'} onClick={() => setDs('')}>
            Все базы
          </button>
          {datasets.map((d) => (
            <button key={d.id} className={ds === d.id ? 'chip on' : 'chip'} onClick={() => setDs(d.id)}>
              {d.title}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 36 }}></th>
              <th>Задача</th>
              <th className="hide-mobile">Навыки</th>
              <th>Сложность</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id}>
                <td>{solved[t.id] ? <span style={{ color: 'var(--ok)', fontWeight: 800 }}>✓</span> : ''}</td>
                <td>
                  <Link to={`/sql/${t.id}`} style={{ fontWeight: 700, color: 'var(--text)' }}>
                    {t.title}
                  </Link>
                  <div className="tiny faint">{datasets.find((d) => d.id === t.dataset)?.title}</div>
                </td>
                <td className="hide-mobile small muted">{t.skills.join(', ')}</td>
                <td>
                  <DiffChip d={t.difficulty} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ResultTable({ r }: { r: QueryResult }) {
  if (!r.columns.length) return <div className="small muted">Запрос выполнен, строк нет.</div>
  return (
    <div className="table-wrap" style={{ maxHeight: 320, overflow: 'auto' }}>
      <table>
        <thead>
          <tr>
            {r.columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {r.values.slice(0, 200).map((row, i) => (
            <tr key={i}>
              {row.map((v, j) => (
                <td key={j} style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                  {v === null ? <span className="faint">NULL</span> : String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type Schema = Awaited<ReturnType<typeof schemaOf>>

function SqlTaskPage({ id }: { id: string }) {
  const idx = sqlTasks.findIndex((t) => t.id === id)
  const task = sqlTasks[idx]
  const saved = useStore((s) => s.code[`sql:${id}`])
  const solved = useStore((s) => s.sql[id])
  const [q, setQ] = useState('')
  const [schema, setSchema] = useState<Schema | null>(null)
  const [res, setRes] = useState<QueryResult | null>(null)
  const [err, setErr] = useState('')
  const [verdict, setVerdict] = useState<{ ok: boolean; reason?: string } | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSol, setShowSol] = useState(false)
  const [expected, setExpected] = useState<QueryResult | null>(null)

  useEffect(() => {
    if (!task) return
    setQ(saved ?? `-- ${task.title}\nSELECT \n`)
    setRes(null)
    setErr('')
    setVerdict(null)
    setShowHint(false)
    setShowSol(false)
    setExpected(null)
    schemaOf(task.dataset).then(setSchema)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!task) return <div className="container empty">Задача не найдена.</div>
  const ds = datasets.find((d) => d.id === task.dataset)!

  const onChange = (v: string) => {
    setQ(v)
    update((s) => ({ ...s, code: { ...s.code, [`sql:${id}`]: v } }))
  }

  const exec = async (check: boolean) => {
    setErr('')
    setVerdict(null)
    try {
      const r = await runQuery(task.dataset, q)
      setRes(r)
      if (check) {
        const exp = await runQuery(task.dataset, task.solution)
        setExpected(exp)
        const v = sameResult(r, exp, !!task.ordered)
        setVerdict(v)
        if (v.ok) update((s) => ({ ...s, sql: { ...s.sql, [task.id]: Date.now() } }))
      }
    } catch (e) {
      setRes(null)
      setErr(String(e).replace('Error: ', ''))
    }
  }

  const next = sqlTasks[idx + 1]

  return (
    <div className="container">
      <Crumbs items={[{ to: '/sql', label: 'SQL-тренажёр' }, { label: ds.title }]} />
      <div className="split">
        <div className="stack">
          <div className="card">
            <div className="row between">
              <h2 style={{ margin: 0 }}>{task.title}</h2>
              {solved && <span className="chip easy">✓ Решено</span>}
            </div>
            <div className="row mt-s">
              <DiffChip d={task.difficulty} />
              {task.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt">
              <Md text={task.statement} />
            </div>
            {task.ordered && <div className="notice small mt-s">Порядок строк важен — не забудьте ORDER BY.</div>}
            <div className="row mt">
              {task.hint && (
                <button className="btn sm" onClick={() => setShowHint(true)}>
                  Подсказка
                </button>
              )}
              <button className="btn sm" onClick={() => setShowSol(true)}>
                Эталонное решение
              </button>
            </div>
            {showHint && task.hint && <div className="notice mt-s">{task.hint}</div>}
            {showSol && <Md text={'```sql\n' + task.solution + '\n```'} />}
          </div>
          <div className="card">
            <h3>База: {ds.title}</h3>
            <p className="small muted">{ds.description}</p>
            {schema?.map((t) => (
              <details key={t.name} style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer' }}>
                  <b style={{ fontFamily: 'var(--mono)' }}>{t.name}</b> <span className="faint small">({t.count} строк)</span>
                  <span className="small muted"> — {t.cols.map((c) => c.name).join(', ')}</span>
                </summary>
                <div className="mt-s">
                  <ResultTable r={t.sample} />
                </div>
              </details>
            ))}
          </div>
        </div>
        <div className="sticky">
          <div className="editor">
            <div className="editor-bar">
              <span className="small muted" style={{ alignSelf: 'center' }}>
                SQLite
              </span>
              <div className="row" style={{ gap: 6 }}>
                <button className="btn sm" onClick={() => exec(false)}>
                  Выполнить
                </button>
                <button className="btn sm primary" onClick={() => exec(true)}>
                  Проверить
                </button>
              </div>
            </div>
            <CodeEditor value={q} onChange={onChange} lang="sql" onRun={() => exec(true)} minHeight={220} />
          </div>
          <div className="results">
            {err && <div className="result fail">{err}</div>}
            {verdict && (
              <div className={verdict.ok ? 'notice ok' : 'notice bad'}>
                <b>{verdict.ok ? 'Верно!' : 'Пока не совпадает с эталоном.'}</b> {verdict.reason}
                {verdict.ok && next && (
                  <>
                    {' '}
                    · <Link to={`/sql/${next.id}`}>Следующая задача →</Link>
                  </>
                )}
              </div>
            )}
            {res && (
              <>
                <div className="small muted">Ваш результат: {res.values.length} строк</div>
                <ResultTable r={res} />
              </>
            )}
            {verdict && !verdict.ok && expected && (
              <details>
                <summary className="small" style={{ cursor: 'pointer' }}>
                  Показать ожидаемый результат
                </summary>
                <ResultTable r={expected} />
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
