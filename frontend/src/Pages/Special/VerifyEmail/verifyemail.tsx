import "./verifyemail.css"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { verifyEmail } from "../../../Api/client"
import { APIError } from "../../../Api/class/APIError";


const ERROR_MESSAGES: Record<string, string> = {
    "INVALID_TOKEN": "Токена не существует",
}

export default function VerifyEmail() {
    const { token } = useParams<string>()
    const [EmailNotificationVisible, SetEmailNotificationVisible]= useState<boolean>(true)
    const [EmailNotificationTitle, SetEmailNotificationTitle] = useState<string>("")
    const [EmailNotificationMessage, SetEmailNotificationMessage] = useState<string>("")
    const navigate = useNavigate()

    const VerifyEmail = async () => {
        if (!token) {
            navigate("/")
            return
        }
        try {
            const response = await verifyEmail(token)
            if (response.detail.code === "SUCCESS")
            {
                SetEmailNotificationVisible(true)
                SetEmailNotificationTitle("ГОТОВО")
                SetEmailNotificationMessage("Почта подтверждена, вы можете закрыть страницу и войти в аккаунт")
            }
        } catch (error) {
            if (error instanceof APIError) {
                let message = ERROR_MESSAGES[error.code]
                if (!message) {
                    message = error.status === 500
                        ? "Ошибка сервера, попробуйте позже"
                        : "Неизвестная ошибка"
                }
                navigate("/")
            } else {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        VerifyEmail()
    }, [])

    return (
        <>

        <div className={`verify-email ${EmailNotificationVisible ? "visible" : ""}`}>
            <span className="verify-email-title">
                {EmailNotificationTitle}
            </span>
            <span className="verify-email-message">
                {EmailNotificationMessage}
            </span>
        </div>

        </>
    )
}