import style from "./Client.module.css"
import ClientMiddle from "./ClientMiddle";
import { UserRole } from "../../../cores/types/UserRole";
import { useEffect, useState } from "react";
import { isSessionValid } from "../../../cores/api/blindrouteApi";
import { useNavigate } from "react-router-dom";
import { SpeechOutputProvider } from "../../../modules/speech/SpeechProviders";
import useTouchEvents from "../../../hooks/useTouchEvents";
import { VibrationProvider } from "../../../modules/vibration/VibrationProvider";



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
    const moveToClient = () => {
        history("/client");
    };


    const handleHeaderTitleClick = useTouchEvents({
        onSingleTouch: () => {
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("상단바를 두번 터치하면 홈으로 이동합니다");
        },
        onDoubleTouch: () => {
            VibrationProvider.repeatVibrate(500, 200, 2);
            SpeechOutputProvider.speak("홈으로 이동합니다");
            moveToClient();
        }
    })


    /** 페이지 로딩 시 인증 상태 확인 */
    useEffect(() => {
        const checkAuth = async () => {
            if (!(await isSessionValid(userRole))) {
                SpeechOutputProvider.speak("로그인이 필요한 페이지 입니다. 로그인을 해주세요");
                history("/home");
            } else {
                setAuthenticationState(true);
            }
        };
        setAuthenticationState(true);
        //checkAuth();
    }, [userRole, history]);



    return (<>{authenticationState &&
        <div className={style.Client} >
            <div className={style.header}>
                <h1 className={style.header__title}
                    onClick={handleHeaderTitleClick}
                >
                    {`Blind Route`}
                </h1>
            </div>
            <div className={style.body}>
                <ClientMiddle userRole={userRole} />
            </div>
        </div >
    }</>);
}