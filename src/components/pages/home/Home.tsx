import style from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../cores/types/UserRole";
import { AuthenticationAction } from "../common/authentication/Authentication";
import React, { useCallback, useEffect, useState } from "react";
import { isSessionValid } from "../../../cores/api/blindrouteApi";
import { LocalStorageProvider } from "../../../modules/storage/AppStorageProvider";
import { AppType } from "../../../cores/types/AppType";
import useTouchEvents from "../../../hooks/useTouchEvents";
import { VibrationProvider } from "../../../modules/vibration/VibrationProvider";
import { SpeechOutputProvider } from "../../../modules/speech/SpeechProviders";



/** 홈 페이지 프로퍼티 */
export interface HomeProps {
    setUserRole: React.Dispatch<React.SetStateAction<UserRole>>
    authenticationAction: AuthenticationAction;
    setAuthenticationAction: React.Dispatch<React.SetStateAction<AuthenticationAction>>;
}



/** 홈 페이지 */
export default function Home({ setUserRole, authenticationAction, setAuthenticationAction }: HomeProps) {
    /* const */
    const history = useNavigate();


    // state
    const [authenticationState, setAuthenticationState] = useState<boolean | undefined>(undefined);



    /** 앱 페이지로 이동 */
    const moveToApp = useCallback(() => {
        setUserRole((LocalStorageProvider.get<string>("useRole") || "user") as UserRole);
        history(`/${(LocalStorageProvider.get<string>("apptype") || "client") as AppType}`);
    }, [setUserRole, history]);



    /** 인증 요청 시 인증 액션타입 설정 */
    const onAuthentication = (actionType: AuthenticationAction) => {
        setAuthenticationAction(actionType);
    };


    const handleAuthenticationClick = useTouchEvents({
        onSingleTouch: () => {  VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("화면을 두번 터치하면 로그인을 합니다."); },
        onDoubleTouch: () => { VibrationProvider.repeatVibrate(500, 200, 2); onAuthentication("login"); }
    });



    /** 페이지 로딩 시 인증 상태 확인 */
    useEffect(() => {
        const checkAuth = async () => {
            const isAuthed = await isSessionValid((LocalStorageProvider.get<string>("useRole") || "user") as UserRole);
            setAuthenticationState(isAuthed);
            if (isAuthed) {
                moveToApp();
            }
        };
        checkAuth();
    }, [moveToApp]);



    /** 페이지 로딩 시 인증 액션 상태 "idle" */
    useEffect(() => {
        setAuthenticationAction("idle");
    }, [setAuthenticationAction]);



    /** 인증 페이지로 이동 */
    useEffect(() => {
        if (authenticationAction !== "idle") {
            history("/authentication");
        }
    }, [authenticationAction, history]);



    // Effects
    useEffect(() => {
        SpeechOutputProvider.speak("로그인 페이지 입니다. 화면을 두번 터치하면 로그인을 합니다.");
    }, []);



    return (
        <div className={style.Home}>
            <div className={style.header}>
                <h1 className={style.header__title}>{`Blind Route`}</h1>
            </div>
            <div className={style.body}>
                <div className={style.authentication}>
                    {authenticationState !== undefined && authenticationState === false && <button type="button" onClick={handleAuthenticationClick}>로그인</button>}
                </div>
            </div>
        </div>
    );
}