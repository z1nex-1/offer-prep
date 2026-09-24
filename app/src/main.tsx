import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  const theme = localStorage.getItem('offer.theme')
  if (theme) document.documentElement.dataset.theme = theme
} catch {
  /* storage недоступен */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
