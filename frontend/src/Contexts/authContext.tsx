import { createContext, useState, useContext, type ReactNode, type SetStateAction, useEffect } from "react";
import { parseBySession } from "../Api/client";
import { APIError } from "../Api/class/APIError";

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_SESSION: "Сессия не валидна",
    NOT_EXISTS_SESSION: "Сессия не существует"
}

interface AuthContextType {
    Nickname: string,
    setNickname: React.Dispatch<SetStateAction<any>>,
    AvatarURL: string,
    setAvatarURL: React.Dispatch<SetStateAction<any>> ,
    AuthLoading: boolean,
    Entered: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode })
{
    const [Nickname, setNickname] = useState<string>("")
    const [AvatarURL, setAvatarURL] = useState<string>("")
    const [Entered, setEntered] = useState<boolean>(false)
    const [AuthLoading, SetAuthLoading] = useState<boolean>(true)

    useEffect(() => {
        const Loader = async () => {
            try {
                await parseBySession()
                setEntered(true)
            } catch (error) {
                if (error instanceof APIError)
                {
                    let message = ERROR_MESSAGES[error.code]
                    if (!message) {
                        message = error.status === 500
                                ? "Ошибка сервера"
                                : "Неизвестная ошибка"
                    }
                    console.log(message)
                }
            }
            SetAuthLoading(false)
        }
        Loader()
    }, [])

    return (
        <AuthContext.Provider value={{ Nickname, setNickname, AvatarURL, setAvatarURL, AuthLoading, Entered }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth()
{
    const context = useContext(AuthContext)
    if (context === null)
    {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context;
}