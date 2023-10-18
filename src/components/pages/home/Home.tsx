import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../cores/types/UserRole";
import { AuthenticationActionType } from "../common/authentication/Authentication";
import React, { useEffect, useState } from "react";
import { AppType } from "../../../cores/types/AppType";
import { checkAuthSession } from "../../../cores/api/blindrouteClient";



/** 홈 페이지 프로퍼티 */
export interface HomeProps {
    userRole: UserRole;
    appType: AppType
    authenticationActionType: AuthenticationActionType;
    setAuthenticationActionType: React.Dispatch<React.SetStateAction<AuthenticationActionType>>;
}



/** 홈 페이지 */
export default function Home({ userRole, appType, authenticationActionType, setAuthenticationActionType }: HomeProps) {
    /* const */
    const history = useNavigate();


    // state
    const [authenticationState, setAuthenticationState] = useState<boolean | undefined>(undefined);



    /** 앱 페이지로 이동 */
    const moveToApp = (appType: AppType) => {
        history(`/${appType}`);
    }



    /** 인증 요청 시 인증 액션타입 설정 */
    const onAuthentication = (actionType: AuthenticationActionType) => {
        setAuthenticationActionType(actionType);
    };



    /** 페이지 로딩 시 인증 상태 확인 */
    useEffect(() => {
        const checkAuth = async () => {
            setAuthenticationState((await checkAuthSession(userRole)));
        };
        checkAuth();
    }, [userRole]);



    /** 페이지 로딩 시 인증 액션 상태 "idle" */
    useEffect(() => {
        setAuthenticationActionType("idle");
    }, [setAuthenticationActionType]);


    /** 인증 페이지로 이동 */

    useEffect(() => {
        if (authenticationActionType !== "idle") {
            history("/authentication");
        }
    }, [authenticationActionType, setAuthenticationActionType, history]);



    return (
        <div className={style.Home}>
            <div className={style.header}>
                <h1 className={style.header__title}>{`Blind Route (${appType}-${userRole})`}</h1>
            </div>
            <div className={style.body}>
                <div className={style.authentication}>
                    {authenticationState !== undefined && (authenticationState === false
                        ? (<>
                            <button className={style.login_button} type="button" onClick={() => { onAuthentication("login"); }}>로그인</button>
                            <button className={style.login_button} type="button" onClick={() => { }}>회원가입</button>
                        </>
                        )
                        : (<>
                            <button className={style.login_button} type="button" onClick={() => { moveToApp(appType); }}>시작하기</button>
                            <button className={style.signin_button} type="button" onClick={() => { onAuthentication("logout"); }}>로그아웃</button>
                        </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}