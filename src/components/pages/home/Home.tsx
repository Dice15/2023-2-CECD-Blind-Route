import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import LoginForm from "../common/loginform/LoginForm";
import { UserRole } from "../../../cores/types/UserRole";


export interface HomeProps {
    userRole: UserRole;
}


export default function Home({ userRole }: HomeProps) {
    const history = useNavigate();

    const moveToClient = () => {
        history("/client");
    }

    const moveToPanel = () => {
        history("/panel");
    }

    return (
        <div className={style.Home}>
            <div className={style.home__header}>
                <h1 className={style.home__header__title}>{`Blind Route (${userRole})`}</h1>
            </div>
            <div className={style.home__body}>
                <div className={style.home__body__login}>
                    <LoginForm userRole={userRole} />
                </div>
                <div className={style.home__body__device}>
                    <button className={style.mode_select_button} type="button" onClick={() => { moveToClient(); }} >Client</button>
                    <button className={style.mode_select_button} type="button" onClick={() => { moveToPanel(); }} >Panel</button>
                </div>
            </div>
        </div>
    );
}