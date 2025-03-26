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
import fr from './utilities/translations/fr.json'
import it from './utilities/translations/it.json'

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
    },
    fr: {
      translation: fr
    },
    it: {
      translation: it
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