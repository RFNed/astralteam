import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import Main from './Main/main'

function Head() {
  return (
    <>
    
    <div className='head-bar'>
      <Link to="/" style={{"textDecoration": "none"}}><img src="/logos/logo.png"/></Link>
      <div className='catalogue'>
        <span>КАТАЛОГ</span>
        <span>НОВОСТИ</span>
        <span>О НАС</span>
        <span>WIKI</span>
      </div>
      <div className='user-circle'>
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
