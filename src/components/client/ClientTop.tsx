import style from "./ClientTop.module.css"
import LoginForm from "../user/LoginForm";

export default function HomeTop() {
    return (
        <div className={style.homeTop}>
            <LoginForm />
            <h1 className={style.homeTop__title}>{"Blind Route"}</h1>
        </div>
    )
}