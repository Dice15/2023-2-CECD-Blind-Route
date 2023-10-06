import styles from "./Authentication.module.css"
import { redirectToAccountLogin, redirectToLogout } from "../../../../cores/api/blindrouteClient";
import { UserRole } from "../../../../cores/types/UserRole";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


/** 로그인 폼 프로퍼티 */
export interface AuthenticationProps {
    userRole: UserRole;
    authentication: { state: AuthenticationState, setState: React.Dispatch<React.SetStateAction<AuthenticationState>> };
}



/** 인증 상태를 나타내는 타입 */
export type AuthenticationState = "Authenticated" | "Unauthenticated";



/** 인증 상태 검증하는 함수 */
export function updateAuthentication(
    authentication: { state: AuthenticationState; setState: React.Dispatch<React.SetStateAction<AuthenticationState>> },
    callback: { succeededAuthentication: () => void, failedAuthentication: () => void }
) {
    let elapsedTime = 0;

    const interval = setInterval(() => {
        /* JSESSIONID 쿠키가 존재하는지로 인증 유무 확인 */
        if (document.cookie.includes('JSESSIONID')) {
            authentication.setState("Authenticated");
            clearInterval(interval);

            callback.succeededAuthentication();
        } else {
            elapsedTime += 500;
            if (elapsedTime >= 3000) {
                authentication.setState("Unauthenticated");
                clearInterval(interval);

                callback.failedAuthentication();
            }
        }
    }, 500);
}





/** 로그인 인증 페이지 */
export default function Authentication({ userRole, authentication }: AuthenticationProps) {
    /* const */
    const history = useNavigate();


    /** state */
    const [pageState, setPageState] = useState<"init" | "authenticating" | "redirected">("init");


    /** 인증 시도 */
    const onAuthenticate = async () => {
        redirectToAccountLogin(userRole);
        setPageState("authenticating");
    };


    /** 페이지 로딩 시 리디렉션 여부 확인 */
    useEffect(() => {
        console.log("Checking for redirected hash...");
        if (window.location.hash.includes("#redirected")) {
            console.log("Redirected hash found!");
            setPageState("redirected");
        } else {
            console.log("Redirected hash not found!");
        }
    }, []);



    /** 인증을 시도한 뒤에만 인증이 되었는지 확인 */
    useEffect(() => {
        if (pageState === "redirected") {
            updateAuthentication(authentication, {
                succeededAuthentication: () => {
                    history("/home");
                },
                failedAuthentication: () => {
                    alert("로그인에 실패했습니다.");
                    history("/home");
                }
            });
        }
    }, [pageState, authentication, history]);


    return (
        <form className={styles.LoginForm} action="">
            <div className={styles.login_form}>
                <div className={styles.login_form__button_field}>
                    <button className={styles.login_form__button} type="button" onClick={onAuthenticate} style={{ marginRight: "4px" }}>로그인</button>
                    <button className={styles.login_form__button} type="button" onClick={() => { redirectToLogout(userRole) }}>회원가입</button>
                </div>
            </div>
        </form>
    )
}
