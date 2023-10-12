import styles from "./Authentication.module.css"
import { checkAuthSession, redirectToAccountLogin, redirectToAccountLogout } from "../../../../cores/api/blindrouteClient";
import { UserRole } from "../../../../cores/types/UserRole";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



/** 로그인 폼 프로퍼티 */
export interface AuthenticationProps {
    userRole: UserRole;
    actionType: AuthenticationActionType;
    authentication: { state: AuthenticationState, setState: React.Dispatch<React.SetStateAction<AuthenticationState>> };
}



/** 인증 상태를 나타내는 타입 */
export type AuthenticationState = "Authenticated" | "Unauthenticated";



/** 인증 동작 유형을 나타내는 타입
 * 
 * login: 로그인 동작
 * 
 * logout: 로그아웃 동작
 * 
 */
export type AuthenticationActionType = "login" | "logout";




/** 인증 상태 검증하는 함수 */
export function updateAuthentication(
    actionType: AuthenticationActionType,
    authentication: { state: AuthenticationState; setState: React.Dispatch<React.SetStateAction<AuthenticationState>> },
    callback: () => void
) {
    // TODO: 인증 체크

    switch (actionType) {
        case "login": {
            authentication.setState("Authenticated");
            break;
        }
        case "logout": {
            authentication.setState("Unauthenticated");
            break;
        }
    }

    callback();
}



/** 로그인 인증 페이지 */
export default function Authentication({ userRole, actionType, authentication }: AuthenticationProps) {
    /* const */
    const history = useNavigate();


    /** state */
    const [loadingText, setLoadingText] = useState("로그인중");


    /** 로그인 시도 */
    const onLogin = (userRole: UserRole, actionType: AuthenticationActionType) => {
        sessionStorage.setItem("pageState", actionType);
        redirectToAccountLogin(userRole);
    };

    /** 로그아웃 시도 */
    const onLogout = (userRole: UserRole, actionType: AuthenticationActionType) => {
        sessionStorage.setItem("pageState", actionType);
        redirectToAccountLogout(userRole);
    };



    /** 인증을 시도한 뒤에만 인증이 되었는지 확인 */
    /*useEffect(() => {
        const pageState = sessionStorage.getItem("pageState");

        if (pageState === actionType) {
            updateAuthentication(actionType, authentication, () => {
                sessionStorage.removeItem("pageState");
                //history("/home");
            });
        } else {
            actionType === "login"
                ? onLogin(userRole, actionType)
                : onLogout(userRole, actionType);
        }

    }, [userRole, actionType, authentication, history]);*/


    useEffect(() => {
        const checkAuth = async () => {

            console.log(await checkAuthSession(userRole));
        }
        checkAuth();

    }, [userRole]);




    /** 로그인 중 이벤트 */
    useEffect(() => {
        const interval = setInterval(() => {
            switch (loadingText) {
                case "로그인중":
                    setLoadingText("로그인중.");
                    break;
                case "로그인중.":
                    setLoadingText("로그인중..");
                    break;
                case "로그인중..":
                    setLoadingText("로그인중...");
                    break;
                case "로그인중...":
                    setLoadingText("로그인중");
                    break;
                default:
                    setLoadingText("로그인중");
            }
        }, 500);

        return () => clearInterval(interval);
    }, [loadingText]);



    return (
        <div className={styles.container}>
            <span className={styles.loadingText}>{loadingText}</span>
        </div>
    );

}
