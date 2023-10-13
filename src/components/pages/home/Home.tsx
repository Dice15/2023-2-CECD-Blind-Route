import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../cores/types/UserRole";
import { AuthenticationActionType } from "../common/authentication/Authentication";
import React, { useEffect, useState } from "react";
import { AppType } from "../../../cores/types/AppType";
import { AuthSessionApi, checkAuthSession } from "../../../cores/api/blindrouteClient";


/** 홈 페이지 프로퍼티 */
export interface HomeProps {
    appType: AppType;
    userRole: UserRole;
    setAuthenticationActionType: React.Dispatch<React.SetStateAction<AuthenticationActionType>>;
}



/** 홈 페이지 */
export default function Home({ userRole, appType, setAuthenticationActionType }: HomeProps) {
    /* const */
    const history = useNavigate();


    // state
    const [authenticationState, setAuthenticationState] = useState<boolean>(false);


    /** 로그인 인증 페이지로 이동 */
    const moveToAuthentication = (actionType: AuthenticationActionType) => {
        setAuthenticationActionType(actionType);
        history("/authentication");
    };


    /** 앱 페이지로 이동 */
    const moveToApp = (appType: AppType) => {
        history(`/${appType}`);
    }


    /**  */
    useEffect(() => {
        const checkAuth = async () => {
            setAuthenticationState((await checkAuthSession(userRole)).sessionActive);
        };
        checkAuth();
    }, [userRole]);



    return (
        <div className={style.Home}>
            <div className={style.header}>
                <h1 className={style.header__title}>{`Blind Route (${appType}-${userRole})`}</h1>
            </div>
            <div className={style.body}>
                <div className={style.authentication}>
                    {authenticationState === false
                        ? (<>
                            <button className={style.login_button} type="button" onClick={() => { moveToAuthentication("login"); }}>로그인</button>
                            <button className={style.login_button} type="button" onClick={() => { }}>회원가입</button>
                        </>
                        )
                        : (<>
                            <button className={style.login_button} type="button" onClick={() => { moveToApp(appType); }}>시작하기</button>
                            <button className={style.signin_button} type="button" onClick={() => { moveToAuthentication("logout"); }}>로그아웃</button>
                        </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}