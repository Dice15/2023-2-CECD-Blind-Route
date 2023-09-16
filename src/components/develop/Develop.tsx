import { useNavigate } from "react-router-dom";
import { UserRole } from "../../cores/types/UserRole"
import style from "./Develop.module.css"



export interface DevelopProps {
    setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}


export default function Develop({ setUserRole }: DevelopProps) {
    const history = useNavigate();

    const moveToClient = (userRole: UserRole) => {
        setUserRole(userRole);
        history("/home");
    }

    return (
        <div className={style.Develop}>
            <div className={style.develop__header}>
                <h1 className={style.develop__header__title}>{`Blind Route`}</h1>
            </div>
            <div className={style.develop__body}>
                <button className={style.mode_select_button} type="button" onClick={() => { moveToClient(UserRole.USER) }} >User</button>
                <button className={style.mode_select_button} type="button" onClick={() => { moveToClient(UserRole.DEVELOPER) }}>Developer</button>
            </div>
        </div>
    )
}