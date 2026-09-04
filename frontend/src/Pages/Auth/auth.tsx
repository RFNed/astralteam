import "./auth.css"

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Api/client";
import { APIError } from "../../Api/class/APIError";

const ERROR_MESSAGES: Record<string, string> = {
    INCORRECT_PASS: "Неверный пароль",
    ACCOUNT_NOT_EXISTS: "Аккаунт не существует, или не подтвержден"
}

export default function Auth() {
    const navigate = useNavigate()

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [NotifyBoxText, setNotifyBoxText] = useState<string>("");
    const [VisibleBoxText, setVisibleBoxText] = useState<boolean>(false);
    const [IsNotifyError, setIsNotifyError] = useState<boolean>(false); 

    const ShowNotifyBox = (text: string, isError: boolean) => {
        setNotifyBoxText(text)
        setIsNotifyError(isError)
        setVisibleBoxText(true)
    }

    const handleLogin = async () => {
        if (login.trim() === "" || password.trim() === "") {
            ShowNotifyBox("Введите данные", false)
            return
        }
        try 
        {
            const response = await auth({ username: login, password: password })
            if (response.detail.code === "SUCCESS")
            {
                ShowNotifyBox("Аккаунт авторизован", false)
                navigate("/")
            }
        } 
        catch (error)
        {
            if (error instanceof APIError)
            {
                let message = ERROR_MESSAGES[error.code]
                if (!message)
                {
                    message = error.status === 500
                        ? "Ошибка сервера"
                        : "Неизвестная ошибка"
                }
                ShowNotifyBox(message, true)
            } else {
                console.log(error)
            }
        }
    };

    return (
        <>
        <Helmet>
            <title>Вход</title>
        </Helmet>
        
        <div className="auth">
            <div className="auth-input">
                <div className={`auth-info ${VisibleBoxText ? "visible" : ""}`}  style={{
                        "backgroundColor": IsNotifyError ? "rgba(228, 13, 13, 0.712)" : "rgba(238, 147, 11, 0.71)",
                        "filter": IsNotifyError ? "drop-shadow(0px 0px 20px rgb(238, 10, 10))" : "drop-shadow(0px 0px 20px rgb(255, 187, 0))"
                    }}>
                    {NotifyBoxText}
                </div>
                <span>Авторизация</span>
                <input type="text" placeholder="Логин" maxLength={36} value={login} onChange={(e) => {setLogin(e.target.value); setVisibleBoxText(false)}} />
                <input type="password" placeholder="Пароль" maxLength={100} value={password} onChange={(e) => {setPassword(e.target.value); setVisibleBoxText(false)}}/>
                <button onClick={handleLogin}>Войти</button>
            </div>

            <div className="auth-reg-input">
                <span>Нет аккаунта?</span>
                <Link to="/registration"><button>Зарегистрироваться</button></Link>
            </div>

            <div className="auth-right-page">
                <img src="/pics/astralcat.png" />
                <span>Со входом — больше возможностей!</span>
            </div>

        </div>
        
        </>
    )
}