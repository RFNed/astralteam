import "./reg.css"

import { register } from "../../../Api/client";
import { useLoaded } from "../../../Contexts/loadContext";
import { useState } from "react"
import { sleep } from "../../../Modules/other";

export default function Reg() {
    const { IsLoadedScreen, SetIsLoadedScreen } = useLoaded()
    const [Email, SetEmail] = useState<string>("")
    const [Username, SetUsername] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")
    const handle_reg = async () => {
        if (!IsLoadedScreen)
        {
            SetIsLoadedScreen(true)
    
            await sleep(2000)
    
            try {
                await register({ email: Email, username: Username, password: Password })
            } catch (e) {
                console.log(`${e}`)
            }
            
            SetIsLoadedScreen(false)
        }
    }
    return (
        <>
        
        <div className="reg-box">
            <span className="reg-title">Регистрация</span>
            <div className="reg-form">
                <input type="text" placeholder="почта" value={Email} onChange={(e) => SetEmail(e.target.value)}/>
                <input type="text" placeholder="логин" value={Username} onChange={(e) => SetUsername(e.target.value)}/>
                <input type="password" placeholder="пароль" onChange={(e) => SetPassword(e.target.value)}/>
                <input type="password" placeholder="повторите пароль" />
                <button onClick={handle_reg}>отправить</button>
            </div>
            <img src="/icons/other/registartion.svg" className="reg-icon" />
        </div>
        
        </>
    )
}