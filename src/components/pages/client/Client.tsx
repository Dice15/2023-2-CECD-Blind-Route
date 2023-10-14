import style from "./Client.module.css"
import ClientMiddle from "./ClientMiddle";
import { UserRole } from "../../../cores/types/UserRole";
import { useEffect, useState } from "react";
import { checkAuthSession } from "../../../cores/api/blindrouteClient";
import { useNavigate } from "react-router-dom";



/** 클라이언트 페이지 메인 컴포넌트 프로퍼티 */
export interface ClientProps {
    userRole: UserRole;
}



/** 클라이언트 페이지 메인 컴포넌트 */
export default function Client({ userRole }: ClientProps) {
    // const 
    const history = useNavigate();


    // state
    const [authenticationState, setAuthenticationState] = useState<boolean>(false);



    /** 홈 페이지로 이동 */
    const moveToHome = () => {
        history("/home");
    };



    /** 페이지 로딩 시 인증 상태 확인 */
    useEffect(() => {
        const checkAuth = async () => {
            if (!(await checkAuthSession(userRole)).sessionActive) {
                alert("로그인이 필요한 페이지 입니다");
                history("/home");
            } else {
                setAuthenticationState(true);
            }
        };
        setAuthenticationState(true);
        // checkAuth();
    }, [userRole, history]);



    return (<>{authenticationState &&
        <div className={style.Client} >
            <div className={style.header}>
                <h1 className={style.header__title} onClick={() => { moveToHome() }}>{`Blind Route`}</h1>
            </div>
            <div className={style.body}>
                <ClientMiddle userRole={userRole} />
            </div>
        </div >
    }</>);
}