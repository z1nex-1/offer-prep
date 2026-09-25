import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Crumbs, DiffChip, plural } from '../../components/ui'
import { SELECTIONS, coderunForModule, coderunLevel, coderunUrl, contestProblems, moduleLessons, yandexPicks } from '../../course/content'
import { moduleById, modules } from '../../course/modules'
import { moduleMastery } from '../../course/progress'
import { MasteryChip } from '../../course/ui'
import { problems } from '../../data/problems'
import { toggleIn, useStore } from '../../lib/store'
import { QA } from '../Topic'

const LEVEL_LABEL = { 1: 'Разминка', 2: 'Уровень контеста', 3: 'Сложные' }

export function CodeRunList({ moduleId, limit = 12 }: { moduleId: string; limit?: number }) {
  const done = useStore((s) => s.iwo.coderun)
  const [all, setAll] = useState(false)
  const picks = yandexPicks(moduleId)
  const picked = new Set(picks.map((x) => x.p.slug))
  const list = coderunForModule(moduleId).filter((p) => !picked.has(p.slug) && (moduleId !== 'py-basics' || p.rate < 22))
  if (!list.length && !picks.length) return null
  const official = list.filter((p) => p.sel.length)
  const rest = list.filter((p) => !p.sel.length)
  const ordered = [...official, ...rest]
  const shown = all ? ordered : ordered.slice(0, limit)
  return (
    <div className="stack">
      {picks.length > 0 && (
        <div className="card">
          <div className="small muted mb">Подобраны к теме вручную, от простой к сложной — начинайте с них.</div>
          {picks.map(({ p, note }) => (
            <div key={p.slug} className={done[p.slug] ? 'task done' : 'task'}>
              <Check on={!!done[p.slug]} onClick={() => toggleIn('coderun', p.slug)} title="Отметить решённой (OK на CodeRun)" />
              <div className="task-body">
                <div className="row" style={{ gap: 8 }}>
                  <a href={coderunUrl(p.slug)} target="_blank" rel="noreferrer">
                    {p.title} ↗
                  </a>
                  <span className={`chip ${['', 'easy', 'medium', 'hard'][coderunLevel(p)]}`}>{LEVEL_LABEL[coderunLevel(p)]}</span>
                </div>
                {note && <div className="tiny faint">{note}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {list.length > 0 && (
    <div className="card">
      {picks.length > 0 && <div className="small muted mb">Ещё задачи по тегам темы</div>}
      {shown.map((p) => (
        <div key={p.slug} className={done[p.slug] ? 'task done' : 'task'}>
          <Check on={!!done[p.slug]} onClick={() => toggleIn('coderun', p.slug)} title="Отметить решённой (OK на CodeRun)" />
          <div className="task-body">
            <div className="row" style={{ gap: 8 }}>
              <a href={coderunUrl(p.slug)} target="_blank" rel="noreferrer">
                {p.title} ↗
              </a>
              <span className={`chip ${['', 'easy', 'medium', 'hard'][coderunLevel(p)]}`}>{LEVEL_LABEL[coderunLevel(p)]}</span>
              {p.sel.filter((x) => SELECTIONS[x]).slice(0, 2).map((x) => (
                <span key={x} className="chip official" title={SELECTIONS[x].note}>
                  {SELECTIONS[x].title}
                </span>
              ))}
            </div>
            <div className="tiny faint">{p.tags.join(' · ')}</div>
          </div>
        </div>
      ))}
      {ordered.length > limit && (
        <button className="btn sm mt-s" onClick={() => setAll((v) => !v)}>
          {all ? 'Свернуть' : `Показать все ${ordered.length}`}
        </button>
      )}
    </div>
      )}
    </div>
  )
}

export default function ModulePage() {
  const { id = '' } = useParams()
  const m = moduleById[id]
  const s = useStore((x) => x)
  if (!m) return <div className="container empty">Модуль не найден. <Link to="/iwo">К курсу</Link></div>
  const ls = moduleLessons(m.id)
  const mastery = moduleMastery(s.iwo)[m.id]
  const own = m.problems.map((pid) => problems.find((p) => p.id === pid)).filter((p): p is NonNullable<typeof p> => !!p)
  const contest = contestProblems.filter((p) => p.module === m.id)
  const idx = modules.findIndex((x) => x.id === m.id)
  const next = modules[idx + 1]
  const oral = ls.flatMap((l) => l.oral.map((q, i) => ({ q, id: `iwo:${l.id}#${i}` })))

  return (
    <div className="container narrow">
      <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: m.title }]} />
      <h1>{m.title}</h1>
      <p className="lead">{m.goal}</p>
      <div className="row">
        {m.id !== 'start' && <MasteryChip m={s.iwo.diag || s.iwo.settings ? mastery : undefined} />}
        <span className="chip">Важность для отбора: {'●'.repeat(m.weight)}{'○'.repeat(3 - m.weight)}</span>
        {m.stage !== 'both' && <span className="chip">{m.stage === 'contest' ? 'В первую очередь для контеста' : 'В первую очередь для секций'}</span>}
      </div>

      <section className="section">
        <h2>Уроки</h2>
        <div className="card">
          {ls.length === 0 && <p className="muted">Уроки модуля готовятся.</p>}
          {ls.map((l, i) => {
            const done = !!s.iwo.lessons[l.id]
            const ch = s.iwo.checks[l.id]
            return (
              <div key={l.id} className={done ? 'task done' : 'task'}>
                <span className="n">{i + 1}</span>
                <div className="task-body">
                  <Link to={`/iwo/l/${l.id}`}>
                    <b>{l.title}</b>
                  </Link>
                  <div className="tiny faint">{l.summary}</div>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  {ch && <span className={`chip ${ch.score >= ch.total * 0.8 ? 'easy' : 'medium'}`}>{ch.score}/{ch.total}</span>}
                  <span className="tiny faint nowrap">{l.minutes} мин</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {(own.length > 0 || contest.length > 0) && (
        <section className="section">
          <h2>Практика на сайте</h2>
          <p className="small muted">Свои задачи — с автопроверкой в браузере. «Функция» — формат собеседования, «Контест» — полная программа с вводом и выводом, как в Яндекс Контесте.</p>
          <div className="card">
            {contest.map((p) => (
              <div key={p.id} className={s.iwo.contest[p.id] ? 'task done' : 'task'}>
                <span className="chip kind-contest">Контест</span>
                <div className="task-body">
                  <Link to={`/iwo/contest/${p.id}`}>{p.title}</Link>
                </div>
                <DiffChip d={p.difficulty} />
              </div>
            ))}
            {own.map((p) => (
              <div key={p.id} className={s.problems[p.id] ? 'task done' : 'task'}>
                <span className="chip">Функция</span>
                <div className="task-body">
                  <Link to={`/problems/${p.id}`}>{p.title}</Link>
                  <div className="tiny faint">{p.pattern}</div>
                </div>
                <DiffChip d={p.difficulty} />
              </div>
            ))}
          </div>
        </section>
      )}

      {(m.coderunTags.length > 0 || yandexPicks(m.id).length > 0) && (
        <section className="section">
          <h2>Задачи Яндекса на CodeRun</h2>
          <p className="small muted">
            Задачи с отборов, тренировок и собеседований Яндекса{m.coderunTags.length > 0 && ` по тегам ${m.coderunTags.join(', ')}`}. Сначала — из официальных подборок для собеседований и стажировок. Решайте на CodeRun (нужен Яндекс ID), здесь отмечайте галочкой.
          </p>
          <CodeRunList moduleId={m.id} />
        </section>
      )}

      {oral.length > 0 && (
        <section className="section" id="oral">
          <h2>Вопросы на собеседовании</h2>
          <p className="small muted">{plural(oral.length, 'вопрос', 'вопроса', 'вопросов')} из уроков модуля. Ответьте вслух, откройте ответ, оцените себя — вопрос попадёт в интервальное повторение.</p>
          {oral.map((o, i) => (
            <QA key={o.id} id={o.id} n={i + 1} q={o.q} />
          ))}
        </section>
      )}

      {m.handbook?.length ? (
        <section className="section card">
          <h3>Хендбуки Яндекс Образования</h3>
          <div className="list">
            {m.handbook.map((h) => (
              <a key={h.url} href={h.url} target="_blank" rel="noreferrer">
                {h.title}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {next && (
        <div className="row between section">
          <span />
          <Link className="btn nav" to={`/iwo/m/${next.id}`}>
            {next.title} →
          </Link>
        </div>
      )}
    </div>
  )
}
