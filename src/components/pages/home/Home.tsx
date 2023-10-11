import style from "./Home.module.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { UserRole } from "../../../cores/types/UserRole";
import Authentication, { AuthenticationActionType, AuthenticationState } from "../common/authentication/Authentication";
import React, { useState } from "react";
import { AppType } from "../../../cores/types/AppType";


/** 홈 페이지 프로퍼티 */
export interface HomeProps {
    appType: AppType;
    userRole: UserRole;
    authentication: { state: AuthenticationState, setState: React.Dispatch<React.SetStateAction<AuthenticationState>> };
}



/** 홈 페이지 */
export default function Home({ userRole, appType, authentication }: HomeProps) {
    /* const */
    const history = useNavigate();


    /* state */
    const [authenticationActionType, setAuthenticationActionType] = useState<AuthenticationActionType>("login");


    /** 로그인 인증 페이지로 이동 */
    const moveToAuthentication = (actionType: AuthenticationActionType) => {
        setAuthenticationActionType(actionType);
        history("/home/authentication");
    };


    return (
        <>
            <Routes>
                <Route path="/authentication" element={<Authentication
                    userRole={userRole}
                    actionType={authenticationActionType}
                    authentication={authentication}
                />} />
            </Routes>

            <div className={style.Home}>
                <div className={style.header}>
                    <h1 className={style.header__title}>{`Blind Route (${appType}-${userRole})`}</h1>
                </div>
                <div className={style.body}>
                    <div className={style.authentication}>
                        <button className={style.login_button} type="button" onClick={() => { moveToAuthentication("login"); }}>로그인</button>
                        <button className={style.signin_button} type="button" onClick={() => { moveToAuthentication("logout"); }}>로그아웃</button>
                    </div>
                </div>
            </div>
        </>
    );
}