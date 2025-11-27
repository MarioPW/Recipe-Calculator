import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { MainProvider } from './context/MainContext.jsx'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './utilities/translations/es.json'
import en from './utilities/translations/en.json'

i18next.use(initReactI18next).init({
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: {
      translation: en
    },
    es: {
      translation: es
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainProvider>
      <HashRouter >
        <App />
      </HashRouter>
    </MainProvider>
  </StrictMode>
)