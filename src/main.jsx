import { StrictMode, Suspense } from 'react' // 1. Importar Suspense
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { MainProvider } from './context/MainContext.jsx'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'

// Preparamos la ruta base asegurando que termine en '/'
const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

i18next
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: `${baseUrl}translations/{{lng}}.json`
    },
    react: {
      useSuspense: false // Evita fallos si la app renderiza antes de terminar el fetch
    }
  })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Cargando...</div>}>
      <MainProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </MainProvider>
    </Suspense>
  </StrictMode>
)