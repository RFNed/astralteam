import './index.css'

/* Important Imports */

import { AnimatePresence, motion } from 'motion/react'
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async';

/* Pages */

import Main from './Pages/Main/main'
import Game from './Pages/Games/games'
import Community from './Pages/Community/community'
import News from './Pages/News/news'
import Auth from './Pages/Auth/auth'
import Reg from './Pages/Auth/Reg/reg.tsx'

/* Providers */

import AuthProvider, { useAuth } from './Contexts/authContext.tsx'
import LoadProvider from './Contexts/loadContext.tsx'
import RegEmailNotify from './Pages/Auth/Reg/Email/regemailnotify.tsx';
import VerifyEmail from './Pages/Special/VerifyEmail/verifyemail.tsx';

/* ------------------------------------------------------- */


function Head() {
  const [HiddenHeadBar, setHiddenHeadBar] = useState<boolean>(false);

  const AuthContext = useAuth()
  useEffect(() => {
    let lastScroll = window.scrollY
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 150)
      {
        setHiddenHeadBar(true);
      } else {
        setHiddenHeadBar(false);
      }

      console.log(currentScroll)
      lastScroll = currentScroll;
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {

  }, [AuthContext.AuthLoading])

  return (
    <>
      <header>
        <Helmet defaultTitle='Astral Team' />
          <div className={`head-bar ${HiddenHeadBar ? "hidden" : ""}`}>
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
                  <Link to="/auth" style={{"visibility": `${(!AuthContext.Entered) ? "visible" : "hidden"}`}}><div className="non-registered" style={{"visibility": `${(!AuthContext.Entered) ? "visible" : "hidden"}`}} title="Войти"/></Link>
                  <div className="entered" style={{"visibility": `${AuthContext.Entered ? "visible" : "hidden"}`}}><img src="http://127.0.0.1:8000/assets/avatars/no_avatar.png" style={{"visibility": `${AuthContext.Entered ? "visible" : "hidden"}`}} /></div>
              </div>
          </div>
      </header>

    </>
  )
}

function Pages() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname + location.search}
        initial={{ opacity: 0, y: -8, filter: "blur(7px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 14, filter: "blur(14px)" }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Main />} />
          <Route path="/games" element={<Game />} />
          <Route path="/news" element={<News />} />
          <Route path="/community" element={<Community />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/registration" element={<Reg />} />
          <Route path="/registration/mail" element={<RegEmailNotify />} />
          <Route path="/registration/verify/:token" element={<VerifyEmail />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

createRoot(document.getElementById('core')!).render(
  <StrictMode>
    <LoadProvider>
      <AuthProvider>
        <HelmetProvider>
          <BrowserRouter>
            <Head />
            <Pages />
          </BrowserRouter>
        </HelmetProvider>
      </AuthProvider>
    </LoadProvider>
  </StrictMode>,
)
