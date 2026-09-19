import { createContext, useState, useContext, type ReactNode, type SetStateAction, useEffect } from "react";
import { parseBySession } from "../Api/client";
import { APIError } from "../Api/class/APIError";

const IS_DEBUG = import.meta.env.VITE_DEBUG

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_SESSION: "Сессия не валидна",
    NOT_EXISTS_SESSION: "Сессия не существует"
}

interface AuthContextType {
    data: ProfileData,
    AuthLoading: boolean,
    Entered: boolean,
    setAvatarURL: React.Dispatch<SetStateAction<string>>
    loadSession: () => Promise<void>,
    setUserName: React.Dispatch<SetStateAction<string>>;
}

interface ProfileData {
    avatarURL: string,
    username: string
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode })
{
    const [username, setUserName] = useState<string>("")
    const [avatarURL, setAvatarURL] = useState<string>("")
    const [Entered, setEntered] = useState<boolean>(false)
    const [AuthLoading, SetAuthLoading] = useState<boolean>(true)
    const loadSession = async () => {
        try {
            const data = await parseBySession()
            console.log("SESSION DATA:", data);
            setUserName(data.detail.data?.username ?? "null")
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
                if (IS_DEBUG)
                    console.log(message)
            }
        }
        SetAuthLoading(false)
    }

    useEffect(() => {
        loadSession();
    }, [loadSession]);

    loadSession()

    const data: ProfileData = {
        avatarURL,
        username
    }

    return (
        <AuthContext.Provider value={{ data, setAvatarURL, setUserName, AuthLoading, Entered, loadSession }}>
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