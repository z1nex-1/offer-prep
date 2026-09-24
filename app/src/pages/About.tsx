import { Link } from 'react-router-dom'
import { Resources } from '../components/ui'
import { companies } from '../data/companies'

export default function About() {
  const sources = companies.flatMap((c) => c.sources)
  const unique = [...new Map(sources.map((s) => [s.url, s])).values()]
  return (
    <div className="container narrow">
      <h1>О проекте</h1>
      <div className="card">
        <p>
          «Оффер» помогает подготовиться к стажировке и первому собеседованию в IT. Мы собрали, как устроен отбор у крупных российских работодателей, и превратили это в план, теорию и тренажёры.
        </p>
        <h3>Откуда данные</h3>
        <p>
          Этапы отбора и форматы секций взяты с официальных карьерных страниц компаний (Яндекс, Т-Банк, Сбер, VK, Ozon, Авито и других), из инженерных блогов компаний на Хабре и из опубликованных разборов кандидатов. На странице каждой компании отмечено, какие сведения официальные, и приведены источники.
        </p>
        <p>
          Условия, сроки наборов и форматы меняются от сезона к сезону. Перед подачей сверяйтесь с карьерной страницей компании.
        </p>
        <h3>Как устроен сайт</h3>
        <p>
          Прогресс хранится в вашем браузере и никуда не отправляется. Код на Python выполняется прямо в браузере через Pyodide, SQL — через SQLite, скомпилированный в WebAssembly.
        </p>
        <Link to="/guide">Начать с гайда по подготовке →</Link>
      </div>
      <div className="card mt">
        <h3>Источники</h3>
        <Resources items={unique} />
      </div>
    </div>
  )
}
