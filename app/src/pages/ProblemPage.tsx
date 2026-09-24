import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CodeEditor } from '../components/CodeEditor'
import { Crumbs, DiffChip, Md } from '../components/ui'
import { companyById } from '../data/companies'
import { problems } from '../data/problems'
import { runCode, warmPython, type RunResult } from '../lib/runner'
import { update, useStore } from '../lib/store'
import type { Problem } from '../types'

type Lang = 'js' | 'py'

function starter(p: Problem, lang: Lang) {
  if (lang === 'js') return p.starter?.js ?? `function ${p.fn}(${p.params.join(', ')}) {\n    \n}\n`
  return p.starter?.py ?? `def ${p.fn}(${p.params.join(', ')}):\n    pass\n`
}

export default function ProblemPage() {
  const { id = '' } = useParams()
  const idx = problems.findIndex((p) => p.id === id)
  const p = problems[idx]
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('offer.lang') as Lang) || 'py'
    } catch {
      return 'py'
    }
  })
  const saved = useStore((s) => s.code[`${id}:${lang}`])
  const solved = useStore((s) => s.problems[id])
  const [code, setCode] = useState('')
  const [tab, setTab] = useState<'task' | 'hints' | 'solution'>('task')
  const [hintsShown, setHintsShown] = useState(0)
  const [result, setResult] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [pyState, setPyState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    if (!p) return
    setCode(saved ?? starter(p, lang))
    setResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, lang])

  useEffect(() => {
    try {
      localStorage.setItem('offer.lang', lang)
    } catch {
      /* ignore */
    }
    if (lang === 'py' && pyState === 'idle') {
      setPyState('loading')
      warmPython((ok) => setPyState(ok ? 'ready' : 'error'))
    }
  }, [lang, pyState])

  if (!p) return <div className="container empty">Задача не найдена. <Link to="/problems">Все задачи</Link></div>

  const onChange = (v: string) => {
    setCode(v)
    update((s) => ({ ...s, code: { ...s.code, [`${id}:${lang}`]: v } }))
  }

  const run = async () => {
    setRunning(true)
    setResult(null)
    const r = await runCode(lang, code, p)
    setRunning(false)
    setResult(r)
    if (r.ok && r.results.length && r.results.every((x) => x.pass)) {
      update((s) => ({ ...s, problems: { ...s.problems, [p.id]: { at: Date.now(), lang } } }))
    }
  }

  const passed = result?.results.filter((r) => r.pass).length ?? 0
  const next = problems[idx + 1]

  return (
    <div className="container">
      <Crumbs items={[{ to: '/problems', label: 'Алгоритмы' }, { label: p.pattern }]} />
      <div className="split">
        <div className="card">
          <div className="row between">
            <h2 style={{ margin: 0 }}>{p.title}</h2>
            {solved && <span className="chip easy">✓ Решено</span>}
          </div>
          <div className="row mt-s">
            <DiffChip d={p.difficulty} />
            <span className="chip">{p.pattern}</span>
            {p.companies?.map((c) => companyById[c] && <span key={c} className="chip">{companyById[c].name}</span>)}
          </div>
          <div className="tabs mt">
            <button className={tab === 'task' ? 'on' : ''} onClick={() => setTab('task')}>
              Условие
            </button>
            <button className={tab === 'hints' ? 'on' : ''} onClick={() => setTab('hints')}>
              Подсказки ({p.hints.length})
            </button>
            <button className={tab === 'solution' ? 'on' : ''} onClick={() => setTab('solution')}>
              Разбор
            </button>
          </div>
          {tab === 'task' && (
            <>
              <Md text={p.statement} />
              <h4 className="mt">Примеры</h4>
              {p.tests.slice(0, 3).map((t, i) => (
                <div key={i} className="result" style={{ marginBottom: 6 }}>
                  {p.fn}({t.args.map((a) => JSON.stringify(a)).join(', ')}) → {JSON.stringify(t.expected)}
                </div>
              ))}
            </>
          )}
          {tab === 'hints' && (
            <div className="stack">
              {p.hints.slice(0, hintsShown).map((h, i) => (
                <div key={i} className="notice">
                  <b>Подсказка {i + 1}.</b> {h}
                </div>
              ))}
              {hintsShown < p.hints.length && (
                <button className="btn" onClick={() => setHintsShown((n) => n + 1)} style={{ justifySelf: 'start' }}>
                  Открыть подсказку {hintsShown + 1}
                </button>
              )}
            </div>
          )}
          {tab === 'solution' && <Solution p={p} solved={!!solved} />}
        </div>

        <div className="sticky">
          <div className="editor">
            <div className="editor-bar">
              <div className="chips">
                <button className={lang === 'py' ? 'chip on' : 'chip'} onClick={() => setLang('py')}>
                  Python
                </button>
                <button className={lang === 'js' ? 'chip on' : 'chip'} onClick={() => setLang('js')}>
                  JavaScript
                </button>
                {lang === 'py' && pyState === 'loading' && <span className="tiny faint" style={{ alignSelf: 'center' }}>загружаем Python…</span>}
                {lang === 'py' && pyState === 'error' && <span className="tiny" style={{ alignSelf: 'center', color: 'var(--bad)' }}>Python не загрузился — проверьте интернет</span>}
              </div>
              <div className="row" style={{ gap: 6 }}>
                <button className="btn sm ghost" onClick={() => onChange(starter(p, lang))} title="Вернуть заготовку">
                  Сброс
                </button>
                <button className="btn sm primary" onClick={run} disabled={running}>
                  {running ? 'Проверяем…' : 'Запустить тесты'}
                </button>
              </div>
            </div>
            <CodeEditor value={code} onChange={onChange} lang={lang} onRun={run} minHeight={320} />
          </div>
          <div className="tiny faint mt-s">
            <span className="kbd">Ctrl</span> + <span className="kbd">Enter</span> — запустить. Код сохраняется автоматически.
          </div>
          {result && (
            <div className="results">
              {!result.ok && <div className="result fail">{result.error}</div>}
              {result.ok && (
                <div className={passed === result.results.length ? 'notice ok' : 'notice bad'}>
                  <b>
                    Пройдено {passed} из {result.results.length}
                  </b>
                  {passed === result.results.length && next && (
                    <>
                      {' '}
                      · <Link to={`/problems/${next.id}`}>Следующая задача →</Link>
                    </>
                  )}
                </div>
              )}
              {result.results.map((r, i) => (
                <div key={i} className={r.pass ? 'result pass' : 'result fail'}>
                  {r.pass ? '✓' : '✗'} Тест {i + 1} · {r.ms.toFixed(1)} мс
                  {!r.pass && (
                    <>
                      {'\n'}Вход: {r.args}
                      {'\n'}Ожидали: {r.expected}
                      {'\n'}
                      {r.error ? `Ошибка: ${r.error}` : `Получили: ${r.got}`}
                    </>
                  )}
                </div>
              ))}
              {result.logs.length > 0 && (
                <div className="result">
                  <b>Вывод print / console.log:</b>
                  {'\n'}
                  {result.logs.join('\n')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Solution({ p, solved }: { p: Problem; solved: boolean }) {
  const [open, setOpen] = useState(solved)
  const [lang, setLang] = useState<'py' | 'js'>('py')
  if (!open)
    return (
      <div className="stack">
        <p className="muted">Разбор лучше открывать после собственной попытки: так задача запомнится как решённая, а не прочитанная.</p>
        <button className="btn" onClick={() => setOpen(true)} style={{ justifySelf: 'start' }}>
          Всё равно показать разбор
        </button>
      </div>
    )
  return (
    <div className="stack">
      <Md text={p.explanation} />
      <div className="chips">
        <button className={lang === 'py' ? 'chip on' : 'chip'} onClick={() => setLang('py')}>
          Python
        </button>
        <button className={lang === 'js' ? 'chip on' : 'chip'} onClick={() => setLang('js')}>
          JavaScript
        </button>
      </div>
      <Md text={'```\n' + (lang === 'py' ? p.solution.py : p.solution.js) + '\n```'} />
    </div>
  )
}
