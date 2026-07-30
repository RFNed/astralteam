import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import Main from './Main/main'

function Head() {
  return (
    <>
    
      <div className="head-bar">
          <Link className="logo" to="/">
              <img src="/logos/logo.png" alt="Logo" />
          </Link>

          <div className="catalogue">
              <Link to="/games"><span>ИГРЫ</span></Link>
              <span>НОВОСТИ</span>
              <span>СООБЩЕСТВО</span>
              <span>WIKI</span>
          </div>

          <div className="user-circle">
              Регистрация
          </div>
      </div>
    
    </>
  )
}

function Pages() {
  const location = useLocation()
  return (
    <Routes location={location}>
      <Route path="/" element={<Main />} />
      <Route path="/games" element={<>(123)</>} />
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Head />
      <Pages />
    </BrowserRouter>
  </StrictMode>,
)
