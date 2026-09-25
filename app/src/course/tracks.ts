import type { IwoState } from '../lib/store.ts'
import type { CourseModule, Part, Track } from './types.ts'

export interface TrackInfo {
  id: Track
  title: string
  eyebrow: string
  contestDeadline: string
  sectionsStart: string
  sectionsEnd: string
  sectionsLabel: string
  contestTasks: number
  contestHours: number
  contestAbout: string
  sectionsAbout: string
  lead: string
  mockTrack: string
  // Порядок частей курса в программе и в плане: для ML модели и метрики идут сразу после Python.
  parts: Part[]
}

// Даты и формат — со страницы yandex.ru/yaintern/intern-week-offer и страниц направлений (research/raw).
export const TRACKS: Record<Track, TrackInfo> = {
  backend: {
    id: 'backend',
    title: 'Бэкенд',
    eyebrow: 'Яндекс · Intern week offer · бэкенд · Python',
    contestDeadline: '2026-10-18',
    sectionsStart: '2026-10-26',
    sectionsEnd: '2026-10-30',
    sectionsLabel: '26–30 октября',
    contestTasks: 5,
    contestHours: 5,
    contestAbout: 'алгоритмические задачи',
    sectionsAbout: 'по 2–3 задачи и вопросы по теории, код без запуска и IDE',
    lead: 'Отбор за неделю: контест, две технические секции и встречи с командами. Здесь — вся теория с нуля, от первой программы на Python до графов и динамики, тест для определения уровня, план по дням до 18 октября и тренировка в формате Яндекс Контеста и живых секций.',
    mockTrack: 'backend',
    parts: ['start', 'python', 'algo', 'interview', 'theory'],
  },
  ml: {
    id: 'ml',
    title: 'ML',
    eyebrow: 'Яндекс · Intern week offer · машинное обучение · Python',
    contestDeadline: '2026-10-04',
    sectionsStart: '2026-10-12',
    sectionsEnd: '2026-10-16',
    sectionsLabel: '12–16 октября',
    contestTasks: 6,
    contestHours: 6,
    contestAbout: 'классическое ML и алгоритмы на коде',
    sectionsAbout: 'ML & Programming и алгоритмическое интервью — 2 задачи за 60 минут',
    lead: 'Отбор за неделю: контест из 6 задач на классическое ML и алгоритмы, секция ML & Programming, алгоритмическое интервью и встречи с командами. Здесь — Python и алгоритмы из общей части курса, математика, классические модели, метрики, нейросети и ML в коде, тест уровня, план по дням до 4 октября и задачи в формате контеста.',
    mockTrack: 'ml',
    parts: ['start', 'python', 'ml', 'algo', 'interview', 'theory'],
  },
}

export const TRACK_LIST: TrackInfo[] = [TRACKS.backend, TRACKS.ml]

export const trackOf = (iwo: IwoState): Track => iwo.track ?? 'backend'

export const inTrack = (m: Pick<CourseModule, 'tracks'>, t: Track): boolean => !m.tracks || m.tracks.includes(t)
