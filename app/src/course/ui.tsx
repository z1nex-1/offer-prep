import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Md } from '../components/ui'
import { toggleIn, useStore, type State } from '../lib/store'
import { taskDone, type Task } from './plan'
import { MASTERY_CLASS, MASTERY_LABEL, type Mastery } from './progress'
import type { MCQ } from './types'

export function MasteryChip({ m }: { m: Mastery | undefined }) {
  if (m === undefined) return <span className="chip">Не проверено</span>
  return <span className={`chip ${MASTERY_CLASS[m]}`}>{MASTERY_LABEL[m]}</span>
}

export function QuizBlock({ items, onFinish, initial }: { items: MCQ[]; onFinish?: (score: number, total: number) => void; initial?: { score: number; total: number } }) {
  const [picked, setPicked] = useState<Record<number, number>>({})
  const [round, setRound] = useState(0)
  const answered = Object.keys(picked).length
  const score = items.reduce((m, q, i) => m + (picked[i] === q.answer ? 1 : 0), 0)
  const choose = (i: number, o: number) => {
    if (picked[i] !== undefined) return
    const next = { ...picked, [i]: o }
    setPicked(next)
    if (Object.keys(next).length === items.length) {
      const sc = items.reduce((m, q, j) => m + (next[j] === q.answer ? 1 : 0), 0)
      onFinish?.(sc, items.length)
    }
  }
  return (
    <div className="stack" key={round}>
      {initial && answered === 0 && (
        <div className={initial.score >= initial.total * 0.8 ? 'notice ok' : 'notice warm'}>
          Прошлый результат: {initial.score} из {initial.total}. {initial.score >= initial.total * 0.8 ? 'Тема засчитана.' : 'Для зачёта нужно 80% — перечитайте разделы, где ошиблись, и пройдите ещё раз.'}
        </div>
      )}
      {items.map((q, i) => {
        const p = picked[i]
        return (
          <div key={i} className="card flat mcq">
            <div className="mcq-q">
              <span className="n">{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Md text={q.q} compact />
              </div>
            </div>
            <div className="mcq-options">
              {q.options.map((o, j) => {
                const cls = p === undefined ? '' : j === q.answer ? 'right' : j === p ? 'wrong' : 'dim'
                return (
                  <button key={j} className={`mcq-opt ${cls}`} onClick={() => choose(i, j)} disabled={p !== undefined}>
                    <Md text={o} compact />
                  </button>
                )
              })}
            </div>
            {p !== undefined && (
              <div className={p === q.answer ? 'notice ok' : 'notice bad'}>
                <b>{p === q.answer ? 'Верно.' : 'Неверно.'}</b> <Md text={q.explain} compact />
              </div>
            )}
          </div>
        )
      })}
      {answered === items.length && items.length > 0 && (
        <div className="row between">
          <b>
            Результат: {score} из {items.length}
          </b>
          <button
            className="btn sm"
            onClick={() => {
              setPicked({})
              setRound((r) => r + 1)
            }}
          >
            Пройти заново
          </button>
        </div>
      )}
    </div>
  )
}

const KIND_LABEL: Record<Task['kind'], string> = {
  lesson: 'Теория',
  problem: 'Задача',
  contest: 'Контест',
  coderun: 'Яндекс',
  review: 'Повторение',
  virtual: 'Репетиция',
  mock: 'Мок',
  milestone: 'Этап',
  interview: 'Секция',
  setup: 'Старт',
}

export function TaskRow({ t, s }: { t: Task; s: State }) {
  const done = taskDone(t, s)
  const toggle = () => {
    if (t.kind === 'coderun') toggleIn('coderun', t.ref!, !done)
    else if (t.kind === 'lesson') toggleIn('lessons', t.ref!, !done)
    else toggleIn('done', t.id, !done)
  }
  const auto = t.kind === 'problem' || t.kind === 'contest'
  return (
    <div className={done ? 'task done' : 'task'}>
      <Check on={done} onClick={auto ? () => toggleIn('done', t.id, !done) : toggle} title={auto ? 'Отмечается автоматически после решения; можно отметить вручную' : 'Отметить'} />
      <div className="task-body">
        <div className="row" style={{ gap: 8 }}>
          <span className={`chip kind-${t.kind}`}>{KIND_LABEL[t.kind]}</span>
          {t.external ? (
            <a href={t.to} target="_blank" rel="noreferrer">
              {t.title} ↗
            </a>
          ) : (
            <Link to={t.to}>{t.title}</Link>
          )}
          {t.optional && <span className="chip">по желанию</span>}
        </div>
        {t.detail && <div className="tiny faint">{t.detail}</div>}
      </div>
      <span className="tiny faint nowrap">{t.minutes} мин</span>
    </div>
  )
}

export function useIwo() {
  return useStore((s) => s)
}
