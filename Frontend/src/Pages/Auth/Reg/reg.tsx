import { useLoaded } from "../../../Contexts/loadContext";
import "./reg.css"
import { useState } from "react"
export default function Reg() {
    const { IsLoadedScreen, SetIsLoadedScreen, SetTextLoadingScreen } = useLoaded()
    const [Email, SetEmail] = useState<string>("");

    console.log(IsLoadedScreen)

    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms))
    const littleFunction = async () => {
        SetIsLoadedScreen(true)
        await sleep(3000)
        SetIsLoadedScreen(false)
    }
    return (
        <>
        
        <div className="reg-box">
            <span className="reg-title">Регистрация</span>
            <div className="reg-form">
                <input type="text" placeholder="почта" value={Email} onChange={(e) => SetEmail(e.target.value)}/>
                <input type="text" placeholder="логин" />
                <input type="password" placeholder="пароль" />
                <input type="password" placeholder="повторите пароль" />
                <button onClick={littleFunction}>отправить</button>
            </div>
            <img src="/icons/other/registartion.svg" className="reg-icon" />
        </div>
        
        </>
    )
}