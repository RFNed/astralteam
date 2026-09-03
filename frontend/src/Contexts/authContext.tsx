import { createContext, useState, useContext, type ReactNode, type SetStateAction } from "react";


interface AuthContextType {
    Nickname: any,
    setNickname: React.Dispatch<SetStateAction<any>>,
    AvatarURL: any,
    setAvatarURL: React.Dispatch<SetStateAction<any>> 
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode })
{
    const [Nickname, setNickname] = useState(null)
    const [AvatarURL, setAvatarURL] = useState(null)

    return (
        <AuthContext.Provider value={{ Nickname, setNickname, AvatarURL, setAvatarURL }}>
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