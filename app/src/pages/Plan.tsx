import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, CompanyBadge, Progress, plural } from '../components/ui'
import { companies, companyById } from '../data/companies'
import { trackById, tracks } from '../data/tracks'
import { buildPlan, itemDone, type PlanKind } from '../lib/plan'
import { togglePlanItem, update, useStore, type PlanSettings } from '../lib/store'
import type { TrackId } from '../types'

const KIND_LABEL: Record<PlanKind, string> = {
  setup: 'Подготовка',
  topic: 'Теория',
  problems: 'Алгоритмы',
  sql: 'SQL',
  quiz: 'JS-квиз',
  case: 'Кейс',
  review: 'Повторение',
  mock: 'Мок',
  contest: 'Репетиция',
}

const WEEK = 7 * 86400000

export default function Plan() {
  const [sp] = useSearchParams()
  const saved = useStore((s) => s.plan)
  const state = useStore((s) => s)
  const fromUrl = sp.get('track')
  const [editing, setEditing] = useState(!saved || !!fromUrl)
  const [form, setForm] = useState<PlanSettings>(() => ({
    track: (fromUrl as TrackId) || saved?.track || state.profile.track || 'backend',
    stack: sp.get('stack') || saved?.stack || state.profile.stack || trackById[(fromUrl as TrackId) || saved?.track || 'backend']?.stacks?.[0]?.id,
    company: sp.get('company') ?? saved?.company ?? state.profile.company,
    weeks: saved?.weeks ?? 8,
    hours: saved?.hours ?? 10,
    level: saved?.level ?? 'base',
    start: Date.now(),
  }))

  const plan = useMemo(() => (saved ? buildPlan(saved) : null), [saved])

  const save = () => {
    const t = trackById[form.track]
    const s: PlanSettings = { ...form, stack: t.stacks ? form.stack ?? t.stacks[0].id : undefined, start: Date.now() }
    update((st) => ({ ...st, plan: s, profile: { track: s.track, stack: s.stack, company: s.company } }))
    setEditing(false)
  }

  const track = trackById[form.track]

  return (
    <div className="container">
      <h1>Мой план подготовки</h1>
      {editing || !saved || !plan ? (
        <div className="card" style={{ maxWidth: 900 }}>
          <p className="muted" style={{ marginTop: 0 }}>
            План собирается из тем направления, практики и пробных интервью. Он учитывает срок, сколько часов в неделю вы готовы уделять и ваш стартовый уровень. Прогресс хранится в этом браузере.
          </p>
          <div className="grid grid-2">
            <div className="field">
              <label>Направление</label>
              <select className="input" value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value as TrackId, stack: trackById[e.target.value]?.stacks?.[0]?.id })}>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            {track?.stacks ? (
              <div className="field">
                <label>Основной язык</label>
                <select className="input" value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })}>
                  {track.stacks.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div />
            )}
            <div className="field">
              <label>Целевая компания</label>
              <select className="input" value={form.company ?? ''} onChange={(e) => setForm({ ...form, company: e.target.value || undefined })}>
                <option value="">Без привязки к компании</option>
                {companies
                  .filter((c) => c.tracks.some((t) => t.track === form.track))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="field">
              <label>Стартовый уровень</label>
              <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as PlanSettings['level'] })}>
                <option value="zero">С нуля: многое впервые</option>
                <option value="base">База есть: учил, но подзабыл</option>
                <option value="strong">Уверенно: нужно освежить и потренироваться</option>
              </select>
            </div>
            <div className="field">
              <label>Срок до отбора: {plural(form.weeks, 'неделя', 'недели', 'недель')}</label>
              <input type="range" min={2} max={24} value={form.weeks} onChange={(e) => setForm({ ...form, weeks: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label>Часов в неделю: {form.hours}</label>
              <input type="range" min={3} max={40} value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} />
            </div>
          </div>
          <div className="row mt">
            <button className="btn primary" onClick={save}>
              {saved ? 'Пересобрать план' : 'Собрать план'}
            </button>
            {saved && (
              <button className="btn ghost" onClick={() => setEditing(false)}>
                Отмена
              </button>
            )}
          </div>
          {saved && <p className="tiny faint mt-s">Отметки о выполненном сохранятся: темы и задачи засчитываются автоматически.</p>}
        </div>
      ) : (
        <PlanView plan={plan} settings={saved} onEdit={() => setEditing(true)} />
      )}
    </div>
  )
}

function PlanView({ plan, settings, onEdit }: { plan: NonNullable<ReturnType<typeof buildPlan>>; settings: PlanSettings; onEdit: () => void }) {
  const state = useStore((s) => s)
  const track = trackById[settings.track]
  const company = settings.company ? companyById[settings.company] : undefined
  const all = plan.weeks.flatMap((w) => w.items)
  const doneCount = all.filter((i) => itemDone(i, state)).length
  const doneMin = all.filter((i) => itemDone(i, state)).reduce((m, i) => m + i.minutes, 0)
  const totalMin = all.reduce((m, i) => m + i.minutes, 0)
  const currentWeek = Math.min(plan.weeks.length, Math.floor((Date.now() - settings.start) / WEEK) + 1)
  const [open, setOpen] = useState<number | null>(null)
  const firstUnfinished = plan.weeks.find((w) => w.items.some((i) => !itemDone(i, state)))?.n ?? currentWeek
  const shown = open ?? firstUnfinished
  const nextItem = all.find((i) => !itemDone(i, state))

  return (
    <>
      <div className="grid grid-3">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="row">
            {company && <CompanyBadge c={company} />}
            <div>
              <h3 style={{ margin: 0 }}>
                {track.name}
                {settings.stack ? ` · ${track.stacks?.find((s) => s.id === settings.stack)?.name}` : ''}
              </h3>
              <div className="small muted">
                {company ? `Цель: ${company.name}` : 'Общая подготовка'} · {plural(settings.weeks, 'неделя', 'недели', 'недель')} по {settings.hours} ч · сейчас неделя {currentWeek}
              </div>
            </div>
          </div>
          <div className="mt">
            <div className="row between small">
              <span>
                Выполнено {doneCount} из {all.length}
              </span>
              <span className="muted">
                {Math.round(doneMin / 60)} из {Math.round(totalMin / 60)} ч
              </span>
            </div>
            <Progress value={all.length ? (doneMin / totalMin) * 100 : 0} ok />
          </div>
          <div className="row mt">
            <button className="btn sm" onClick={onEdit}>
              Изменить параметры
            </button>
            {company && (
              <Link className="btn sm ghost" to={`/companies/${company.id}?track=${track.id}`}>
                Отбор в {company.name}
              </Link>
            )}
          </div>
        </div>
        <div className="card stack">
          <div className="eyebrow">Следующий шаг</div>
          {nextItem ? (
            <>
              <b style={{ fontSize: 17 }}>{nextItem.title}</b>
              <span className="small muted">{nextItem.detail}</span>
              <span className="chip" style={{ justifySelf: 'start' }}>
                {KIND_LABEL[nextItem.kind]} · {nextItem.minutes} мин
              </span>
              {nextItem.to.startsWith('http') ? (
                <a className="btn primary" href={nextItem.to} target="_blank" rel="noreferrer">
                  Открыть
                </a>
              ) : (
                <Link className="btn primary" to={nextItem.to}>
                  Начать
                </Link>
              )}
            </>
          ) : (
            <b>План выполнен. Пора подавать заявку!</b>
          )}
        </div>
      </div>

      {plan.dropped.length > 0 && (
        <div className="notice warm mt small">
          Не поместилось в срок: {plan.dropped.filter((d) => !d.optional).length} обязательных и {plan.dropped.filter((d) => d.optional).length} дополнительных пунктов (≈ {Math.round(plan.dropped.reduce((m, d) => m + d.minutes, 0) / 60)} ч). Увеличьте срок или часы в неделю — или сознательно пропустите продвинутые темы.
        </div>
      )}

      <div className="grid grid-4 mt">
        {plan.weeks.map((w) => {
          const d = w.items.filter((i) => itemDone(i, state)).length
          return (
            <button key={w.n} className="card card-link" style={{ textAlign: 'left', cursor: 'pointer', borderColor: shown === w.n ? 'var(--accent)' : undefined, padding: 14 }} onClick={() => setOpen(w.n)}>
              <div className="row between">
                <b>Неделя {w.n}</b>
                {w.n === currentWeek && <span className="chip on">сейчас</span>}
              </div>
              <div className="tiny faint" style={{ minHeight: 34 }}>
                {w.focus}
              </div>
              <Progress value={w.items.length ? (d / w.items.length) * 100 : 0} ok={d === w.items.length} />
              <div className="tiny faint mt-s">
                {d}/{w.items.length} · {Math.round(w.minutes / 60)} ч
              </div>
            </button>
          )
        })}
      </div>

      {plan.weeks
        .filter((w) => w.n === shown)
        .map((w) => (
          <div key={w.n} className="card mt">
            <div className="row between">
              <h3 style={{ margin: 0 }}>
                Неделя {w.n}: {w.focus}
              </h3>
              <span className="small muted">≈ {Math.round(w.minutes / 60)} ч</span>
            </div>
            <div className="list mt-s">
              {w.items.map((it) => {
                const done = itemDone(it, state)
                return (
                  <div key={it.id} className="topic-row">
                    <Check on={done} onClick={() => togglePlanItem(it.id)} />
                    <div style={{ minWidth: 0 }}>
                      {it.to.startsWith('http') ? (
                        <a href={it.to} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>
                          {it.title}
                        </a>
                      ) : (
                        <Link to={it.to} style={{ fontWeight: 700, color: done ? 'var(--faint)' : 'var(--text)', textDecoration: done ? 'line-through' : undefined }}>
                          {it.title}
                        </Link>
                      )}
                      {it.detail && <div className="tiny faint">{it.detail}</div>}
                    </div>
                    <span className="meta">
                      {it.optional && <span className="chip hide-mobile">доп.</span>}
                      <span className="chip">{KIND_LABEL[it.kind]}</span>
                      <span className="tiny faint" style={{ minWidth: 48, textAlign: 'right' }}>
                        {it.minutes} мин
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </>
  )
}
