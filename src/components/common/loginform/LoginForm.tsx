import { onLogin, onLogout } from "../../../cores/api/blindrouteClient";
import { UserRole } from "../../../cores/types/UserRole";
import styles from "./LoginForm.module.css"

export interface LoginFormProps {
    userRole: UserRole;
}

export default function LoginForm({ userRole }: LoginFormProps) {

    return (
        <form className={styles.login_form} action="">
            <div className={styles.login_form__alert}>
                <div className={styles.login_form__button_field}>
                    <button className={styles.login_form__button} type="button" onClick={() => { onLogin(userRole) }} style={{ marginRight: "4px" }}>로그인</button>
                    <button className={styles.login_form__button} type="button" onClick={() => { onLogout(userRole) }}>로그아웃</button>
                </div>
            </div>
        </form>
    )
}