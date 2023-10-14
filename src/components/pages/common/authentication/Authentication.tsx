import style from "./Authentication.module.css"
import { checkAuthSession, redirectToAccountLogin, redirectToAccountLogout } from "../../../../cores/api/blindrouteClient";
import { UserRole } from "../../../../cores/types/UserRole";
import { useCallback, useEffect } from "react";
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
export type AuthenticationActionType = "idle" | "login" | "logout";



/** 로그인 인증 페이지 */
export default function Authentication({ userRole, actionType }: AuthenticationProps) {
    /* const */
    const history = useNavigate();


    /** 로그인 시도 */
    const onLogin = useCallback(async (userRole: UserRole) => {
        const isAuthenticated = (await checkAuthSession(userRole)).sessionActive;

        if (isAuthenticated === true) {
            history("/home");
        } else {
            redirectToAccountLogin(userRole);
        }
    }, [history]);



    /** 로그아웃 시도 */
    const onLogout = useCallback(async (userRole: UserRole) => {
        const isAuthenticated = (await checkAuthSession(userRole)).sessionActive;

        if (isAuthenticated === false) {
            history("/home");
        } else {
            redirectToAccountLogout(userRole);
        }
    }, [history]);



    /** actionType에 따른 인증 절차 수행 */
    useEffect(() => {
        switch (actionType) {
            case "login": {
                onLogin(userRole);
                break;
            }
            case "logout": {
                onLogout(userRole);
                break;
            }
            case "idle": {
                history("/home");
                break;
            }
        }
    }, [userRole, actionType, history, onLogin, onLogout]);



    return (
        <div className={style.container}>
            <div className={style.loader}></div>
        </div>
    );
}
