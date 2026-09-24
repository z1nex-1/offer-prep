import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

const Companies = lazy(() => import('./pages/Companies').then((m) => ({ default: m.Companies })))
const CompanyPage = lazy(() => import('./pages/Companies').then((m) => ({ default: m.CompanyPage })))
const Tracks = lazy(() => import('./pages/Tracks').then((m) => ({ default: m.Tracks })))
const TrackPage = lazy(() => import('./pages/Tracks').then((m) => ({ default: m.TrackPage })))
const TopicPage = lazy(() => import('./pages/Topic').then((m) => ({ default: m.TopicPage })))

const Questions = lazy(() => import('./pages/Questions'))
const Problems = lazy(() => import('./pages/Problems'))
const ProblemPage = lazy(() => import('./pages/ProblemPage'))
const Sql = lazy(() => import('./pages/Sql'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Cases = lazy(() => import('./pages/Cases'))
const Mock = lazy(() => import('./pages/Mock'))
const Plan = lazy(() => import('./pages/Plan'))
const Guide = lazy(() => import('./pages/Guide'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Behavioral = lazy(() => import('./pages/Behavioral'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const About = lazy(() => import('./pages/About'))
const IwoHub = lazy(() => import('./pages/iwo/Hub'))
const IwoDiagnostic = lazy(() => import('./pages/iwo/Diagnostic'))
const IwoPlan = lazy(() => import('./pages/iwo/PlanPage'))
const IwoModule = lazy(() => import('./pages/iwo/ModulePage'))
const IwoLesson = lazy(() => import('./pages/iwo/LessonPage'))
const IwoContest = lazy(() => import('./pages/iwo/ContestList'))
const IwoContestProblem = lazy(() => import('./pages/iwo/ContestProblemPage'))
const IwoYandex = lazy(() => import('./pages/iwo/YandexBank'))
const IwoInterview = lazy(() => import('./pages/iwo/Interview'))
const IwoReview = lazy(() => import('./pages/iwo/Review'))

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="container empty">Загрузка…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:id" element={<CompanyPage />} />
            <Route path="tracks" element={<Tracks />} />
            <Route path="tracks/:id" element={<TrackPage />} />
            <Route path="topics/:id" element={<TopicPage />} />
            <Route path="questions" element={<Questions />} />
            <Route path="problems" element={<Problems />} />
            <Route path="problems/:id" element={<ProblemPage />} />
            <Route path="sql" element={<Sql />} />
            <Route path="sql/:id" element={<Sql />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="cases" element={<Cases />} />
            <Route path="cases/:id" element={<Cases />} />
            <Route path="mock" element={<Mock />} />
            <Route path="plan" element={<Plan />} />
            <Route path="guide" element={<Guide />} />
            <Route path="guide/:id" element={<Guide />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="behavioral" element={<Behavioral />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="about" element={<About />} />
            <Route path="iwo" element={<IwoHub />} />
            <Route path="iwo/diagnostic" element={<IwoDiagnostic />} />
            <Route path="iwo/plan" element={<IwoPlan />} />
            <Route path="iwo/m/:id" element={<IwoModule />} />
            <Route path="iwo/l/:id" element={<IwoLesson />} />
            <Route path="iwo/contest" element={<IwoContest />} />
            <Route path="iwo/contest/:id" element={<IwoContestProblem />} />
            <Route path="iwo/yandex" element={<IwoYandex />} />
            <Route path="iwo/interview" element={<IwoInterview />} />
            <Route path="iwo/review" element={<IwoReview />} />
            <Route path="*" element={<div className="container empty">Страница не найдена.</div>} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
