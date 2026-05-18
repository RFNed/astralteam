import { useEffect, useState } from "react"
import { socialLinks } from "../../api/socialLinks"

export default function Main()
{
    const [githubUrl, setGithubUrl] = useState<string>("")
    useEffect(() => {
        const links = async() => {

            const data = await socialLinks()
            setGithubUrl(data.github)

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


            </div>
        </div>

        </>
    )
}