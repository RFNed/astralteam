import "./games.css"
import { onDevelopment } from "../../Modules/other"
export default function Game() {
    return (
        <>
            {onDevelopment()}
        </>
    )
}