import { createContext, useContext, useState, type ReactNode, type SetStateAction } from "react";
import LoadingPage from "./LoadingPage/LoadingPage";

interface LoadContextType {
    IsLoadedScreen: boolean,
    SetIsLoadedScreen: React.Dispatch<SetStateAction<any>>,
    TextLoadingScreen: string,
    SetTextLoadingScreen: React.Dispatch<SetStateAction<string>>
}

const loadContext = createContext<LoadContextType | null>(null);

export default function LoadProvider({ children }: { children: ReactNode })
{

    const [IsLoadedScreen, SetIsLoadedScreen] = useState<boolean>(false)
    const [TextLoadingScreen, SetTextLoadingScreen] = useState<string>("")
    return (
        <loadContext.Provider value={{ IsLoadedScreen, SetIsLoadedScreen, TextLoadingScreen, SetTextLoadingScreen }}>
            <LoadingPage IsLoading={IsLoadedScreen} Text={`${TextLoadingScreen}`} />
            { children }
        </loadContext.Provider>
    )
}

export function useLoaded()
{
    const context = useContext(loadContext)
    if (context === null)
    {
        throw new Error("useLoaded must be used inside LoadProvider")
    }
    return context
}