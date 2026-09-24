import { useState } from 'react'
import { Md } from '../components/ui'
import { behavioral, questionsToAsk, selfPitchFields } from '../data/behavioral'
import { update, useStore } from '../lib/store'

export default function Behavioral() {
  const notes = useStore((s) => s.notes)
  const [open, setOpen] = useState<number | null>(0)
  const pitch = selfPitchFields.map((f) => notes[`pitch:${f.id}`] ?? '')
  const setNote = (k: string, v: string) => update((s) => ({ ...s, notes: { ...s.notes, [k]: v } }))
  const text = pitch[0]
    ? `Меня зовут … ${pitch[0]}. ${pitch[1] ? `Главное, что я сделал: ${pitch[1]}.` : ''} ${pitch[2] ? `Кроме того, ${pitch[2]}.` : ''} ${pitch[3] ? `Мне интересно это направление, потому что ${pitch[3].charAt(0).toLowerCase() + pitch[3].slice(1)}.` : ''} ${pitch[4] ? `К вам хочу, потому что ${pitch[4].charAt(0).toLowerCase() + pitch[4].slice(1)}.` : ''}`.replace(/\s+/g, ' ').trim()
    : ''

  return (
    <div className="container">
      <h1>Поведенческое интервью</h1>
      <p className="lead muted" style={{ maxWidth: 780 }}>
        Финальные встречи с командами, HR-интервью в МТС и Сбере, секция «Знакомство» у продактов и дизайнеров Т-Банка — всё это про вас, а не про код. Здесь хорошо подготовленный кандидат заметно выигрывает у сильного, но неподготовленного.
      </p>

      <div className="grid grid-2">
        <div className="card">
          <h3>Метод STAR</h3>
          <Md
            compact
            text={`Любую историю о своём опыте раскладывайте на четыре части:
- **Situation** — контекст в одном-двух предложениях.
- **Task** — что нужно было сделать и почему это было непросто.
- **Action** — что сделали **лично вы**. Это 60% рассказа.
- **Result** — чем закончилось, лучше с числом. И что вынесли.

Подготовьте заранее 5–6 историй: сложный проект, ошибка, конфликт, инициатива, быстрое обучение, работа в команде. Одна история может отвечать на несколько вопросов.`}
          />
        </div>
        <div className="card">
          <h3>Конструктор самопрезентации</h3>
          <div className="stack">
            {selfPitchFields.map((f) => (
              <div className="field" key={f.id}>
                <label>{f.label}</label>
                <input className="input" value={notes[`pitch:${f.id}`] ?? ''} placeholder={f.placeholder} onChange={(e) => setNote(`pitch:${f.id}`, e.target.value)} />
              </div>
            ))}
            {text && (
              <div className="notice">
                <div className="tiny faint">Черновик на 40–60 секунд — перескажите своими словами, не заучивайте:</div>
                {text}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="section">
        <h2>Частые вопросы</h2>
        {behavioral.map((b, i) => (
          <div className="qa" key={i}>
            <button className="qa-q" onClick={() => setOpen(open === i ? null : i)}>
              <span className="n">{i + 1}</span>
              <span style={{ flex: 1 }}>{b.q}</span>
              <span className="faint">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="qa-a stack">
                <div className="small">
                  <b>Зачем спрашивают.</b> {b.why}
                </div>
                <Md text={b.how} compact />
                {b.example && <div className="notice small">{b.example}</div>}
                <div className="field">
                  <label>Ваш ответ (тезисы сохраняются)</label>
                  <textarea className="input" style={{ minHeight: 90 }} value={notes[`beh:${i}`] ?? ''} onChange={(e) => setNote(`beh:${i}`, e.target.value)} />
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="section card">
        <h3>Что спросить у интервьюера</h3>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          {questionsToAsk.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
