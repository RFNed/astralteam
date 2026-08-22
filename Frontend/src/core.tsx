import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'

import Main from './Pages/Main/main'
import Game from './Pages/Games/games'
import Community from './Pages/Community/community'
import News from './Pages/News/news'
import Auth from './Pages/Auth/auth'

import AuthProvider from './Contexts/authContext.tsx'

function Head() {
  return (
    <>

      <div className="head-bar">
          <Link className="logo" to="/">
              <img src="/logos/logo.png" alt="Logo" />
          </Link>

          <div className="catalogue">
              <Link to="/"><span>ЛАУНЧЕР</span></Link>
              <Link to="/games"><span>ИГРЫ</span></Link>
              <Link to="/news"><span>НОВОСТИ</span></Link>
              <Link to="/community"><span>СООБЩЕСТВО</span></Link>
          </div>

          <div className="user-circle">
              <Link to="/auth"><div className="non-registered" title="Войти"/></Link>
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
      <Route path="/games" element={<Game />} />
      <Route path="/news" element={<News />} />
      <Route path="/community" element={<Community />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

createRoot(document.getElementById('core')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Head />
        <Pages />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
