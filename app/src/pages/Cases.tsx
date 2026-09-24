import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Crumbs, fmtTime, Md, useCountdown } from '../components/ui'
import { cases } from '../data/cases'
import { companyById } from '../data/companies'
import { trackById, tracks } from '../data/tracks'
import { update, useStore } from '../lib/store'
import type { CaseType } from '../types'

export const CASE_TYPES: Record<CaseType, string> = {
  product: 'Продуктовый',
  analytics: 'Аналитический',
  'system-design': 'Системный дизайн',
  'ml-design': 'ML System Design',
  testing: 'Тестирование',
  project: 'Управление проектом',
  design: 'Дизайн',
  security: 'Безопасность',
  incident: 'Инцидент',
  estimation: 'Оценка рынка',
  requirements: 'Требования',
}

export default function Cases() {
  const { id } = useParams()
  return id ? <CasePage id={id} /> : <CaseList />
}

function CaseList() {
  const [sp, setSp] = useSearchParams()
  const done = useStore((s) => s.cases)
  const track = sp.get('track') ?? ''
  const type = sp.get('type') ?? ''
  const list = cases.filter((c) => (!track || c.tracks.includes(track as never)) && (!type || c.type === type))
  const types = [...new Set(cases.map((c) => c.type))]
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp)
    if (v) n.set(k, v)
    else n.delete(k)
    setSp(n, { replace: true })
  }
  return (
    <div className="container">
      <h1>Кейсы</h1>
      <p className="lead muted" style={{ maxWidth: 780 }}>
        Устные задачи, из которых состоят продуктовые, аналитические, архитектурные и QA-секции. Засеките время, запишите решение, затем сравните с эталонной структурой и критериями оценки.
      </p>
      <div className="card flat mb stack">
        <div className="chips">
          <button className={track === '' ? 'chip on' : 'chip'} onClick={() => set('track', '')}>
            Все направления
          </button>
          {tracks
            .filter((t) => cases.some((c) => c.tracks.includes(t.id)))
            .map((t) => (
              <button key={t.id} className={track === t.id ? 'chip on' : 'chip'} onClick={() => set('track', t.id)}>
                {t.short}
              </button>
            ))}
        </div>
        <div className="chips">
          <button className={type === '' ? 'chip on' : 'chip'} onClick={() => set('type', '')}>
            Все типы
          </button>
          {types.map((t) => (
            <button key={t} className={type === t ? 'chip on' : 'chip'} onClick={() => set('type', t)}>
              {CASE_TYPES[t]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-3">
        {list.map((c) => (
          <Link key={c.id} to={`/cases/${c.id}`} className="card card-link stack">
            <div className="row between">
              <span className="chip">{CASE_TYPES[c.type]}</span>
              <span className="tiny faint">{done[c.id] ? '✓ разобран' : `${c.minutes} мин`}</span>
            </div>
            <b style={{ fontSize: 17 }}>{c.title}</b>
            <p className="small muted" style={{ margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {c.prompt.replace(/[#*`]/g, '')}
            </p>
            <div className="tiny faint">{c.tracks.map((t) => trackById[t]?.short).join(' · ')}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CasePage({ id }: { id: string }) {
  const c = cases.find((x) => x.id === id)
  const note = useStore((s) => s.notes[`case:${id}`] ?? '')
  const done = useStore((s) => s.cases[id])
  const timer = useCountdown((c?.minutes ?? 20) * 60)
  const [stage, setStage] = useState<'solve' | 'check'>('solve')
  const [checks, setChecks] = useState<Record<number, boolean>>({})
  useEffect(() => {
    setStage('solve')
    setChecks({})
  }, [id])
  if (!c) return <div className="container empty">Кейс не найден.</div>
  const setNote = (v: string) => update((s) => ({ ...s, notes: { ...s.notes, [`case:${id}`]: v } }))
  const score = Object.values(checks).filter(Boolean).length

  return (
    <div className="container narrow">
      <Crumbs items={[{ to: '/cases', label: 'Кейсы' }, { label: CASE_TYPES[c.type] }]} />
      <div className="row between">
        <h1 style={{ margin: 0 }}>{c.title}</h1>
        <div className="row">
          <span className={timer.left < 60 && timer.running ? 'timer low' : 'timer'}>{fmtTime(timer.running ? timer.left : c.minutes * 60)}</span>
          {!timer.running ? (
            <button className="btn primary sm" onClick={timer.start}>
              Старт
            </button>
          ) : (
            <button className="btn sm" onClick={timer.stop}>
              Стоп
            </button>
          )}
        </div>
      </div>
      <div className="row mt-s">
        <span className="chip">{CASE_TYPES[c.type]}</span>
        {c.tracks.map((t) => (
          <span key={t} className="chip">
            {trackById[t]?.short}
          </span>
        ))}
        {c.companies?.map((x) => companyById[x] && <span key={x} className="chip">{companyById[x].name}</span>)}
      </div>

      <div className="card mt">
        <Md text={c.prompt} />
      </div>

      <div className="card mt">
        <h3>Ваше решение</h3>
        <p className="small muted">Пишите тезисами, как проговаривали бы вслух. Заметки сохраняются.</p>
        <textarea className="input" style={{ minHeight: 220 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="1. Уточняющие вопросы… 2. Структура… 3. Решение… 4. Метрики и риски…" />
        {stage === 'solve' && (
          <button className="btn primary mt-s" onClick={() => (setStage('check'), timer.stop())}>
            Сравнить с эталоном
          </button>
        )}
      </div>

      {stage === 'check' && (
        <>
          <div className="grid grid-2 mt">
            <div className="card">
              <h3>Что стоило уточнить</h3>
              <ul className="small" style={{ paddingLeft: 18, margin: 0 }}>
                {c.clarify.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>Структура ответа</h3>
              <ol className="small" style={{ paddingLeft: 18, margin: 0 }}>
                {c.plan.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="card mt">
            <h3>Эталонный разбор</h3>
            <Md text={c.answer} />
          </div>
          <div className="card mt">
            <h3>Самопроверка</h3>
            <p className="small muted">Отметьте, что было в вашем ответе. Так оценивают интервьюеры.</p>
            <div className="list">
              {c.rubric.map((r, i) => (
                <label key={i} className="row" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!checks[i]} onChange={(e) => setChecks((s) => ({ ...s, [i]: e.target.checked }))} />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <div className="row between mt">
              <b>
                {score} из {c.rubric.length}
              </b>
              <button className={done ? 'btn ok' : 'btn primary'} onClick={() => update((s) => ({ ...s, cases: { ...s.cases, [c.id]: score / Math.max(1, c.rubric.length) } }))}>
                {done !== undefined ? 'Сохранено — обновить' : 'Сохранить результат'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
