import "./head.scss"

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../../Contexts/authContext'

export default function Head() {
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
						<img src={`${AuthContext.data.avatarURL}`} style={{"visibility": `${AuthContext.Entered ? "visible" : "hidden"}`, "userSelect": "none", "WebkitUserSelect": "none"}} />
					</div>

			  	</div>
				<div className={`entered-window ${userMenu ? "open" : ""}`} ref={userWindowRef}>
					<div className="entered-window-content">
						<Link to={`/profile/${AuthContext.data.id}`} onClick={handleClick}>
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