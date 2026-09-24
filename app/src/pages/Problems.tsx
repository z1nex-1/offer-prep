import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DiffChip, Progress } from '../components/ui'
import { companyById } from '../data/companies'
import { problems } from '../data/problems'
import { useStore } from '../lib/store'

export default function Problems() {
  const solved = useStore((s) => s.problems)
  const [pattern, setPattern] = useState('')
  const [diff, setDiff] = useState('')
  const [hideSolved, setHideSolved] = useState(false)
  const patterns = useMemo(() => [...new Set(problems.map((p) => p.pattern))], [])
  const list = problems.filter((p) => (!pattern || p.pattern === pattern) && (!diff || p.difficulty === diff) && (!hideSolved || !solved[p.id]))
  const count = problems.filter((p) => solved[p.id]).length

  return (
    <div className="container">
      <h1>Алгоритмические задачи</h1>
      <p className="lead muted" style={{ maxWidth: 780 }}>
        Задачи уровня контестов и лайвкодинга бигтеха, сгруппированные по приёмам. Решение проверяется на тестах прямо в браузере — на JavaScript или Python. После попытки откройте разбор: идея, сложность и эталонный код.
      </p>
      <div className="card flat mb">
        <div className="row between">
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="small muted">
              Решено {count} из {problems.length}
            </div>
            <Progress value={problems.length ? (count / problems.length) * 100 : 0} ok />
          </div>
          <label className="row small" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={hideSolved} onChange={(e) => setHideSolved(e.target.checked)} /> Скрыть решённые
          </label>
        </div>
        <div className="chips mt-s">
          {['', 'easy', 'medium', 'hard'].map((d) => (
            <button key={d} className={diff === d ? 'chip on' : 'chip'} onClick={() => setDiff(d)}>
              {d === '' ? 'Любая сложность' : d === 'easy' ? 'Лёгкие' : d === 'medium' ? 'Средние' : 'Сложные'}
            </button>
          ))}
        </div>
        <div className="chips mt-s">
          <button className={pattern === '' ? 'chip on' : 'chip'} onClick={() => setPattern('')}>
            Все приёмы
          </button>
          {patterns.map((p) => (
            <button key={p} className={pattern === p ? 'chip on' : 'chip'} onClick={() => setPattern(p)}>
              {p}
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
              <th className="hide-mobile">Приём</th>
              <th>Сложность</th>
              <th className="hide-mobile">Встречалась</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{solved[p.id] ? <span style={{ color: 'var(--ok)', fontWeight: 800 }}>✓</span> : ''}</td>
                <td>
                  <Link to={`/problems/${p.id}`} style={{ fontWeight: 700, color: 'var(--text)' }}>
                    {p.title}
                  </Link>
                </td>
                <td className="hide-mobile muted">{p.pattern}</td>
                <td>
                  <DiffChip d={p.difficulty} />
                </td>
                <td className="hide-mobile small muted">{p.companies?.map((c) => companyById[c]?.name).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
