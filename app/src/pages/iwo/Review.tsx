import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Crumbs, Md, plural } from '../../components/ui'
import { lessonById, lessons } from '../../course/content'
import { rateCard, useStore } from '../../lib/store'

interface Card {
  id: string
  q: string
  a: string
  lesson: string
}

export default function Review() {
  const cards = useStore((s) => s.cards)
  const done = useStore((s) => s.iwo.lessons)
  const [open, setOpen] = useState(false)
  const [started] = useState(Date.now())

  const all: Card[] = useMemo(() => lessons.flatMap((l) => l.oral.map((q, i) => ({ id: `iwo:${l.id}#${i}`, q: q.q, a: q.a, lesson: l.id }))), [])
  // Карточки, которые пора повторить, плюс новые из пройденных уроков.
  const due = all.filter((c) => (cards[c.id] ? cards[c.id].due <= started : !!done[c.lesson]))
  const current = due.find((c) => !cards[c.id] || cards[c.id].due <= Date.now())
  const learned = all.filter((c) => cards[c.id]?.last === 'know').length

  const rate = (g: 'know' | 'unsure' | 'dont') => {
    if (!current) return
    rateCard(current.id, g)
    setOpen(false)
  }

  return (
    <div className="container narrow">
      <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'Повторение' }]} />
      <h1>Повторение карточек</h1>
      <p className="muted">
        Вопросы с собеседований из пройденных уроков. Интервалы растут, когда вы отвечаете уверенно: 1, 3, 7, 16 дней. Сейчас к повторению — {plural(due.filter((c) => !cards[c.id] || cards[c.id].due <= Date.now()).length, 'карточка', 'карточки', 'карточек')}; уверенно отвечаете на {learned} из {all.length}.
      </p>
      {!current ? (
        <div className="card">
          <p>На сегодня всё. {Object.keys(done).length ? 'Новые карточки появятся, когда пройдёте следующие уроки.' : 'Карточки появляются после прохождения уроков.'}</p>
          <Link className="btn" to="/iwo/plan">
            К плану
          </Link>
        </div>
      ) : (
        <div className="card stack">
          <div className="tiny faint">
            <Link to={`/iwo/l/${current.lesson}`}>{lessonById[current.lesson]?.title}</Link>
          </div>
          <b style={{ fontSize: 19 }}>{current.q}</b>
          {!open ? (
            <button className="btn primary" style={{ justifySelf: 'start' }} onClick={() => setOpen(true)}>
              Показать ответ
            </button>
          ) : (
            <>
              <Md text={current.a} />
              <div className="row">
                <button className="btn ok" onClick={() => rate('know')}>
                  Знал
                </button>
                <button className="btn warm" onClick={() => rate('unsure')}>
                  Частично
                </button>
                <button className="btn bad" onClick={() => rate('dont')}>
                  Не знал
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
