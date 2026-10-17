import "./reg.scss"

import { Helmet } from "react-helmet-async";
import { useState, type ChangeEvent } from "react"

import { checkPassword, PASSWORD_LEVELS } from "../../../Api/password"
import { register } from "../../../Api/client"
import { useLoaded } from "../../../Contexts/loadContext"
import { sleep, IS_DEBUG } from "../../../Modules/other"
import { APIError } from "../../../Api/class/APIError"
import { useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../../../Contexts/authContext"

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_EMAIL: "Электронная почта не валидна, или занята",
    ACCOUNT_ALREADY_EXISTS: "Пользователь с таким логином/почтой уже существует",
    REGDATA_REQUIRED: "Заполните данные в поля",
}

export default function Reg() {
    const { IsLoadedScreen, SetIsLoadedScreen } = useLoaded()
    const navigate = useNavigate()
    const context = useAuth()
    
    const [Email, SetEmail] = useState<string>("")
    const [Username, SetUsername] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")
    const [TwoPassword, SetTwoPassword] = useState<string>("")

    const [NotifyBoxText, setNotifyBoxText] = useState<string>("")
    const [VisibleBoxText, setVisibleBoxText] = useState<boolean>(false)
    const [IsNotifyError, setIsNotifyError] = useState<boolean>(false)

    const [HintPassword, setHintPassword] = useState<string[]>([])
    const [LevelPassword, setLevelPassword] = useState<number>(0)

    const isFormFilled = Boolean(Email.trim() && Username.trim() && Password.trim())

    if (context.Entered == true) {
        return <Navigate to="/" replace />
    }

    const ShowNotifyBox = (text: string, isError: boolean) => {
        setNotifyBoxText(text)
        setIsNotifyError(isError)
        setVisibleBoxText(true)
    }

    const handle_password = (e: ChangeEvent<HTMLInputElement>) => {
        
        const password = e.target.value
        const result = checkPassword(password)

        SetPassword(password)
        setHintPassword(result.hints)
        setLevelPassword(result.level)
        setVisibleBoxText(false)

        if (IS_DEBUG)
            console.log(`Password difficulty = ${LevelPassword}`)
    }

    const validateRegistration = (): string | null => {
        if (!Email.trim() || !Username.trim() || !Password) {
            return "Введите все данные в поля"
        }

        if (LevelPassword < 3) {
            return "Усложните пароль"
        }

        if (TwoPassword !== Password) {
            return "Пароли не совпадают"
        }

        if (Username.trim().length < 5) {
            return "Логин должен быть не менее 5 символов"
        }

        if (Password.length < 7) {
            return "Пароль должен быть не менее 7 символов"
        }
        return null
    }

    const handle_reg = async () => {
        if (IsLoadedScreen) return

        const error = validateRegistration()

        if (error) {
            ShowNotifyBox(error, true)
            return;
        }

        SetIsLoadedScreen(true)

        try {
            await sleep(500);

            const result = await register({
                email: Email.trim(),
                username: Username.trim(),
                password: Password,
            });

            if (result.detail.code === "SUCCESS") {
                if (IS_DEBUG) await sleep(1500)
                ShowNotifyBox("Успешно", false)
                navigate("/registration/mail")
            }
        } catch (error) {
            if (error instanceof APIError) {
                const message =
                    ERROR_MESSAGES[error.code] ??
                    (error.status === 500
                        ? "Ошибка сервера, попробуйте позже"
                        : "Неизвестная ошибка")

                ShowNotifyBox(message, true)
            } else {
                console.error(error)
                ShowNotifyBox("Непредвиденная ошибка", true)
            }
        } finally {
            SetIsLoadedScreen(false)
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
                <button onClick={handle_reg} className={isFormFilled ? "reg-valid" : "reg-invalid"}>отправить</button>
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