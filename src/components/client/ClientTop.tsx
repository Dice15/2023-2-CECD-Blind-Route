import { useNavigate } from "react-router-dom";
import { UserRole } from "../../cores/types/UserRole";
import style from "./ClientTop.module.css"

export interface ClientTopProps {
    userRole: UserRole;
}

export default function ClientTop({ userRole }: ClientTopProps) {
    const history = useNavigate();

    const moveToHome = () => {
        history("/home");
    }

    return (
        <div className={style.homeTop}>
            <h1 className={style.homeTop__title} onClick={() => { moveToHome(); }} >{`Blind Route (${userRole})`}</h1>
        </div>
    )
}