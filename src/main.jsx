import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MainProvider } from './context/MainContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainProvider>
    <BrowserRouter  basename="/Recipe-Calculator" >
    <App />
    </BrowserRouter>
  </MainProvider>
  </StrictMode>
)