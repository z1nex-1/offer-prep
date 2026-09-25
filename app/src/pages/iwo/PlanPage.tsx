import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Crumbs, Progress, plural } from '../../components/ui'
import { modules } from '../../course/modules'
import { buildCoursePlan, taskDone, type Day } from '../../course/plan'
import { IWO, addDays, fmtDay, todayISO } from '../../course/progress'
import { MasteryChip, TaskRow } from '../../course/ui'
import { updateIwo, useStore } from '../../lib/store'

const PHASE: Record<Day['phase'], string> = {
  learn: 'Подготовка к контесту',
  contest: 'День контеста',
  interview: 'Подготовка к секциям',
  sections: 'Неделя секций',
}

export default function PlanPage() {
  const [sp] = useSearchParams()
  const s = useStore((x) => x)
  const today = todayISO()
  const st = s.iwo.settings
  const [editing, setEditing] = useState(!st)
  const [opened, setOpened] = useState<Set<string>>(new Set())
  const [openAll, setOpenAll] = useState(false)
  const defaultContest = today <= addDays(IWO.contestDeadline, -2) ? addDays(IWO.contestDeadline, -2) : IWO.contestDeadline
  const [form, setForm] = useState({
    contestDate: st?.contestDate ?? defaultContest,
    hours: st?.hours ?? 4,
    start: st?.start ?? today,
    startLevel: (sp.get('zero') ? 'zero' : st?.startLevel ?? 'auto') as 'auto' | 'zero',
  })
  const plan = useMemo(() => buildCoursePlan(s, today), [s, today])

  const dates: string[] = []
  for (let d = today; d <= IWO.contestDeadline; d = addDays(d, 1)) dates.push(d)

  const save = () => {
    updateIwo((x) => ({ ...x, settings: { ...form, start: form.start < today ? today : form.start } }))
    setEditing(false)
  }

  if (editing || !plan) {
    return (
      <div className="container narrow">
        <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'План' }]} />
        <h1>План подготовки по дням</h1>
        {!s.iwo.diag && form.startLevel !== 'zero' && (
          <div className="notice warm mb">
            Диагностика не пройдена — план будет рассчитан как для среднего уровня. Лучше сначала <Link to="/iwo/diagnostic">пройти диагностику</Link> (25–40 минут): курс уберёт то, что вы уже знаете, и добавит теорию там, где пробелы.
          </div>
        )}
        <div className="card stack">
          <div className="grid grid-2">
            <div className="field">
              <label>Когда решаете контест</label>
              <select className="input" value={form.contestDate} onChange={(e) => setForm({ ...form, contestDate: e.target.value })}>
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {fmtDay(d)}
                    {d === IWO.contestDeadline ? ' — последний день' : ''}
                  </option>
                ))}
              </select>
              <span className="tiny faint">Советуем не позже 16 октября: останется запас на сбой и отдых перед секциями.</span>
            </div>
            <div className="field">
              <label>Часов в день</label>
              <select className="input" value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}>
                {[1, 1.5, 2, 3, 4, 5, 6, 8, 10].map((h) => (
                  <option key={h} value={h}>
                    {h} ч
                  </option>
                ))}
              </select>
              <span className="tiny faint">Считайте честно: лучше 3 часа каждый день, чем 8 часов через день.</span>
            </div>
            <div className="field">
              <label>Стартовый уровень</label>
              <select className="input" value={form.startLevel} onChange={(e) => setForm({ ...form, startLevel: e.target.value as 'auto' | 'zero' })}>
                <option value="auto">{s.iwo.diag ? 'По результатам диагностики' : 'Средний (диагностика не пройдена)'}</option>
                <option value="zero">С нуля — все темы полностью</option>
              </select>
            </div>
          </div>
          <div className="row">
            <button className="btn primary" onClick={save}>
              Собрать план
            </button>
            {st && (
              <button className="btn ghost" onClick={() => setEditing(false)}>
                Отмена
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const all = plan.days.flatMap((d) => d.tasks)
  const doneN = all.filter((t) => taskDone(t, s)).length
  const phases = [...new Set(plan.days.map((d) => d.phase))]
  const overdue = plan.days.filter((d) => d.date < today).flatMap((d) => d.tasks.filter((t) => !taskDone(t, s)))

  return (
    <div className="container">
      <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'План' }]} />
      <div className="row between">
        <h1 style={{ margin: 0 }}>План до оффера</h1>
        <button className="btn sm" onClick={() => setEditing(true)}>
          Изменить параметры
        </button>
      </div>
      <p className="muted">
        Контест — {fmtDay(plan.contestDate)}, {st!.hours} ч в день. Выполнено {doneN} из {plural(all.length, 'пункта', 'пунктов', 'пунктов')}. Уроки, свои задачи и задачи контеста отмечаются сами, задачи CodeRun — галочкой после «OK» на сайте Яндекса.
      </p>
      <Progress value={(doneN / Math.max(1, all.length)) * 100} />
      <button className="btn ghost sm mt-s" onClick={() => setOpenAll(!openAll)}>
        {openAll ? 'Свернуть дальние дни' : 'Развернуть все дни'}
      </button>

      <details className="card mt">
        <summary>
          <b>Уровень по темам</b> <span className="small muted">— по нему выбраны теория и задачи</span>
        </summary>
        <div className="grid grid-3 mt-s">
          {modules
            .filter((m) => m.id !== 'start')
            .map((m) => (
              <div key={m.id} className="row between small">
                <Link to={`/iwo/m/${m.id}`}>{m.title}</Link>
                <MasteryChip m={plan.mastery[m.id]} />
              </div>
            ))}
        </div>
      </details>

      {overdue.length > 0 && (
        <div className="notice warm mt">
          За прошедшие дни осталось {plural(overdue.length, 'невыполненный пункт', 'невыполненных пункта', 'невыполненных пунктов')}. Если отстаёте больше чем на два дня — <button className="btn sm" onClick={() => updateIwo((x) => ({ ...x, settings: { ...x.settings!, start: today } }))}>пересобрать план с сегодняшнего дня</button> — выполненное сохранится.
        </div>
      )}

      {phases.map((ph) => (
        <section key={ph} className="section">
          <h2>{PHASE[ph]}</h2>
          <div className="stack">
            {plan.days
              .filter((d) => d.phase === ph)
              .map((d) => {
                const dn = d.tasks.filter((t) => taskDone(t, s)).length
                // на телефоне план из сотни пунктов — это лента на десятки экранов; раскрыты только ближайшие дни и долги
                const near = d.date >= today && d.date <= addDays(today, 2)
                const debt = d.date < today && dn < d.tasks.length
                const open = openAll || near || debt || opened.has(d.date)
                return (
                  <div key={d.date} id={d.date} className={`day ${d.date === today ? 'today' : ''} ${d.date < today ? 'past' : ''}`}>
                    <div className="day-head">
                      <b>
                        {fmtDay(d.date)}
                        {d.date === today ? ' · сегодня' : ''}
                      </b>
                      <span className="tiny faint">
                        {dn}/{d.tasks.length} · ≈ {Math.round(d.minutes / 6) / 10} ч
                      </span>
                    </div>
                    {open ? (
                      <>
                        {d.note && <div className="notice warm mt-s">{d.note}</div>}
                        {d.tasks.map((t) => (
                          <TaskRow key={t.id} t={t} s={s} />
                        ))}
                      </>
                    ) : (
                      <button className="btn ghost sm mt-s" onClick={() => setOpened(new Set(opened).add(d.date))}>
                        Показать {plural(d.tasks.length, 'пункт', 'пункта', 'пунктов')}
                      </button>
                    )}
                  </div>
                )
              })}
          </div>
        </section>
      ))}

      {plan.extra.length > 0 && (
        <section className="section">
          <h2>Если останется время</h2>
          <p className="muted small">Не поместилось в выбранные часы. Сначала — пункты из тем с высоким весом для отбора.</p>
          <details className="card">
            <summary>
              <b>{plural(plan.extra.length, 'пункт', 'пункта', 'пунктов')}</b>
            </summary>
            {plan.extra.map((t) => (
              <TaskRow key={t.id} t={t} s={s} />
            ))}
          </details>
        </section>
      )}
    </div>
  )
}
