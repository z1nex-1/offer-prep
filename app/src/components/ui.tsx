import { marked } from 'marked'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Company, Link as LinkT } from '../types'

marked.setOptions({ gfm: true, breaks: false })

export function Md({ text, compact }: { text: string; compact?: boolean }) {
  const html = useMemo(() => marked.parse(text) as string, [text])
  return <div className={compact ? 'md compact' : 'md'} dangerouslySetInnerHTML={{ __html: html }} />
}

export function CompanyBadge({ c, lg }: { c: Pick<Company, 'color' | 'short' | 'name'>; lg?: boolean }) {
  const dark = ['#ffdd2d', '#f5c400', '#fbbf24'].includes(c.color)
  return (
    <span className={lg ? 'badge-logo lg' : 'badge-logo'} style={{ background: c.color, color: dark ? '#1a1a1a' : '#fff' }} aria-label={c.name}>
      {c.short}
    </span>
  )
}

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
export const MONTHS_FULL = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

export function Months({ on }: { on: number[] }) {
  const now = new Date().getMonth() + 1
  return (
    <div className="months" title="Месяцы, когда обычно идёт набор">
      {MONTHS.map((m, i) => (
        <span key={m} className={`${on.includes(i + 1) ? 'on' : ''} ${now === i + 1 ? 'now' : ''}`}>
          {m.slice(0, 1).toUpperCase()}
        </span>
      ))}
    </div>
  )
}

export function Progress({ value, ok }: { value: number; ok?: boolean }) {
  return (
    <div className={ok ? 'progress ok' : 'progress'}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Ring({ value, label }: { value: number; label?: string }) {
  return (
    <div className="ring" style={{ ['--p' as string]: Math.round(value) }}>
      <span>{label ?? `${Math.round(value)}%`}</span>
    </div>
  )
}

export function Check({ on, onClick, title }: { on: boolean; onClick: () => void; title?: string }) {
  return (
    <button type="button" className={on ? 'checkbox on' : 'checkbox'} onClick={onClick} title={title} aria-pressed={on}>
      {on ? '✓' : ''}
    </button>
  )
}

const LEVEL: Record<string, string> = { base: 'База', core: 'Основное', plus: 'Продвинутое' }
export function LevelChip({ level }: { level: string }) {
  return <span className="chip">{LEVEL[level] ?? level}</span>
}

const DIFF: Record<string, string> = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' }
export function DiffChip({ d }: { d: string }) {
  return <span className={`chip ${d}`}>{DIFF[d]}</span>
}

const KIND: Record<string, string> = {
  book: 'Книга',
  course: 'Курс',
  article: 'Статья',
  video: 'Видео',
  practice: 'Практика',
  official: 'Официально',
  docs: 'Документация',
}
export function Resources({ items }: { items: LinkT[] }) {
  if (!items.length) return null
  return (
    <div className="list">
      {items.map((r) => (
        <div key={r.url + r.title} className="row between">
          <a href={r.url} target="_blank" rel="noreferrer">
            {r.title}
          </a>
          {r.kind && <span className={r.kind === 'official' ? 'chip official' : 'chip'}>{KIND[r.kind]}</span>}
        </div>
      ))}
    </div>
  )
}

export function Reveal({ label = 'Показать ответ', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <button className="btn sm" onClick={() => setOpen(true)}>
        {label}
      </button>
    )
  return <>{children}</>
}

export function Crumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav className="breadcrumbs">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span> / </span>}
        </span>
      ))}
    </nav>
  )
}

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return `${n} ${one}`
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} ${few}`
  return `${n} ${many}`
}

export function useCountdown(seconds: number) {
  const [startAt, setStartAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (startAt === null) return
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [startAt])
  const elapsed = startAt === null ? 0 : Math.floor((now - startAt) / 1000)
  return {
    left: seconds - elapsed,
    running: startAt !== null,
    start: () => {
      setNow(Date.now())
      setStartAt(Date.now())
    },
    stop: () => setStartAt(null),
  }
}

export function fmtTime(s: number) {
  const sign = s < 0 ? '−' : ''
  const a = Math.abs(s)
  const m = Math.floor(a / 60)
  const sec = a % 60
  return `${sign}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
