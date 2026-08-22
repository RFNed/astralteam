import { useState } from "react";
import "./auth.css"

export default function Auth() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        if (login.trim() === "" || password.trim() === "") {
            alert("Пожалуйста, заполните все поля.");
            return;
        }
    };

    return (
        <>
        
        <div className="auth">
            <div className="auth-input">
                
                <span>Авторизация</span>
                <input type="text" placeholder="Логин" maxLength={36} value={login} onChange={(e) => setLogin(e.target.value)} />
                <input type="password" placeholder="Пароль" maxLength={100} value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={handleLogin}>Войти</button>
            </div>
            <div className="reg-input">
                <span>Нет аккаунта?</span>
                <button>Зарегистрироваться</button>
            </div>
            <div className="auth-right-page">
                <img src="/pics/astralcat.png" />
                <span>Со входом — больше возможностей! 😼</span>
            </div>
        </div>
        
        </>
    )
}