import "./reg.css"

import { Helmet } from "react-helmet-async";
import { useState, type ChangeEvent } from "react"

import { register } from "../../../Api/client";
import { useLoaded } from "../../../Contexts/loadContext";
import { sleep, IS_DEBUG } from "../../../Modules/other";
import { APIError } from "../../../Api/class/APIError";
import { useNavigate, Navigate } from "react-router-dom";

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_EMAIL: "Электронная почта не валидна, или занята",
    USERNAME_TAKEN: "Пользователь с таким логином/почтой уже существует",
    REGDATA_REQUIRED: "Заполните данные в поля",
}
const PASSWORD_LEVELS = [
    "",
    "bad",
    "normal",
    "perfect"
]

export default function Reg() {
    const { IsLoadedScreen, SetIsLoadedScreen } = useLoaded()
    const navigate = useNavigate()

    const [Email, SetEmail] = useState<string>("")
    const [Username, SetUsername] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")
    const [TwoPassword, SetTwoPassword] = useState<string>("")

    const [NotifyBoxText, setNotifyBoxText] = useState<string>("");
    const [VisibleBoxText, setVisibleBoxText] = useState<boolean>(false);
    const [IsNotifyError, setIsNotifyError] = useState<boolean>(false); 

    const [HintPassword, setHintPassword] = useState<string[]>([]);
    const [LevelPassword, setLevelPassword] = useState<number>(0);
    const ShowNotifyBox = (text: string, isError: boolean) => {
        setNotifyBoxText(text)
        setIsNotifyError(isError)
        setVisibleBoxText(true)
    }

    const handle_password = (e: ChangeEvent<HTMLInputElement>) => {
        SetPassword(e.target.value)
        
        const password_temp = e.target.value
        
        setVisibleBoxText(false)

        const hasLetters = /[a-zA-Z]/.test(password_temp)
        const hasNumbers = /\d/.test(password_temp)
        const hasSpecial = /[^a-zA-Z0-9]/.test(password_temp)
        const hasInvalidChars = /[^\x00-\x7F]/.test(password_temp)
        const hasSpaces = /\s/.test(password_temp)
        const length = password_temp.trim().length
        const hints: string[] = [
            length < 7 && "Добавьте больше символов",
            hasSpaces && "Уберите пробелы",
            hasInvalidChars && "Используйте только латиницу",
            !hasNumbers && "Добавьте цифры",
            (!hasLetters && !hasInvalidChars) && "Добавьте латиницу",
            !hasSpecial && "Добавьте специальные символы"
        ].filter((hint): hint is string => Boolean(hint))
        setHintPassword(hints)
        
        const percentage = (100-(hints.length / 6) * 100)
        console.log(percentage)
        setLevelPassword(
            hasInvalidChars ? 1 :
            percentage < 50 ? 1 :
            percentage < 75 ? 2 :
            percentage === 100 ? 3 :
            2
        )
        console.log(LevelPassword)
    }

    const handle_data = () => {
        if (Email.trim() && Username.trim() && Password.trim())
            return true
        else
            return false
    }

    const handle_reg = async () => {
        if (IsLoadedScreen) return
        if (!(Email.trim() && Username.trim() && Password.trim()))
        {
            ShowNotifyBox("Введите все данные в поля", true)
            return
        }
        if (!(LevelPassword > 2))
        {
            ShowNotifyBox("Усложните пароль", false)
            return
        }
        if (TwoPassword !== Password)
        {
            ShowNotifyBox("Пароли не совпадают", true)
            return
        }
        if (Username.trim().length <= 6)
        {
            ShowNotifyBox("Логин должен быть более 6 символов", false)
            return
        }
        if (Password.trim().length <= 6)
        {
            ShowNotifyBox("Пароль должен быть более 6 символов", false)
            return
        }
        
        SetIsLoadedScreen(true)

        {await sleep(500)}
        try 
        {
            const result = await register({ email: Email, username: Username, password: Password })
            if (result.detail.code === "SUCCESS")
            {
                if (IS_DEBUG)
                    await sleep(1500)
                ShowNotifyBox("Успешно", false)
                navigate("/registration/mail")
                
            }
        } catch (error)
        {
            if (error instanceof APIError)
            {
                let message = ERROR_MESSAGES[error.code]
                if (!message)
                {
                    message = error.status === 500
                            ? "Ошибка сервера, попробуйте позже"
                            : "Неизвестная ошибка"
                    ShowNotifyBox(message, true)
                }
                ShowNotifyBox(message, true)
            } else {
                console.log(error)
                ShowNotifyBox("Непредвиденная ошибка, взгляните в консоль", true)
            }
        }
        SetIsLoadedScreen(false)
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
                <div className="password-wrapper">
                    <div className="password-first">
                        <input type="password" placeholder="пароль" value={Password} onChange={handle_password}/>
                        <div className={`password-hint ${PASSWORD_LEVELS[LevelPassword]}`}>
                            <div className="password-hint-info">
                                {HintPassword.length > 0 
                                ? 
                                HintPassword.map((hint, index) => (
                                    <div key={index}>• {hint}</div>
                                )) 
                                : "• Пароль безопасен"}
                            </div>
                        </div>
                    </div>
                    <input type="password" placeholder="повторите пароль" value={TwoPassword} onChange={(e) => {SetTwoPassword(e.target.value); setVisibleBoxText(false)}}/>
                    <div className="password-level"></div>
                </div>
                <button onClick={handle_reg} className={handle_data() ? "reg-valid" : "reg-invalid"}>отправить</button>
                <div className={`reg-info ${VisibleBoxText ? "visible" : ""}`}  style={{
                    
                    // Background color
                    "backgroundColor": IsNotifyError ? "rgba(228, 13, 13, 0.712)" : "rgba(238, 147, 11, 0.71)",
                    
                    // Filter
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