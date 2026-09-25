import { Link, useParams } from 'react-router-dom'
import { Crumbs, Md, plural } from '../../components/ui'
import { contestProblems, lessonById, lessons, moduleLessons } from '../../course/content'
import { moduleById } from '../../course/modules'
import { QuizBlock } from '../../course/ui'
import { problems } from '../../data/problems'
import { toggleIn, updateIwo, useStore } from '../../lib/store'
import { QA } from '../Topic'

export default function LessonPage() {
  const { id = '' } = useParams()
  const l = lessonById[id]
  const done = useStore((s) => !!s.iwo.lessons[id])
  const check = useStore((s) => s.iwo.checks[id])
  if (!l) return <div className="container empty">Урок не найден. <Link to="/iwo">К курсу</Link></div>
  const m = moduleById[l.module]
  const idx = lessons.findIndex((x) => x.id === l.id)
  const prev = lessons[idx - 1]
  const next = lessons[idx + 1]
  const inModule = moduleLessons(l.module)
  const isLastInModule = inModule[inModule.length - 1]?.id === l.id
  const own = (m?.problems ?? []).map((pid) => problems.find((p) => p.id === pid)).filter((p): p is NonNullable<typeof p> => !!p)
  const contest = contestProblems.filter((p) => p.module === l.module)

  const onFinish = (score: number, total: number) => {
    updateIwo((s) => ({ ...s, checks: { ...s.checks, [l.id]: { at: Date.now(), score, total } } }))
    if (score >= total * 0.8) toggleIn('lessons', l.id, true)
  }

  return (
    <div className="container narrow">
      <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { to: `/iwo/m/${l.module}`, label: m?.title ?? l.module }, { label: `Урок ${inModule.findIndex((x) => x.id === l.id) + 1} из ${inModule.length}` }]} />
      <h1>{l.title}</h1>
      <div className="row mb">
        <span className="chip">≈ {l.minutes} мин</span>
        {l.check.length > 0 && <span className="chip">{plural(l.check.length, 'вопрос', 'вопроса', 'вопросов')} самопроверки</span>}
        {done && <span className="chip easy">✓ Пройден</span>}
      </div>
      <p className="muted" style={{ fontSize: 17 }}>
        {l.summary}
      </p>
      <article className="card mt lesson-body">
        <Md text={l.body} />
      </article>

      {l.check.length > 0 && (
        <section className="section">
          <h2>Самопроверка</h2>
          <p className="small muted">Ответьте на все вопросы. При 80% верных урок засчитывается автоматически, и тема в плане считается изученной.</p>
          <QuizBlock items={l.check} onFinish={onFinish} initial={check} />
        </section>
      )}

      {l.oral.length > 0 && (
        <section className="section">
          <h2>Так спросят на собеседовании</h2>
          <p className="small muted">Сначала ответьте вслух, как интервьюеру, потом откройте ответ.</p>
          {l.oral.map((q, i) => (
            <QA key={i} id={`iwo:${l.id}#${i}`} n={i + 1} q={q} />
          ))}
        </section>
      )}

      {isLastInModule && (own.length > 0 || contest.length > 0) && (
        <section className="section card">
          <h3>Закрепить задачами</h3>
          <div className="list">
            {contest.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/iwo/contest/${p.id}`}>
                Контест: {p.title}
              </Link>
            ))}
            {own.slice(0, 4).map((p) => (
              <Link key={p.id} to={`/problems/${p.id}`}>
                Функция: {p.title}
              </Link>
            ))}
            <Link to={`/iwo/m/${l.module}`}>Все задачи модуля, включая задачи Яндекса →</Link>
          </div>
        </section>
      )}

      <div className="row between section">
        <button className={done ? 'btn ok' : 'btn primary'} onClick={() => toggleIn('lessons', l.id)}>
          {done ? '✓ Урок пройден' : 'Отметить урок пройденным'}
        </button>
        <div className="row">
          {prev && (
            <Link className="btn nav" to={`/iwo/l/${prev.id}`}>
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link className="btn nav" to={`/iwo/l/${next.id}`}>
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
