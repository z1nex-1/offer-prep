import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crumbs, Md } from '../../components/ui'
import { lessons } from '../../course/content'
import { modules } from '../../course/modules'
import { problems } from '../../data/problems'
import { rateCard, useStore } from '../../lib/store'

const STEPS = [
  ['Уточнить условие', 'Переспросить формат входа и выхода, ограничения, что делать с пустыми данными и дубликатами. Интервьюер оценивает, как вы задаёте вопросы.'],
  ['Придумать примеры', 'Два-три обычных примера и краевые случаи: пустой ввод, один элемент, все одинаковые. Официальный совет Яндекса — начинать именно с этого.'],
  ['Озвучить идею и сложность', 'Сначала словами: какие структуры данных, какой проход, O(?) по времени и памяти. Интервьюер не пустит писать код, пока нет эффективной идеи.'],
  ['Написать код', 'Компактно, без дублирования и лишних частных случаев. Понятные имена. Задачи рассчитаны на полчаса — если код растёт за 40 строк, идея, скорее всего, сложнее нужной.'],
  ['Проверить без запуска', 'Пройти код построчно на своём примере, следя за значениями переменных. Найденная и исправленная самим собой ошибка — плюс, а не минус.'],
  ['Ответить на вопросы', 'Почему такая сложность, что будет на больших данных, можно ли без доппамяти, как протестировать.'],
]

const OFFICIAL = ['valid-anagram', 'generate-parentheses', 'remove-duplicates', 'merge-k-sorted', 'rle', 'ranges-compress', 'max-ones-k-flips', 'group-anagrams', 'merge-intervals', 'two-sum', 'lru-cache', 'valid-parentheses']

export default function Interview() {
  const nav = useNavigate()
  const solved = useStore((s) => s.problems)
  const [mod, setMod] = useState('')
  const [diff, setDiff] = useState<'any' | 'easy' | 'medium'>('medium')

  const pool = useMemo(() => {
    const ids = mod ? modules.find((m) => m.id === mod)?.problems ?? [] : modules.flatMap((m) => m.problems)
    return problems.filter((p) => ids.includes(p.id) && (diff === 'any' || p.difficulty === diff))
  }, [mod, diff])

  const go = () => {
    const fresh = pool.filter((p) => !solved[p.id])
    const src = fresh.length ? fresh : pool
    const p = src[Math.floor(Math.random() * src.length)]
    if (p) nav(`/problems/${p.id}?mode=interview`)
  }

  return (
    <div className="container narrow">
      <Crumbs items={[{ to: '/iwo', label: 'Курс IWO' }, { label: 'Тренажёр секции' }]} />
      <h1>Тренажёр технической секции</h1>
      <p className="lead">
        На секции Intern week offer дают 2–3 задачи на алгоритмы и вопросы по теории. Запускать код и пользоваться IDE нельзя. Оценивают знание языка, умение оценить сложность, найти оптимальное решение и написать читаемый код.
      </p>

      <section className="card section">
        <h2 style={{ marginTop: 0 }}>Задача в режиме собеседования</h2>
        <p className="small muted">Таймер на 25 минут, запуск тестов закрыт, пока вы не скажете «готово». Подсказок и разбора нет. После проверки — самооценка по критериям секции.</p>
        <div className="row">
          <select className="input" style={{ maxWidth: 300 }} value={mod} onChange={(e) => setMod(e.target.value)}>
            <option value="">Любая тема</option>
            {modules
              .filter((m) => m.problems.length)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
          </select>
          <select className="input" style={{ maxWidth: 180 }} value={diff} onChange={(e) => setDiff(e.target.value as 'any' | 'easy' | 'medium')}>
            <option value="easy">Лёгкая</option>
            <option value="medium">Средняя</option>
            <option value="any">Любая</option>
          </select>
          <button className="btn primary" onClick={go} disabled={!pool.length}>
            Случайная задача
          </button>
        </div>
      </section>

      <section className="section">
        <h2>Алгоритм на каждую задачу</h2>
        <div className="steps">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="step">
              <span className="n">{i + 1}</span>
              <div className="step-body">
                <b>{t}</b>
                <div className="small muted">{d}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="small muted">
          Подробно — в уроке <Link to="/iwo/l/algo-interview">«Как проходит алгоритмическая секция»</Link>.
        </p>
      </section>

      <section className="section">
        <h2>Задачи того же типа, что в официальных примерах Яндекса</h2>
        <div className="card">
          {OFFICIAL.map((id) => problems.find((p) => p.id === id))
            .filter((p): p is NonNullable<typeof p> => !!p)
            .map((p) => (
              <div key={p.id} className={solved[p.id] ? 'task done' : 'task'}>
                <div className="task-body">
                  <Link to={`/problems/${p.id}?mode=interview`}>{p.title}</Link>
                  <div className="tiny faint">{p.pattern}</div>
                </div>
              </div>
            ))}
        </div>
        <p className="small muted">
          Сами задачи из статьи Яндекса — в подборке{' '}
          <a href="https://coderun.yandex.ru/selections/yandex-interview" target="_blank" rel="noreferrer">
            «Подготовка к собеседованию в Яндекс»
          </a>{' '}
          и{' '}
          <a href="https://coderun.yandex.ru/selections/backend-interview" target="_blank" rel="noreferrer">
            «Стажировка // Бэкенд»
          </a>{' '}
          на CodeRun.
        </p>
      </section>

      <TheoryDrill />
    </div>
  )
}

function TheoryDrill() {
  const pool = useMemo(
    () =>
      lessons
        .filter((l) => ['py-deep', 'backend', 'complexity', 'py-collections', 'hashing', 'sorting'].includes(l.module))
        .flatMap((l) => l.oral.map((q, i) => ({ ...q, id: `iwo:${l.id}#${i}`, lesson: l }))),
    [],
  )
  const [i, setI] = useState(() => Math.floor(Math.random() * Math.max(1, pool.length)))
  const [open, setOpen] = useState(false)
  if (!pool.length) return null
  const q = pool[i % pool.length]
  const next = (grade?: 'know' | 'unsure' | 'dont') => {
    if (grade) rateCard(q.id, grade)
    setOpen(false)
    setI(Math.floor(Math.random() * pool.length))
  }
  return (
    <section className="section">
      <h2>Случайный вопрос по теории</h2>
      <p className="small muted">{pool.length} вопросов из уроков о Python, сложности, коллекциях, сетях и базах данных. Отвечайте вслух за 1–2 минуты, как на секции.</p>
      <div className="card stack">
        <div className="tiny faint">
          Урок: <Link to={`/iwo/l/${q.lesson.id}`}>{q.lesson.title}</Link>
        </div>
        <b style={{ fontSize: 18 }}>{q.q}</b>
        {open ? (
          <>
            <Md text={q.a} />
            <div className="row">
              <button className="btn sm ok" onClick={() => next('know')}>
                Знал
              </button>
              <button className="btn sm warm" onClick={() => next('unsure')}>
                Частично
              </button>
              <button className="btn sm bad" onClick={() => next('dont')}>
                Не знал
              </button>
            </div>
          </>
        ) : (
          <div className="row">
            <button className="btn" onClick={() => setOpen(true)}>
              Показать ответ
            </button>
            <button className="btn ghost" onClick={() => next()}>
              Другой вопрос
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
