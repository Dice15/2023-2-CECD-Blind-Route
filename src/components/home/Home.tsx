import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../cores/types/UserRole";
import LoginForm from "../common/loginform/LoginForm";
import { useEffect } from "react";


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
                <LoginForm userRole={userRole} />
                <h1 className={style.home__header__title}>{`Blind Route (${userRole})`}</h1>
            </div>
            <div className={style.home__body}>
                <button className={style.mode_select_button} type="button" onClick={() => { moveToClient(); }} >Client</button>
                <button className={style.mode_select_button} type="button" onClick={() => { moveToPanel(); }} >Panel</button>
            </div>
        </div>
    );
}