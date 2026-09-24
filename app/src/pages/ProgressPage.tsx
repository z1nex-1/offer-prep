import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Progress } from '../components/ui'
import { questions, topics } from '../data'
import { cases } from '../data/cases'
import { problems } from '../data/problems'
import { quiz } from '../data/quiz'
import { sqlTasks } from '../data/sql'
import { trackById } from '../data/tracks'
import { exportState, importState, resetState, useStore } from '../lib/store'

export default function ProgressPage() {
  const s = useStore((x) => x)
  const file = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const known = Object.values(s.cards).filter((c) => c.last === 'know').length
  const rows = [
    { label: 'Темы изучены', got: Object.keys(s.topics).length, total: topics.length, to: '/tracks' },
    { label: 'Вопросы на «знаю»', got: known, total: questions.length, to: '/questions' },
    { label: 'Алгоритмические задачи', got: Object.keys(s.problems).length, total: problems.length, to: '/problems' },
    { label: 'SQL-задачи', got: Object.keys(s.sql).length, total: sqlTasks.length, to: '/sql' },
    { label: 'JS-квиз', got: Object.values(s.quiz).filter(Boolean).length, total: quiz.length, to: '/quiz' },
    { label: 'Кейсы разобраны', got: Object.keys(s.cases).length, total: cases.length, to: '/cases' },
  ]

  const download = () => {
    const blob = new Blob([exportState()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `offer-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const onFile = async (f?: File) => {
    if (!f) return
    try {
      importState(await f.text())
      setMsg('Прогресс восстановлен.')
    } catch (e) {
      setMsg(`Не удалось прочитать файл: ${String(e)}`)
    }
  }

  return (
    <div className="container narrow">
      <h1>Прогресс и данные</h1>
      <div className="card">
        <div className="list">
          {rows.map((r) => (
            <div key={r.label} className="stack" style={{ gap: 6 }}>
              <div className="row between">
                <Link to={r.to} style={{ color: 'var(--text)', fontWeight: 600 }}>
                  {r.label}
                </Link>
                <span className="small muted">
                  {r.got} / {r.total}
                </span>
              </div>
              <Progress value={r.total ? (r.got / r.total) * 100 : 0} ok />
            </div>
          ))}
        </div>
      </div>
      {s.mocks.length > 0 && (
        <div className="card mt">
          <h3>Пробные интервью</h3>
          <div className="list small">
            {s.mocks.map((m) => (
              <div key={m.at} className="row between">
                <span>
                  {new Date(m.at).toLocaleDateString('ru-RU')} · {trackById[m.track]?.short}
                </span>
                <b>{Math.round((m.score / Math.max(1, m.total)) * 100)}%</b>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="card mt stack">
        <h3 style={{ margin: 0 }}>Ваши данные</h3>
        <p className="small muted" style={{ margin: 0 }}>
          Прогресс, заметки и код хранятся только в этом браузере. Чтобы перенести их на другое устройство, скачайте файл и загрузите его там.
        </p>
        <div className="row">
          <button className="btn" onClick={download}>
            Скачать прогресс
          </button>
          <button className="btn" onClick={() => file.current?.click()}>
            Загрузить из файла
          </button>
          <input ref={file} type="file" accept="application/json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <button
            className="btn bad"
            onClick={() => {
              if (confirm('Удалить весь прогресс в этом браузере? Действие нельзя отменить.')) {
                resetState()
                setMsg('Прогресс очищен.')
              }
            }}
          >
            Сбросить всё
          </button>
        </div>
        {msg && <div className="notice small">{msg}</div>}
      </div>
    </div>
  )
}
