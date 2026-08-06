import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Main from './Main/main'
import Game from './Games/games'
import Community from './Community/community'
import News from './News/news'

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
            <div className="non-registered">
              АККАУНТ
            </div>
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
    </Routes>
  )
}

createRoot(document.getElementById('core')!).render(
  <StrictMode>
    <BrowserRouter>
      <Head />
      <Pages />
    </BrowserRouter>
  </StrictMode>,
)
