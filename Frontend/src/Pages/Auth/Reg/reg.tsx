import "./reg.css"

import { Helmet } from "react-helmet-async";
import { useState } from "react"

import { register } from "../../../Api/client";
import { useLoaded } from "../../../Contexts/loadContext";
import { sleep, IS_DEBUG } from "../../../Modules/other";
import { APIError } from "../../../Api/class/APIError";

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_EMAIL: "Электронная почта не валидна, или занята",
    USERNAME_TAKEN: "Пользователь с таким логином/почтой уже существует",
    REGDATA_REQUIRED: "Заполните данные в поля"
}

export default function Reg() {
    const { IsLoadedScreen, SetIsLoadedScreen } = useLoaded()
    
    const [Email, SetEmail] = useState<string>("")
    const [Username, SetUsername] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")
    const [TwoPassword, SetTwoPassword] = useState<string>("")

    const [NotifyBoxText, setNotifyBoxText] = useState<string>("");
    const [VisibleBoxText, setVisibleBoxText] = useState<boolean>(false);
    const [IsNotifyError, setIsNotifyError] = useState<boolean>(false); 

    const handle_data = () => {
        if (Email.trim() && Username.trim() && Password.trim())
            return true
        else
            return false
    }

    const handle_reg = async () => {
        if (!IsLoadedScreen)
        {
            if (Email.trim() && Username.trim() && Password.trim())
            {
                if (TwoPassword === Password)
                {

                    SetIsLoadedScreen(true)
                    {await sleep(500)}
                    try {
                        const result = await register({ email: Email, username: Username, password: Password })
                        if (result.detail.code === "SUCCESS")
                        {
                            if (IS_DEBUG)
                                await sleep(1500)
                            setNotifyBoxText("Успешно")
                            setIsNotifyError(false)
                            setVisibleBoxText(true)
                        }
                    } catch (error) {
                        if (error instanceof APIError)
                        {
                            let message = ERROR_MESSAGES[error.code]
                            if (!message) {
                                message = error.status === 500
                                    ? "Ошибка сервера, попробуйте позже"
                                    : "Неизвестная ошибка"
                            }
                            setNotifyBoxText(message)
                            setIsNotifyError(true)
                            setVisibleBoxText(true)
                        } else {
                            console.log(error)
                            setNotifyBoxText("Непредвиденная ошибка, взгляните в консоль!")
                            setVisibleBoxText(true)
                        }
                        
                    }
                    
                    SetIsLoadedScreen(false)
                    } 
                else {
                    setNotifyBoxText("Пароли не совпадают")
                    setIsNotifyError(true)
                    setVisibleBoxText(true)
                }

            } else {
                setNotifyBoxText("Введите данные в поля")
                setIsNotifyError(false)
                setVisibleBoxText(true)
            }
        }
    }
    return (
        <>
        <Helmet>
            <title>Регистрация</title>
        </Helmet>
        
        <div className="reg-box">
            <span className="reg-title">Регистрация</span>
            <div className="reg-form">
                <input type="text" placeholder="почта" value={Email} onChange={(e) => {SetEmail(e.target.value); setVisibleBoxText(false)} } />
                <input type="text" placeholder="логин" value={Username} onChange={(e) => {SetUsername(e.target.value); setVisibleBoxText(false)}}/>
                <input type="password" placeholder="пароль" value={Password} onChange={(e) => {SetPassword(e.target.value); setVisibleBoxText(false)}}/>
                <input type="password" placeholder="повторите пароль" value={TwoPassword} onChange={(e) => {SetTwoPassword(e.target.value); setVisibleBoxText(false)}}/>
                <button onClick={handle_reg} className={handle_data() ? "reg-valid" : "reg-invalid"}>отправить</button>
                <div className={`reg-info ${VisibleBoxText ? "visible" : ""}`}  style={{
                    "backgroundColor": IsNotifyError ? "rgba(228, 13, 13, 0.712)" : "rgba(238, 147, 11, 0.71)",
                    "filter": IsNotifyError ? "drop-shadow(0px 0px 20px rgb(238, 10, 10))" : "drop-shadow(0px 0px 20px rgb(255, 187, 0))"
                }}>
                    {NotifyBoxText}
                </div>
            </div>
            <img src="/icons/other/registartion.svg" className="reg-icon" />
        </div>
        
        </>
    )
}