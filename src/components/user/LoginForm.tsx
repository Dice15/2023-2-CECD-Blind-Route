import styles from "./LoginForm.module.css"
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function LoginForm() {
    /*  const onLogin = () => {
          window.location.href = "https://blindroute-springboot.koyeb.app/oauth2/authorization/google";
      };*/

    /*const onLogin = useGoogleLogin({
        scope: "email profile",
        onSuccess: async ({ code }) => {
            axios
                .post("https://blindroute-springboot.koyeb.app/oauth2/authorization/google", { code })
                .then(({ data }) => {
                    console.log(data);
                });
        },
        onError: (errorResponse) => {
            console.error(errorResponse);
        },
        flow: "auth-code",
    });*/

    const onLogin = useGoogleLogin({
        onSuccess: async (res) => {
            console.log(res.access_token);
            await axios({
                method: "post",
                url: "https://blindroute-springboot.koyeb.app/oauth2/authorization/google",
                data: { access_token: res.access_token },
            }).then((res) => {
                console.log(res);
            }).catch((e) => console.log(e));
        }
    });

    const onLogout = () => {
        window.location.href = "https://blindroute-springboot.koyeb.app/logout";
    };



    return (
        <form className={styles.login_form} action="">
            <div className={styles.login_form__alert}>
                <div className={styles.login_form__button_field}>
                    <button className={styles.login_form__button} type="button" onClick={() => onLogin()}>로그인</button>
                    <button className={styles.login_form__button} type="button" onClick={onLogout}>로그아웃</button>
                </div>
            </div>
        </form>
    )
}