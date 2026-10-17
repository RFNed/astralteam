import './index.scss'

/* Important Imports */
import { AnimatePresence, motion } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { HelmetProvider} from 'react-helmet-async';

/* Pages */

import Main from './Pages/Main/main'
import Game from './Pages/Games/games'
import Community from './Pages/Community/community'
import News from './Pages/News/news'
import Auth from './Pages/Auth/auth'
import Reg from './Pages/Auth/Reg/reg'
import RegEmailNotify from './Pages/Auth/Reg/Email/regemailnotify';
import Profile from './Pages/Profile/profile'

/* Special Pages */

import VerifyEmail from './Pages/Special/VerifyEmail/verifyemail';
import Topup from './Pages/Special/Balance/Topup/topup'
import NotFound from './Pages/Special/NotFound/notfound'
import Head from './Pages/Special/Head/head'

/* Providers */

import LoadProvider from './Contexts/loadContext'
import AuthProvider from './Contexts/authContext'

/* ------------------------------------------------------- */

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
			<Route path="/profile/:token" element={<Profile />} />
			<Route path="/balance" element={<Topup />} />
			<Route path="*" element={<NotFound />} />
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
