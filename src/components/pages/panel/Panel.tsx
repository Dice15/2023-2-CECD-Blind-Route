import style from "./Panel.module.css";
import { UserRole } from "../../../cores/types/UserRole";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isSessionValid } from "../../../cores/api/blindrouteApi";
import PanelMiddle from "./PanelMiddle";



/** 전광판 페이지 메인 컴포넌트 프로퍼티 */
export interface PanelProps {
    userRole: UserRole;
}



/** 전광판 페이지 메인 컴포넌트 */
export default function Panel({ userRole }: PanelProps) {
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
            if (!(await isSessionValid(userRole))) {
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
        <div className={style.Panel} >
            <div className={style.header}>
                <h1 className={style.header__title} onClick={() => { moveToHome() }}>{`Blind Route`}</h1>
            </div>
            <div className={style.body}>
                <PanelMiddle userRole={userRole} />
            </div>
        </div >
    }</>);
}