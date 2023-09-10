import styles from "./LoginForm.module.css"

export default function LoginForm() {
    const onLogin = () => {
        window.location.href = "https://blindroute-springboot.koyeb.app/oauth2/authorization/google";
    };

    const onLogout = () => {
        window.location.href = "https://blindroute-springboot.koyeb.app/logout";
    };

    // const onLoadStation = async () => {
    //     try {
    //         const data = qs.stringify({ searchKeyword: '서울' });
    //         const response = await axios.post(
    //             "https://blindroute-springboot.koyeb.app/search/station",
    //             data,
    //             {
    //                 headers: {
    //                     "Content-Type": "application/x-www-form-urlencoded"
    //                 },
    //                 withCredentials: true
    //             }
    //         );

    //         console.log(response.data);

    //     } catch (error) {
    //         console.error("Search request failed:", error);
    //     }
    // };

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

   //https://blindroute.web.app//search/station?searchKeyword=서울