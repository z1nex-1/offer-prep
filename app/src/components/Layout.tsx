import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const TRAIN = [
  { to: '/questions', label: 'Вопросы с ответами', hint: 'Карточки с интервальным повторением' },
  { to: '/problems', label: 'Алгоритмы', hint: 'Задачи с автопроверкой на JS и Python' },
  { to: '/sql', label: 'SQL-тренажёр', hint: 'Запросы к настоящей базе прямо в браузере' },
  { to: '/quiz', label: 'Что выведет JS', hint: 'Event loop, this, замыкания' },
  { to: '/cases', label: 'Кейсы', hint: 'Продукт, аналитика, системный дизайн, тестирование' },
  { to: '/behavioral', label: 'Поведенческое интервью', hint: 'Самопрезентация, STAR, вопросы работодателю' },
]

function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('offer.theme') || ''
    } catch {
      return ''
    }
  })
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    else delete document.documentElement.dataset.theme
    try {
      localStorage.setItem('offer.theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])
  const dark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  return (
    <button className="icon-btn" onClick={() => setTheme(dark ? 'light' : 'dark')} title={dark ? 'Светлая тема' : 'Тёмная тема'} aria-label="Сменить тему">
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      )}
    </button>
  )
}

function TrainMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  const active = TRAIN.some((t) => loc.pathname.startsWith(t.to))
  return (
    <div className="nav-drop" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} style={active ? { color: 'var(--text)', background: 'var(--surface-2)' } : undefined} aria-expanded={open}>
        Тренажёры ▾
      </button>
      {open && (
        <div className="nav-menu">
          {TRAIN.map((t) => (
            <Link key={t.to} to={t.to}>
              {t.label}
              <small>{t.hint}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Layout() {
  const [mobile, setMobile] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    setMobile(false)
    window.scrollTo(0, 0)
  }, [loc.pathname])
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" />
            оффер
          </Link>
          <nav className="nav">
            <NavLink to="/companies">Компании</NavLink>
            <NavLink to="/tracks">Направления</NavLink>
            <TrainMenu />
            <NavLink to="/mock">Пробное интервью</NavLink>
            <NavLink to="/guide">Гайд</NavLink>
            <NavLink to="/calendar">Календарь</NavLink>
          </nav>
          <div className="header-right">
            <NavLink to="/plan" className="btn sm primary hide-mobile">
              Мой план
            </NavLink>
            <ThemeToggle />
            <button className="icon-btn burger" onClick={() => setMobile((m) => !m)} aria-label="Меню">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
        <div className={mobile ? 'mobile-nav open' : 'mobile-nav'}>
          <Link to="/plan">Мой план</Link>
          <Link to="/companies">Компании</Link>
          <Link to="/tracks">Направления</Link>
          {TRAIN.map((t) => (
            <Link key={t.to} to={t.to} className="sub">
              {t.label}
            </Link>
          ))}
          <Link to="/mock">Пробное интервью</Link>
          <Link to="/guide">Гайд по подготовке</Link>
          <Link to="/calendar">Календарь наборов</Link>
          <Link to="/progress">Прогресс и данные</Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <b style={{ color: 'var(--text)' }}>оффер</b> — подготовка к стажировкам и собеседованиям в IT.
            <br />
            Данные о компаниях собраны из официальных карьерных страниц и публичных разборов; сроки наборов меняются — сверяйтесь с источниками.
          </div>
          <div className="row" style={{ alignItems: 'start' }}>
            <Link to="/progress">Прогресс и данные</Link>
            <Link to="/about">О проекте</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
