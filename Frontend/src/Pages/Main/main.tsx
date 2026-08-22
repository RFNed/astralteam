import "./main.css"


export default function Main() {
    // const { nickname, setNickname } = useAuth()
    
    return (
        <>

        <div className="astral-main">
            <div className="astral-body">
                <img src="/pics/astralcat.png" id="astralcat-img" />
                <span id="astralcat-title">ASTRAL LAUNCHER</span>
                <span id="astralcat-subtitle">ИГРОВОЙ ЛАУНЧЕР</span>
                <div id="astralcat-download">
                    <img src="/icons/os/windows.svg" /> <b>Windows x64</b>
                </div>
            </div>

            <div className="astral-info">
                <div className="astral-info-title">
                    <span>Преимущества</span>
                </div>
                <div className="astral-info-item">
                    <div className="astral-info-item-avatar" /> 
                    Удобный интерфейс
                </div>

                <div className="astral-info-item">
                    <div className="astral-info-item-avatar" /> 
                    Отзывчивая служба поддержки
                </div>
                <div className="astral-info-item">
                    <div className="astral-info-item-avatar" />
                    Возврат средств, если не понравилась игра
                </div>
            </div>

        </div>
        
        </>
    )
}