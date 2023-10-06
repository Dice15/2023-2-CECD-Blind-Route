import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../cores/types/UserRole";
import { AuthenticationState } from "../common/authentication/Authentication";
import React, { useState } from "react";


/** 홈 페이지 프로퍼티 */
export interface HomeProps {
    userRole: UserRole;
    authentication: { state: AuthenticationState, setState: React.Dispatch<React.SetStateAction<AuthenticationState>> };
    appType: AppType;
}



/** 프로그램 타입 
 * 
 * client: 사람들이 사용할 스마트폰 앱
 * 
 * panel: 정류장의 전광판에서 사용할 앱
 */
export type AppType = "client" | "panel";



/** 홈 페이지 */
export default function Home({ userRole, appType }: HomeProps) {
    /* const */
    const history = useNavigate();


    /* state */
    const [authenticationState, setAuthenticationState] = useState<AuthenticationState>("Unauthenticated");


    /** 인증 상태에 따른 이벤트 */
    /* useEffect(() => {
         switch (authenticationState) {
             case "success": {
                 history(`/${appType}`);
                 break;
             }
             case "fail": {
                 alert("로그인을 실패하였습니다");
                 break;
             }
             default: {
                 break;
             }
         }
     }, [appType, history, authenticationState]);*/


    /** 인증 페이지로 이동 */
    const moveToAuthenticationPage = () => {
        history("/authentication");
    };



    return (
        <div className={style.Home}>
            <div className={style.header}>
                <h1 className={style.header__title}>{`Blind Route (${userRole})`}</h1>
            </div>
            <div className={style.body}>
                <div className={style.authentication}>
                    <button className={style.login_button} type="button" onClick={moveToAuthenticationPage}>로그인</button>
                    <button className={style.signin_button} type="button" onClick={() => { }}>회원가입</button>
                </div>
            </div>
        </div>
    );
}

/* 

                    <Authentication
                        userRole={userRole}
                        setAuthenticationState={setAuthenticationState}
                    />
  <LoginForm userRole={userRole} /><div className={style.home__body__device}>
<button className={style.mode_select_button} type="button" onClick={() => { moveToClient(); }} >Client</button>
<button className={style.mode_select_button} type="button" onClick={() => { moveToPanel(); }} >Panel</button>
</div> */