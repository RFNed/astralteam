import { useEffect, useState } from "react"
import { socialLinks } from "../../api/socialLinks"
import "./Main.css"

export default function Main()
{
    const [githubUrl, setGithubUrl] = useState<string>("")
    const [TSUrl, setTSUrl] = useState<string>("")

    const CopyFunction = async(text: string, service: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            alert(`Скопировано - ${service}`)
        } catch (e)
        {
            alert(`Ошибка: ${e}`)
        }
    }

    useEffect(() => {
        const links = async() => {
            const data = await socialLinks()
            setGithubUrl(data.github)
            setTSUrl(data.ts)
        }
        links()
    }, [])

    return (
        <>
        
        <div className="main-container">
            <div className="social-links">

                <a href={githubUrl} target="_blank">
                    <div className="link">
                        <img src="/assets/images/github.png" />
                        GitHub
                    </div>
                </a>

                <div className="link" onClick={() => CopyFunction(TSUrl, "Teamspeak") }>
                    <img src="/assets/images/ts.png" />
                    TeamSpeak
                </div>
                


            </div>
        </div>

        </>
    )
}