import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Crumbs, Md, Progress, plural } from '../../components/ui'
import { trackDiagnostic, trackModules } from '../../course/content'
import { moduleById } from '../../course/modules'
import { diagScores, masteryFromScore } from '../../course/progress'
import { TRACKS, trackOf } from '../../course/tracks'
import { MasteryChip } from '../../course/ui'
import { updateIwo, useStore } from '../../lib/store'

const DONT_KNOW = -1

function Results() {
  const iwo = useStore((s) => s.iwo)
  const diagnostic = trackDiagnostic(trackOf(iwo))
  const scores = diagScores(iwo)
  const wrong = diagnostic.filter((q) => iwo.diag && iwo.diag.answers[q.id] !== undefined && iwo.diag.answers[q.id] !== q.answer)
  const [showWrong, setShowWrong] = useState(false)
  return (
    <div className="stack">
      <div className="notice ok">
        Диагностика сохранена. План и программа курса уже подстроены под результат: темы с отметкой «Знаю» в плане идут только практикой, «Повторить» — короткой теорией и задачами, «С нуля» — полным уроком.
      </div>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Тема</th>
              <th className="num">Результат</th>
              <th>Что делать</th>
            </tr>
          </thead>
          <tbody>
            {trackModules(trackOf(iwo))
              .filter((m) => scores[m.id])
              .map((m) => {
                const sc = scores[m.id]!
                return (
                  <tr key={m.id}>
                    <td>
                      <Link to={`/iwo/m/${m.id}`}>{m.title}</Link>
                    </td>
                    <td className="num">{Math.round(sc.score * 100)}%</td>
                    <td>
                      <MasteryChip m={masteryFromScore(sc.score)} />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
      <div className="row">
        <Link className="btn primary" to="/iwo/plan">
          Собрать план по дням
        </Link>
        {wrong.length > 0 && (
          <button className="btn" onClick={() => setShowWrong((v) => !v)}>
            {showWrong ? 'Скрыть ошибки' : `Разобрать ошибки (${wrong.length})`}
          </button>
        )}
      </div>
      {showWrong &&
        wrong.map((q) => (
          <div key={q.id} className="card flat mcq">
            <div className="tiny faint">{moduleById[q.module]?.title}</div>
            <Md text={q.q} compact />
            <div className="notice ok">
              <b>Правильный ответ:</b> <Md text={q.options[q.answer]} compact />
            </div>
            <Md text={q.explain} compact />
          </div>
        ))}
    </div>
  )
}

export default function Diagnostic() {
  const saved = useStore((s) => s.iwo.diag)
  const track = useStore((s) => trackOf(s.iwo))
  const diagnostic = useMemo(() => trackDiagnostic(track), [track])
  // Темы, по которым ещё не было ни одного ответа: например, после переключения на другое направление.
  const touched = new Set(saved ? diagnostic.filter((q) => saved.answers[q.id] !== undefined).map((q) => q.module) : [])
  const fresh = saved ? diagnostic.filter((q) => !touched.has(q.module)) : []
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [finished, setFinished] = useState(false)

  const queue = useMemo(() => diagnostic.filter((q) => !skipped.has(q.module)), [diagnostic, skipped])
  const current = queue.find((q) => answers[q.id] === undefined)
  const answeredN = Object.keys(answers).length

  const finish = (a: Record<string, number>) => {
    // Ответы на вопросы других направлений сохраняются: их модули в этом тесте не спрашивались.
    const own = new Set(diagnostic.map((q) => q.id))
    updateIwo((s) => ({ ...s, diag: { at: Date.now(), answers: { ...Object.fromEntries(Object.entries(s.diag?.answers ?? {}).filter(([id]) => !own.has(id))), ...a } } }))
    setFinished(true)
  }

  const answer = (value: number) => {
    if (!current) return
    const next = { ...answers, [current.id]: value }
    setAnswers(next)
    // Две ошибки подряд в теме — дальше по ней спрашивать нет смысла, уровень уже понятен.
    const inModule = diagnostic.filter((q) => q.module === current.module && next[q.id] !== undefined)
    const last2 = inModule.slice(-2)
    const nextSkipped = new Set(skipped)
    if (last2.length === 2 && last2.every((q) => next[q.id] !== q.answer)) nextSkipped.add(current.module)
    setSkipped(nextSkipped)
    const remaining = diagnostic.filter((q) => !nextSkipped.has(q.module) && next[q.id] === undefined)
    if (!remaining.length) finish(next)
  }

  const skipModule = () => {
    if (!current) return
    const next = { ...answers }
    const nextSkipped = new Set(skipped).add(current.module)
    setSkipped(nextSkipped)
    if (!diagnostic.some((q) => !nextSkipped.has(q.module) && next[q.id] === undefined)) finish(next)
  }

  if (finished || (saved && !started)) {
    return (
      <div className="container narrow">
        <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'Диагностика' }]} />
        <h1>Результаты диагностики</h1>
        {saved && <p className="muted">Пройдена {new Date(saved.at).toLocaleString('ru-RU')}.</p>}
        <Results />
        {!finished && (
          <div className="row mt">
            {saved && fresh.length > 0 && (
              <button
                className="btn primary"
                onClick={() => {
                  setAnswers(Object.fromEntries(diagnostic.filter((q) => saved.answers[q.id] !== undefined).map((q) => [q.id, saved.answers[q.id]])))
                  // Темы, по которым уже отвечали, не переспрашиваются — даже если тест тогда пропустил часть вопросов.
                  setSkipped(touched)
                  setStarted(true)
                }}
              >
                Ответить на новые вопросы · {fresh.length}
              </button>
            )}
            <button
              className="btn"
              onClick={() => {
                setAnswers({})
                setSkipped(new Set())
                setStarted(true)
              }}
            >
              Пройти диагностику заново
            </button>
          </div>
        )}
      </div>
    )
  }

  if (!started) {
    const perModule = trackModules(track).map((m) => ({ m, n: diagnostic.filter((q) => q.module === m.id).length })).filter((x) => x.n)
    return (
      <div className="container narrow">
        <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'Диагностика' }]} />
        <h1>Диагностика уровня</h1>
        <p className="lead">
          {plural(diagnostic.length, 'вопрос', 'вопроса', 'вопросов')} по {plural(perModule.length, 'теме', 'темам', 'темам')} направления «{TRACKS[track].title}» — {track === 'ml' ? 'от основ Python и алгоритмов до моделей, метрик и нейросетей' : 'от основ Python до графов и теории бэкенда'}. Вопросы внутри темы идут от простых к сложным.
        </p>
        <div className="card stack">
          <div>
            <b>Как проходить</b>
            <ul className="small">
              <li>Не угадывайте. Если не уверены — жмите «Не знаю»: неверная угадайка поставит тему в «Знаю», и курс её пропустит.</li>
              <li>Код в вопросах не запускайте — на секциях Яндекса запускать код тоже нельзя.</li>
              <li>Две ошибки подряд в теме — тест переходит к следующей, чтобы не тратить время.</li>
              <li>Правильные ответы и пояснения — в конце.</li>
            </ul>
          </div>
          <div className="chips">
            {perModule.map(({ m, n }) => (
              <span key={m.id} className="chip">
                {m.title} · {n}
              </span>
            ))}
          </div>
          <button className="btn primary" style={{ justifySelf: 'start' }} onClick={() => setStarted(true)}>
            Начать
          </button>
        </div>
      </div>
    )
  }

  if (!current) return null
  const mod = moduleById[current.module]
  const total = queue.length + diagnostic.filter((q) => skipped.has(q.module) && answers[q.id] !== undefined).length
  return (
    <div className="container narrow">
      <div className="diag-bar">
        <div className="row between small">
          <span>
            <b>{mod?.title}</b> · вопрос уровня {current.level}
          </span>
          <span className="faint">
            {answeredN} из ~{total}
          </span>
        </div>
        <Progress value={(answeredN / Math.max(1, total)) * 100} />
      </div>
      <div className="card mcq mt">
        <Md text={current.q} />
        <div className="mcq-options">
          {current.options.map((o, j) => (
            <button key={j} className="mcq-opt" onClick={() => answer(j)}>
              <Md text={o} compact />
            </button>
          ))}
        </div>
        <div className="row between">
          <button className="btn" onClick={() => answer(DONT_KNOW)}>
            Не знаю
          </button>
          <button className="btn ghost sm" onClick={skipModule}>
            Эту тему я не изучал — пропустить
          </button>
        </div>
      </div>
    </div>
  )
}
