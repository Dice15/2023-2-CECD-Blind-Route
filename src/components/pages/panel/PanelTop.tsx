import { useNavigate } from "react-router-dom";
import style from "./PanelTop.module.css";
import { UserRole } from "../../../cores/types/UserRole";

export interface PanelTopProps {
    userRole: UserRole;
}

export default function PanelTop({ userRole }: PanelTopProps) {
    const history = useNavigate();

    const moveToHome = () => {
        history("/home");
    }

    return (
        <div className={style.PanelTop}>
            <h1 className={style.panelTop__title} onClick={() => { moveToHome(); }} >{`Blind Route (${userRole})`}</h1>
        </div>
    )
}