import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../cores/types/UserRole";
import style from "./ClientTop.module.css"



/** ClientTop 컴포넌트 프로퍼티 */
export interface ClientTopProps {
    userRole: UserRole;
}



/** ClientTop 컴포넌트 */
export default function ClientTop({ userRole }: ClientTopProps) {
    const history = useNavigate();

    const moveToHome = () => {
        history("/home");
    }

    return (
        <div className={style.ClientTop}>
            <h1 className={style.client_top__title} onClick={() => { moveToHome(); }} >{`Blind Route (${userRole})`}</h1>
        </div>
    )
}