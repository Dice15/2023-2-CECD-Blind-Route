import styles from "./Authentication.module.css"
import { checkAuthSession, redirectToAccountLogin, redirectToAccountLogout } from "../../../../cores/api/blindrouteClient";
import { UserRole } from "../../../../cores/types/UserRole";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



/** 로그인 폼 프로퍼티 */
export interface AuthenticationProps {
    userRole: UserRole;
    actionType: AuthenticationActionType;
}



/** 인증 동작 유형을 나타내는 타입
 * 
 * login: 로그인 동작
 * 
 * logout: 로그아웃 동작
 * 
 */
export type AuthenticationActionType = "login" | "logout";



/** 로그인 인증 페이지 */
export default function Authentication({ userRole, actionType }: AuthenticationProps) {
    /* const */
    const history = useNavigate();


    /** state */
    const [loadingText, setLoadingText] = useState<string>("");



    /** 로그인 시도 */
    const onLogin = useCallback(async (userRole: UserRole) => {
        const isAuthenticated = (await checkAuthSession(userRole)).sessionActive;

        if (isAuthenticated === true) {
            //history("/home");
        } else {
            redirectToAccountLogin(userRole);
        }
    }, []);



    /** 로그아웃 시도 */
    const onLogout = useCallback(async (userRole: UserRole) => {
        const isAuthenticated = (await checkAuthSession(userRole)).sessionActive;

        if (isAuthenticated === false) {
            //history("/home");
        } else {
            redirectToAccountLogout(userRole);
        }
    }, []);



    /** actionType에 따른 인증 절차 수행 */
    useEffect(() => {
        console.log(actionType);
        switch (actionType) {
            case "login": {
                onLogin(userRole);
                break;
            }
            case "logout": {
                onLogout(userRole);
                break;
            }
        }
    }, [userRole, actionType, onLogin, onLogout]);



    /** 로그인 중 이벤트 */
    useEffect(() => {
        const interval = setInterval(() => {
            switch (loadingText) {
                case "":
                    setLoadingText(".");
                    break;
                case ".":
                    setLoadingText("..");
                    break;
                case "..":
                    setLoadingText("...");
                    break;
                case "...":
                    setLoadingText("");
                    break;
                default:
                    setLoadingText("");
            }
        }, 500);

        return () => clearInterval(interval);
    }, [loadingText]);



    return (
        <div className={styles.container}>
            <span className={styles.loadingText}>{`${actionType === "login" ? "로그인중" : "로그아웃중"}${loadingText}`}</span>
        </div>
    );

}
