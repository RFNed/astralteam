import "./verifyemail.css"
import { useNavigate, useParams } from "react-router-dom"
import { verifyEmail } from "../../../Api/client"
import { APIError } from "../../../Api/class/APIError";


const ERROR_MESSAGES: Record<string, string> = {
    "INVALID_TOKEN": "Неверный токен подтверждения",
    "EXPIRED_TOKEN": "Срок действия токена истек",
    "ALREADY_VERIFIED": "Электронная почта уже подтверждена"
}

export default function VerifyEmail() {
    const { token } = useParams<string>()
    const navigate = useNavigate()
    const VerifyEmail = async () => {
        if (!token) {
            navigate("/")
            return
        }
        try {
            const response = await verifyEmail(token)
        } catch (error) {
            if (error instanceof APIError) {
                let message = ERROR_MESSAGES[error.code]
                if (!message) {
                    message = error.status === 500
                        ? "Ошибка сервера, попробуйте позже"
                        : "Неизвестная ошибка"
                }
            } else {
                console.log(error)
            }
        }
    }

    return (
        <>

        

        </>
    )
}