import styles from "./LoginForm.module.css"

export default function LoginForm() {
    const onLogin = () => {
        window.location.href = "https://blindroute-springboot.koyeb.app/oauth2/authorization/google";
    };

    const onLogout = () => {
        window.location.href = "https://blindroute-springboot.koyeb.app/logout";
    };

    return (
        <form className={styles.login_form} action="">
            <div className={styles.login_form__alert}>
                <div className={styles.login_form__button_field}>
                    <button className={styles.login_form__button} type="button" onClick={onLogin}>로그인</button>
                    <button className={styles.login_form__button} type="button" onClick={onLogout}>로그아웃</button>
                </div>
            </div>
        </form>
    )
}