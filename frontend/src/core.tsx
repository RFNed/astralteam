import './index.scss'

/* Important Imports */
import { AnimatePresence, motion } from 'motion/react'
import { StrictMode, useState, useEffect, useRef } from 'react'
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
import Profile from './Pages/Profile/profile.tsx'
import Topup from './Pages/Special/Balance/Topup/topup.tsx'

/* ------------------------------------------------------- */

function Head() {
  	const [HiddenHeadBar, setHiddenHeadBar] = useState<boolean>(false)
	const userCircleRef = useRef<HTMLDivElement>(null)
	const userWindowRef = useRef<HTMLDivElement>(null)
	const [userMenu, setuserMenu] = useState<boolean>(false)
  	const AuthContext = useAuth()

	const handleClick = () => {
		setuserMenu(false)
	}

  	useEffect(() => {
		let lastScroll = window.scrollY
		const handleScroll = () => {
			const currentScroll = window.scrollY;

			if (userMenu) {
				setHiddenHeadBar(false);
			} else if (currentScroll > lastScroll && currentScroll > 150) {
				setHiddenHeadBar(true);
			} else {
				setHiddenHeadBar(false);
			}

			lastScroll = currentScroll;
		};

		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}

  	}, [userMenu])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node

			const clickedUserCircle =
				userCircleRef.current?.contains(target)
 
			const clickedUserWindow =
				userWindowRef.current?.contains(target)

			if (!clickedUserCircle && !clickedUserWindow) {
				setuserMenu(false)
			}
		}

		document.addEventListener("click", handleClickOutside)

		return () => {
			document.removeEventListener("click", handleClickOutside)
		}
	}, [])


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
			  	<div className="user-circle" ref={userCircleRef}>
					
					<Link to="/auth" style={{"visibility": `${(!AuthContext.Entered) ? "visible" : "hidden"}`}}>
						<div className="non-registered" style={{"visibility": `${(!AuthContext.Entered) ? "visible" : "hidden"}`}} title="Войти"/>
					</Link>

					<div onClick={() => {
						setuserMenu(prev => !prev)
					}} className="entered" style={{"visibility": `${AuthContext.Entered ? "visible" : "hidden"}`}}>
						<img src={`${AuthContext.data.avatarURL}`} style={{"visibility": `${AuthContext.Entered ? "visible" : "hidden"}`}} />
					</div>
			  	</div>
				<div className={`entered-window ${userMenu ? "open" : ""}`} ref={userWindowRef}>
					<div className="entered-window-content">
						<Link to="/profile" onClick={handleClick}>
							<div className='entered-window-head'>
								<img src={AuthContext.data.avatarURL} className="entered-window-head-avatar"/> {AuthContext.data.username}
							</div>
						</Link>
						<div className="entered-window-buttons">
							<div className="entered-window-button-market">
								<span>Баланс</span>
								
								<div className="entered-window-button-market-balance">
									<div>eye</div>
									<div>0 ₽</div>
								</div>

								<div className="entered-window-button-market-active">

									<Link to="/balance" onClick={handleClick}>
										<div className="entered-window-button-market-active-button">
											пополнение
										</div>
									</Link>

									<div className="entered-window-button-market-active-button">
										корзина
									</div>
								</div>
							</div>
						</div>
					</div>
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
			<Route path="/profile" element={<Profile />} />
			<Route path="/balance" element={<Topup />} />
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
