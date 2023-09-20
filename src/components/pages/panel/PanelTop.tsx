import { useNavigate } from "react-router-dom";
import style from "./PanelTop.module.css";
import { UserRole } from "../../../cores/types/UserRole";




/** PanelTop 컴포넌트 프로퍼티 */
export interface PanelTopProps {
    userRole: UserRole;
}



/** PanelTop 컴포넌트 */
export default function PanelTop({ userRole }: PanelTopProps) {
    const history = useNavigate();

    const moveToHome = () => {
        history("/home");
    }

    return (
        <div className={style.PanelTop}>
            <h1 className={style.panel_top__title} onClick={() => { moveToHome(); }} >{`Blind Route (${userRole})`}</h1>
        </div>
    )
}