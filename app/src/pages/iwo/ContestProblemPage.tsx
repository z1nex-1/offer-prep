import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CodeEditor } from '../../components/CodeEditor'
import { Crumbs, DiffChip, Md } from '../../components/ui'
import { contestById, contestProblems, loadContestTests } from '../../course/content'
import { moduleById } from '../../course/modules'
import { runProgram, sameOutput, warmPython } from '../../lib/runner'
import { toggleIn, update, useStore } from '../../lib/store'

const STARTER = `import sys


def main():
    data = sys.stdin.read().split()
    # ваше решение


main()
`

type Verdict = { kind: 'OK' | 'WA' | 'RE' | 'TL' | 'CE'; test?: number; msg?: string; ms?: number; got?: string; input?: string; want?: string; sample?: boolean }

export function IoBox({ input, output, label }: { input: string; output?: string; label?: string }) {
  return (
    <div className="io mb">
      <div>
        <div className="lbl">{label ?? 'Ввод'}</div>
        <pre>{input.length > 4000 ? input.slice(0, 4000) + '\n…' : input}</pre>
      </div>
      {output !== undefined && (
        <div>
          <div className="lbl">Вывод</div>
          <pre>{output.length > 4000 ? output.slice(0, 4000) + '\n…' : output}</pre>
        </div>
      )}
    </div>
  )
}

export default function ContestProblemPage({ virtual, pid }: { virtual?: boolean; pid?: string }) {
  const params = useParams()
  const id = pid ?? params.id ?? ''
  const p = contestById[id]
  const saved = useStore((s) => s.code[`contest:${id}`])
  const solved = useStore((s) => !!s.iwo.contest[id])
  const [code, setCode] = useState('')
  const [tab, setTab] = useState<'task' | 'hints' | 'solution'>('task')
  const [hints, setHints] = useState(0)
  const [busy, setBusy] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [custom, setCustom] = useState('')
  const [customOut, setCustomOut] = useState<{ out: string; err?: string; ms?: number } | null>(null)
  const [showTest, setShowTest] = useState(false)
  const [py, setPy] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    warmPython((ok) => setPy(ok ? 'ready' : 'error'))
  }, [])
  useEffect(() => {
    if (!p) return
    setCode(saved ?? STARTER)
    setVerdict(null)
    setCustom(p.samples[0]?.in ?? '')
    setCustomOut(null)
    setTab('task')
    setHints(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!p) return <div className="container empty">Задача не найдена. <Link to="/iwo/contest">Все задачи</Link></div>

  const onChange = (v: string) => {
    setCode(v)
    update((s) => ({ ...s, code: { ...s.code, [`contest:${id}`]: v } }))
  }

  const judge = async (onlySamples: boolean) => {
    let tests = p.samples
    if (!onlySamples) {
      setBusy('Загружаем тесты')
      try {
        tests = await loadContestTests(p.id)
      } catch {
        setBusy(null)
        return setVerdict({ kind: 'CE', msg: 'Не удалось загрузить тесты — проверьте интернет и попробуйте ещё раз.' })
      }
    }
    setBusy('Проверяем: 0 из ' + tests.length)
    setVerdict(null)
    setShowTest(false)
    const r = await runProgram(
      code,
      tests.map((t) => t.in),
      (n) => setBusy(`Проверяем: ${n} из ${tests.length}`),
    )
    setBusy(null)
    if (r.fatal) return setVerdict({ kind: 'CE', msg: r.fatal })
    let maxMs = 0
    for (let i = 0; i < tests.length; i++) {
      const run = r.runs[i]
      const sample = i < p.samples.length
      if (!run) return setVerdict({ kind: 'TL', test: i + 1, input: tests[i].in, want: tests[i].out, sample })
      maxMs = Math.max(maxMs, run.ms)
      if (run.err) {
        const ce = /SyntaxError|IndentationError/.test(run.err)
        return setVerdict({ kind: ce ? 'CE' : 'RE', test: i + 1, msg: run.err, input: tests[i].in, want: tests[i].out, got: run.out, sample })
      }
      if (!sameOutput(run.out, tests[i].out, p.float)) return setVerdict({ kind: 'WA', test: i + 1, input: tests[i].in, want: tests[i].out, got: run.out, sample })
    }
    setVerdict({ kind: 'OK', ms: maxMs, msg: onlySamples ? 'Примеры проходят. Теперь отправьте на все тесты.' : undefined })
    if (!onlySamples) toggleIn('contest', p.id, true)
  }

  const runCustom = async () => {
    setBusy('Запускаем')
    const r = await runProgram(code, [custom])
    setBusy(null)
    if (r.fatal) return setCustomOut({ out: '', err: r.fatal })
    if (!r.runs[0]) return setCustomOut({ out: '', err: 'Превышено время выполнения' })
    setCustomOut(r.runs[0])
  }

  const idx = contestProblems.findIndex((x) => x.id === p.id)
  const next = contestProblems[idx + 1]
  const VERDICT_TEXT = { OK: 'OK — все тесты пройдены', WA: 'WA — неправильный ответ', RE: 'RE — ошибка во время выполнения', TL: 'TL — превышено время', CE: 'CE — ошибка компиляции' }

  return (
    <div className={virtual ? '' : 'container'}>
      {!virtual && <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { to: '/iwo/contest', label: 'Контест' }, { label: moduleById[p.module]?.title ?? '' }]} />}
      <div className="split">
        <div className="card">
          <div className="row between">
            <h2 style={{ margin: 0 }}>{p.title}</h2>
            {solved && <span className="chip easy">✓ OK</span>}
          </div>
          <div className="row mt-s">
            <DiffChip d={p.difficulty} />
            <span className="chip">{moduleById[p.module]?.title}</span>
            <span className="chip wrap">Ограничение времени: 1 с на тест (в Яндекс Контесте)</span>
          </div>
          {!virtual && (
            <div className="tabs mt">
              <button className={tab === 'task' ? 'on' : ''} onClick={() => setTab('task')}>
                Условие
              </button>
              {p.hints.length > 0 && (
                <button className={tab === 'hints' ? 'on' : ''} onClick={() => setTab('hints')}>
                  Подсказки ({p.hints.length})
                </button>
              )}
              <button className={tab === 'solution' ? 'on' : ''} onClick={() => setTab('solution')}>
                Разбор
              </button>
            </div>
          )}
          {(tab === 'task' || virtual) && (
            <>
              <Md text={p.statement} />
              <h4 className="mt">Примеры</h4>
              {p.samples.map((t, i) => (
                <IoBox key={i} input={t.in} output={t.out} />
              ))}
            </>
          )}
          {tab === 'hints' && !virtual && (
            <div className="stack">
              {p.hints.slice(0, hints).map((h, i) => (
                <div key={i} className="notice">
                  <b>Подсказка {i + 1}.</b> <Md text={h} compact />
                </div>
              ))}
              {hints < p.hints.length && (
                <button className="btn" style={{ justifySelf: 'start' }} onClick={() => setHints((n) => n + 1)}>
                  Открыть подсказку {hints + 1}
                </button>
              )}
            </div>
          )}
          {tab === 'solution' && !virtual && <SolutionTab explanation={p.explanation} code={p.solution} solved={solved} />}
        </div>

        <div className="sticky">
          <div className="editor">
            <div className="editor-bar">
              <div className="row" style={{ gap: 8 }}>
                <span className="chip on">Python 3</span>
                {py === 'loading' && <span className="tiny faint">загружаем Python…</span>}
                {py === 'error' && <span className="tiny" style={{ color: 'var(--bad)' }}>Python не загрузился — проверьте интернет</span>}
              </div>
              <div className="row" style={{ gap: 6 }}>
                <button className="btn sm" onClick={() => judge(true)} disabled={!!busy}>
                  Примеры
                </button>
                <button className="btn sm primary" onClick={() => judge(false)} disabled={!!busy}>
                  Отправить
                </button>
              </div>
            </div>
            <CodeEditor value={code} onChange={onChange} lang="py" onRun={() => judge(false)} minHeight={340} />
          </div>
          <div className="tiny faint mt-s">
            <span className="kbd">Ctrl</span> + <span className="kbd">Enter</span> — отправить на все тесты. Программа читает stdin и пишет в stdout, как в Яндекс Контесте.
          </div>
          {busy && <div className="notice mt-s">{busy}…</div>}
          {verdict && (
            <div className="results">
              <div className={verdict.kind === 'OK' ? 'notice ok' : 'notice bad'}>
                <b>
                  {VERDICT_TEXT[verdict.kind]}
                  {verdict.test ? ` на тесте ${verdict.test}` : ''}
                </b>
                {verdict.kind === 'OK' && verdict.ms !== undefined && <span className="small"> · максимум {Math.round(verdict.ms)} мс на тест в браузере</span>}
                {verdict.msg && <div className="small mt-s" style={{ whiteSpace: 'pre-wrap' }}>{verdict.msg}</div>}
                {verdict.kind === 'OK' && !verdict.msg && next && !virtual && (
                  <>
                    {' '}
                    · <Link to={`/iwo/contest/${next.id}`}>Следующая задача →</Link>
                  </>
                )}
                {verdict.kind === 'TL' && <div className="small mt-s">Решение не уложилось в 6 секунд. Скорее всего, асимптотика хуже нужной или бесконечный цикл. Python в браузере в 2–4 раза медленнее, чем в Контесте, но квадрат на 10⁵ элементах не пройдёт нигде.</div>}
              </div>
              {verdict.input !== undefined && (verdict.sample || showTest) && <IoBox input={verdict.input} output={verdict.want} label={`Тест ${verdict.test}`} />}
              {verdict.got !== undefined && (verdict.sample || showTest) && (
                <div>
                  <div className="lbl tiny faint">Ваш вывод</div>
                  <pre className="result">{verdict.got || '(пусто)'}</pre>
                </div>
              )}
              {verdict.input !== undefined && !verdict.sample && !showTest && !virtual && (
                <button className="btn sm" onClick={() => setShowTest(true)}>
                  Показать тест — в настоящем контесте так нельзя
                </button>
              )}
            </div>
          )}
          <details className="card mt">
            <summary>
              <b>Запустить на своём вводе</b>
            </summary>
            <textarea className="input mono mt-s" value={custom} onChange={(e) => setCustom(e.target.value)} spellCheck={false} />
            <button className="btn sm mt-s" onClick={runCustom} disabled={!!busy}>
              Запустить
            </button>
            {customOut && (
              <div className="mt-s">
                <pre className={customOut.err ? 'result fail' : 'result'}>{customOut.err ? `${customOut.out}\n${customOut.err}` : customOut.out || '(пусто)'}</pre>
                {customOut.ms !== undefined && <div className="tiny faint">{Math.round(customOut.ms)} мс</div>}
              </div>
            )}
          </details>
        </div>
      </div>
    </div>
  )
}

function SolutionTab({ explanation, code, solved }: { explanation: string; code: string; solved: boolean }) {
  const [open, setOpen] = useState(solved)
  if (!open)
    return (
      <div className="stack">
        <p className="muted">Откройте разбор после своей попытки: на контесте и на секции разбора не будет.</p>
        <button className="btn" style={{ justifySelf: 'start' }} onClick={() => setOpen(true)}>
          Показать разбор
        </button>
      </div>
    )
  return (
    <div className="stack">
      <Md text={explanation} />
      <Md text={'```python\n' + code.trim() + '\n```'} />
    </div>
  )
}
