import "./LoadingPage.css"

interface LoadingPageType {
    Text: string,
    IsLoading: boolean
}

export default function LoadingPage({Text, IsLoading}: LoadingPageType)
{
    return (
        <>
        <div className={`loading-page ${IsLoading ? "visible" : ""}`}>
            <div className="loading-content">
                <div className="loading-cat">
                    <img src="/pics/astralcat.png" />
                </div>
                <div className="loading-dots">
                    <span />
                    <span />
                    <span />
                </div>
                <div className="loading-special-message">
                    {Text}
                </div>
            </div>
        </div>
        </>
    )
}