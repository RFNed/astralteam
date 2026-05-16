import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Main from "./pages/Main/Main.tsx"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Header() {
  return(
    <>
    
    
    <header>
      <img src="/assets/images/logo.png" />
      <span>Astral Team</span>
    </header>
    </>
  )
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);