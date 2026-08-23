import { useState } from "react";
import "./auth.css"

export default function Auth() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [NotifyBoxText, setNotifyBoxText] = useState<string>("");
    const [VisibleBoxText, setVisibleBoxText] = useState<boolean>(false);
    const [IsNotifyError, setIsNotifyError] = useState<boolean>(false); 

    const handleLogin = async () => {
        if (login.trim() === "" || password.trim() === "") {
            setNotifyBoxText("Введите все поля")
            setVisibleBoxText(true)
            setIsNotifyError(false)
            return
        }

        setNotifyBoxText("Неверный логин или пароль")
        setVisibleBoxText(true)
        setIsNotifyError(true)
    };

    return (
        <>
        
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

            <div className="reg-input">
                <span>Нет аккаунта?</span>
                <button>Зарегистрироваться</button>
            </div>

            <div className="auth-right-page">
                <img src="/pics/astralcat.png" />
                <span>Со входом — больше возможностей!</span>
            </div>

        </div>
        
        </>
    )
}