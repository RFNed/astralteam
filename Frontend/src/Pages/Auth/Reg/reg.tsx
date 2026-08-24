import { Link } from "react-router-dom"
import "./reg.css"

export default function Reg() {
    return (
        <>
        
        <div className="reg-box">
            <span className="reg-title">😼 Установите лаунчер для регистрации
                <span className="reg-description">Получите больше возможностей с лаунчером!</span>
            </span>
            <Link to="/"><div className="reg-back download">Скачать лаунчер</div></Link>
            <Link to="/auth"><div className="reg-back">Войти в аккаунт</div></Link>
        </div>
        
        </>
    )
}