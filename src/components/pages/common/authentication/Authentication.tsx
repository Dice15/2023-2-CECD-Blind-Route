import styles from "./Authentication.module.css"
import { redirectToAccountLogin, redirectToLogout } from "../../../../cores/api/blindrouteClient";
import { UserRole } from "../../../../cores/types/UserRole";
import React, { useCallback, useEffect, useState } from "react";
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
    type PageState = "requestAuthenticate";


    /** 인증 시도 */
    const onAuthenticate = useCallback(() => {
        const pageState: PageState = "requestAuthenticate";
        sessionStorage.setItem("pageState", pageState);
        redirectToAccountLogin(userRole);
    }, [userRole]);



    /** 인증을 시도한 뒤에만 인증이 되었는지 확인 */
    useEffect(() => {
        const savedState: PageState = sessionStorage.getItem("pageState") as PageState;
        if (savedState === "requestAuthenticate") {
            updateAuthentication(authentication, {
                succeededAuthentication: () => {
                    history("/home");
                    sessionStorage.removeItem("pageState");
                },
                failedAuthentication: () => {
                    alert("로그인에 실패했습니다.");
                    history("/home");
                    sessionStorage.removeItem("pageState");
                }
            });
        } else {
            onAuthenticate();
        }
    }, [authentication, history, onAuthenticate]);


    return (
        <div>

        </div>
    )
}
