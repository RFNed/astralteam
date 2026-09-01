export const IS_DEBUG = import.meta.env.VITE_DEBUG === "True" ? true : false
export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function onDevelopment() {
    return (
        <div className="on-development">
            <div className="development-cat-img">
                😼
            </div>
            <div className="development-text">
                <span>Страница в разработке</span>
            </div>
        </div>
    )
}