import { useMemo, useState } from 'react'
import { Md, Progress } from '../components/ui'
import { quiz } from '../data/quiz'
import { update, useStore } from '../lib/store'

export default function Quiz() {
  const results = useStore((s) => s.quiz)
  const [topic, setTopic] = useState('')
  const [onlyWrong, setOnlyWrong] = useState(false)
  const topics = useMemo(() => [...new Set(quiz.map((q) => q.topic))], [])
  const list = quiz.filter((q) => (!topic || q.topic === topic) && (!onlyWrong || results[q.id] === false))
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const [guess, setGuess] = useState('')
  const item = list[Math.min(i, list.length - 1)]
  const right = Object.values(results).filter(Boolean).length
  const answered = Object.keys(results).length

  const mark = (ok: boolean) => {
    update((s) => ({ ...s, quiz: { ...s.quiz, [item.id]: ok } }))
    setShown(false)
    setGuess('')
    setI((x) => (x + 1) % Math.max(1, list.length))
  }

  return (
    <div className="container narrow">
      <h1>Что выведет JavaScript</h1>
      <p className="lead muted">
        Формат, который любят Т-Банк, МТС и Яндекс на фронтенд-секциях: смотрите на код, проговариваете порядок выполнения и называете вывод. Потом сверяетесь с разбором.
      </p>
      <p className="small faint">Код выполняется как ES-модуль (строгий режим). Массивы в ответах записаны так, как их печатает Node.js.</p>
      <div className="card flat mb">
        <div className="small muted">
          Верно {right} из {answered} отвеченных · всего {quiz.length}
        </div>
        <Progress value={quiz.length ? (answered / quiz.length) * 100 : 0} />
        <div className="chips mt-s">
          <button className={topic === '' ? 'chip on' : 'chip'} onClick={() => (setTopic(''), setI(0))}>
            Все темы
          </button>
          {topics.map((t) => (
            <button key={t} className={topic === t ? 'chip on' : 'chip'} onClick={() => (setTopic(t), setI(0))}>
              {t}
            </button>
          ))}
          <button className={onlyWrong ? 'chip on' : 'chip'} onClick={() => (setOnlyWrong((x) => !x), setI(0))}>
            Только ошибки
          </button>
        </div>
      </div>
      {!item ? (
        <div className="empty card">Здесь пусто — ошибок нет или фильтр слишком узкий.</div>
      ) : (
        <div className="card stack">
          <div className="row between">
            <span className="chip">{item.topic}</span>
            <span className="tiny faint">
              {Math.min(i, list.length - 1) + 1} / {list.length}
              {results[item.id] !== undefined && (results[item.id] ? ' · вы отвечали верно' : ' · в прошлый раз ошибка')}
            </span>
          </div>
          <Md text={'```js\n' + item.code + '\n```'} />
          {!shown ? (
            <div className="stack">
              <textarea className="input" style={{ minHeight: 80, fontFamily: 'var(--mono)' }} value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Ваш вариант вывода — по строке на каждый console.log" />
              <div className="row">
                <button className="btn primary" onClick={() => setShown(true)}>
                  Проверить
                </button>
                <button className="btn ghost" onClick={() => (setI((x) => (x + 1) % list.length), setGuess(''))}>
                  Пропустить
                </button>
              </div>
            </div>
          ) : (
            <div className="stack">
              <div className="grid grid-2">
                {guess && (
                  <div>
                    <div className="tiny faint">Ваш ответ</div>
                    <pre className="result">{guess}</pre>
                  </div>
                )}
                <div>
                  <div className="tiny faint">Правильный вывод</div>
                  <pre className="result pass">{item.answer}</pre>
                </div>
              </div>
              <Md text={item.explanation} compact />
              <div className="row">
                <button className="btn ok" onClick={() => mark(true)}>
                  Я ответил верно
                </button>
                <button className="btn bad" onClick={() => mark(false)}>
                  Ошибся
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
