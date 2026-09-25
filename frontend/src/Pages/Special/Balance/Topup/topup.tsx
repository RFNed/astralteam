import "./topup.scss"
import { Helmet } from "react-helmet-async"

export default function Topup() {
    return (
        <>

        <Helmet>
            <title>Пополнение счёта</title>
        </Helmet>

        <div className="topup-block">
            <div className="topup-block__header">😺 Пополните свой счет через сервис ЮKassa, используя СБП или пластиковую карту</div>
            
        </div>
        
        </>
    )
}