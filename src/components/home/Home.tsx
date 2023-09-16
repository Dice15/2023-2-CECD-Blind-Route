import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../cores/types/UserRole";
import LoginForm from "../user/LoginForm";


export interface HomeProps {
    setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}


export default function Home({ setUserRole }: HomeProps) {
    const history = useNavigate();

    const moveClient = (userRole: UserRole) => {
        setUserRole(userRole);
        history("/client");
    }

    return (
        <div className={style.Home}>
            <div className={style.home__header}>
                <LoginForm />
                <h1 className={style.home__header__title}>{"Blind Route"}</h1>
            </div>
            <div className={style.home__body}>
                <button className={style.mode_select_button} type="button" onClick={() => { moveClient(UserRole.USER) }} >Client</button>
                <button className={style.mode_select_button} type="button" onClick={() => { moveClient(UserRole.DEVELOPER) }}>Client Developer</button>
                <button className={style.mode_select_button} type="button" onClick={() => { moveClient(UserRole.USER) }} >Not Implementation</button>
                <button className={style.mode_select_button} type="button" onClick={() => { moveClient(UserRole.DEVELOPER) }}>Not Implementation</button>
            </div>
        </div>
    );
}