import styles from "./LoginForm.module.css"
import { onLogin, onLogout } from "../../../../cores/api/blindrouteClient";
import { UserRole } from "../../../../cores/types/UserRole";


/** 로그인 폼 프로퍼티 */
export interface LoginFormProps {
    userRole: UserRole;
}


/** 로그인 폼 */
export default function LoginForm({ userRole }: LoginFormProps) {

    return (
        <form className={styles.LoginForm} action="">
            <div className={styles.login_form}>
                <div className={styles.login_form__button_field}>
                    <button className={styles.login_form__button} type="button" onClick={() => { onLogin(userRole) }} style={{ marginRight: "4px" }}>로그인</button>
                    <button className={styles.login_form__button} type="button" onClick={() => { onLogout(userRole) }}>로그아웃</button>
                </div>
            </div>
        </form>
    )
}