import { Link } from 'react-router-dom'
import { Progress, plural } from '../../components/ui'
import { coderun, moduleLessons, trackContest, trackDiagnostic, trackLessons, trackModules } from '../../course/content'
import { PARTS } from '../../course/modules'
import { buildCoursePlan, taskDone } from '../../course/plan'
import { daysBetween, fmtDay, moduleMastery, moduleProgress, todayISO } from '../../course/progress'
import { TRACKS, TRACK_LIST, trackOf, type TrackInfo } from '../../course/tracks'
import { MasteryChip, TaskRow } from '../../course/ui'
import { updateIwo, useStore } from '../../lib/store'

function Countdown({ t }: { t: TrackInfo }) {
  const today = todayISO()
  const toContest = daysBetween(today, t.contestDeadline)
  const toSections = daysBetween(today, t.sectionsStart)
  return (
    <div className="countdown">
      <div className="stat card">
        <b>{toContest >= 0 ? plural(toContest, 'день', 'дня', 'дней') : 'прошёл'}</b>
        <span>
          до дедлайна контеста — {fmtDay(t.contestDeadline, false)}, 23:59 МСК · {plural(t.contestTasks, 'задача', 'задачи', 'задач')} за {plural(t.contestHours, 'час', 'часа', 'часов')}
        </span>
      </div>
      <div className="stat card">
        <b>{toSections >= 0 ? plural(toSections, 'день', 'дня', 'дней') : 'идут'}</b>
        <span>до технических секций — {t.sectionsLabel}, онлайн</span>
      </div>
      <div className="stat card">
        <b>2 секции</b>
        <span>{t.sectionsAbout}</span>
      </div>
    </div>
  )
}

function TrackSwitch({ current }: { current: TrackInfo['id'] }) {
  return (
    <div className="row mb" role="group" aria-label="Направление">
      {TRACK_LIST.map((t) => (
        <button key={t.id} className={t.id === current ? 'btn sm primary' : 'btn sm'} aria-pressed={t.id === current} onClick={() => updateIwo((x) => ({ ...x, track: t.id }))}>
          {t.title} · контест до {fmtDay(t.contestDeadline, false)}
        </button>
      ))}
    </div>
  )
}

export default function Hub() {
  const s = useStore((x) => x)
  const track = trackOf(s.iwo)
  const T = TRACKS[track]
  const lessons = trackLessons(track)
  const diagnostic = trackDiagnostic(track)
  const contestProblems = trackContest(track)
  const modules = trackModules(track)
  const fresh = s.iwo.diag ? modules.filter((m) => diagnostic.some((q) => q.module === m.id) && !diagnostic.some((q) => q.module === m.id && s.iwo.diag!.answers[q.id] !== undefined)).length : 0
  const today = todayISO()
  const mastery = moduleMastery(s.iwo)
  const plan = buildCoursePlan(s, today)
  const todayPlan = plan?.days.find((d) => d.date === today) ?? plan?.days[0]
  const doneLessons = lessons.filter((l) => s.iwo.lessons[l.id]).length
  const solvedContest = contestProblems.filter((p) => s.iwo.contest[p.id]).length
  const solvedCr = Object.keys(s.iwo.coderun).length

  return (
    <div className="container">
      <section className="hero" style={{ paddingBottom: 12 }}>
        <TrackSwitch current={track} />
        <div className="eyebrow">{T.eyebrow}</div>
        <h1>Курс подготовки к Intern week offer</h1>
        <p className="lead" style={{ maxWidth: 820 }}>
          {T.lead}
        </p>
        <Countdown t={T} />
      </section>

      {!s.iwo.diag && (
        <div className="card section" style={{ borderColor: 'var(--accent)' }}>
          <h2 style={{ marginTop: 0 }}>Шаг 1. Определить уровень</h2>
          <p className="muted">
            Тест из {plural(diagnostic.length, 'вопроса', 'вопросов', 'вопросов')} по всем темам направления: {track === 'ml' ? 'Python, алгоритмы, математика, модели, метрики, нейросети' : 'Python, алгоритмы, теория'}. Отвечайте честно, кнопка «Не знаю» лучше угадывания — по результатам курс покажет, какие темы учить с нуля, какие повторить, а какие пропустить. Если по теме подряд идут ошибки, тест сам перейдёт к следующей. Занимает 25–40 минут.
          </p>
          <div className="row">
            <Link className="btn primary" to="/iwo/diagnostic">
              Пройти диагностику
            </Link>
            <Link className="btn" to="/iwo/plan?zero=1">
              Я начинаю с нуля — сразу собрать план
            </Link>
          </div>
        </div>
      )}

      {s.iwo.diag && fresh > 0 && (
        <div className="notice warm section">
          По {plural(fresh, 'теме', 'темам', 'темам')} направления «{T.title}» диагностика ещё не спрашивала — пока они считаются темами «с нуля».{' '}
          <Link to="/iwo/diagnostic">Ответить только на новые вопросы</Link>
        </div>
      )}

      {s.iwo.diag && !s.iwo.settings && (
        <div className="card section" style={{ borderColor: 'var(--accent)' }}>
          <h2 style={{ marginTop: 0 }}>Шаг 2. Собрать план по дням</h2>
          <p className="muted">Диагностика пройдена. Укажите, сколько часов в день готовы заниматься и в какой день планируете решать контест, — план распределит темы и задачи до контеста и до секций.</p>
          <Link className="btn primary" to="/iwo/plan">
            Собрать план
          </Link>
        </div>
      )}

      {plan && todayPlan && (
        <section className="section">
          <div className="section-head">
            <h2>Сегодня · {fmtDay(todayPlan.date)}</h2>
            <Link to="/iwo/plan" className="btn sm">
              Весь план
            </Link>
          </div>
          <div className="card">
            {todayPlan.note && <div className="notice warm mb">{todayPlan.note}</div>}
            {todayPlan.tasks.length ? todayPlan.tasks.map((t) => <TaskRow key={t.id} t={t} s={s} />) : <p className="muted">На сегодня задач нет — повторите карточки или решите задачу Яндекса по слабой теме.</p>}
            <div className="row between mt-s tiny faint">
              <span>
                Выполнено {todayPlan.tasks.filter((t) => taskDone(t, s)).length} из {todayPlan.tasks.length}
              </span>
              <span>≈ {Math.round(todayPlan.minutes / 6) / 10} ч</span>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="grid grid-4">
          <Link to="/iwo/diagnostic" className="card card-link">
            <b>Диагностика</b>
            <div className="small muted">{s.iwo.diag ? `Пройдена ${new Date(s.iwo.diag.at).toLocaleDateString('ru-RU')} · пройти снова` : `${plural(diagnostic.length, 'вопрос', 'вопроса', 'вопросов')}, 25–40 минут`}</div>
          </Link>
          <Link to="/iwo/contest" className="card card-link">
            <b>Задачи в формате контеста</b>
            <div className="small muted">
              {solvedContest} из {contestProblems.length} решено · ввод-вывод, как в Яндекс Контесте, и пробный контест с таймером
            </div>
          </Link>
          <Link to="/iwo/yandex" className="card card-link">
            <b>Задачи Яндекса</b>
            <div className="small muted">
              {plural(coderun.length, 'задача', 'задачи', 'задач')} CodeRun по темам курса · отмечено {solvedCr}
            </div>
          </Link>
          <Link to="/iwo/interview" className="card card-link">
            <b>Тренажёр секции</b>
            <div className="small muted">Задача, таймер, код без запуска, самопроверка по критериям Яндекса</div>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Программа</h2>
          <span className="small muted">
            {doneLessons} из {plural(lessons.length, 'урока', 'уроков', 'уроков')} пройдено
          </span>
        </div>
        {T.parts.map((pid) => {
          const part = PARTS.find((x) => x.id === pid)!
          const ms = modules.filter((m) => m.part === part.id)
          return (
            <div key={part.id} className="section" style={{ marginTop: 18 }}>
              <h3 style={{ marginBottom: 4 }}>{part.title}</h3>
              <p className="small muted" style={{ marginTop: 0 }}>
                {part.hint}
              </p>
              <div className="grid grid-3">
                {ms.map((m) => {
                  const pr = moduleProgress(s, m.id)
                  const n = moduleLessons(m.id, track).length
                  return (
                    <Link key={m.id} to={`/iwo/m/${m.id}`} className="card card-link module-card">
                      <h3>{m.title}</h3>
                      <div className="small muted">{m.goal}</div>
                      <div className="row" style={{ gap: 6 }}>
                        {m.id !== 'start' && <MasteryChip m={s.iwo.diag || s.iwo.settings ? mastery[m.id] : undefined} />}
                        <span className="chip">{plural(n, 'урок', 'урока', 'уроков')}</span>
                        {m.stage === 'contest' && <span className="chip">для контеста</span>}
                        {m.stage === 'interview' && <span className="chip">для секций</span>}
                      </div>
                      <Progress value={pr.pct} ok={pr.pct >= 100} />
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
