import { useEffect, useState } from "react";
import { UserRole } from "../../../cores/types/UserRole";
import style from "./ClientMiddle.module.css"
import { Route, Routes, useNavigate } from "react-router-dom";
import ClientActionForm, { ClientAction } from "./action/ClientActionForm";
import { SpeechOutputProvider } from "../../../modules/speech/SpeechProviders";
import useTapEvents from "../../../hooks/useTapEvents";
import { VibrationProvider } from "../../../modules/vibration/VibrationProvider";



/** ClientMiddle 컴포넌트 프로퍼티 */
export interface ClientMiddleProps {
    userRole: UserRole;
}



/** ClientMiddle 컴포넌트 */
export default function ClientMiddle({ userRole }: ClientMiddleProps) {
    // Consts
    const history = useNavigate();


    // States
    const [actionOption, setActionOption] = useState<ClientAction>("search");


    /** */
    const moveToAction = (action: ClientAction) => {
        setActionOption(action);
        history(`/client/action`);
    };



    // Effects
    useEffect(() => {
        SpeechOutputProvider.speak("원하는 기능을 더블터치 하세요.");
    }, []);



    // Render
    return (
        <div className={style.ClientMiddle}>
            <Routes>
                <Route path="/action" element={
                    <ClientActionForm userRole={userRole} action={actionOption} />
                } />
                <Route path="/" element={
                    <div className={style.selectAction}>
                        <button type="button"
                            onClick={useTapEvents({
                                onSingleTouch: () => { VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("버스 검색"); },
                                onDoubleTouch: () => { VibrationProvider.patternVibrate([500, 500]); moveToAction("search"); }
                            })}
                        >
                            검색하기
                        </button>

                        <button type="button"
                            onClick={useTapEvents({
                                onSingleTouch: () => { VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("즐겨찾는 버스 조회"); },
                                onDoubleTouch: () => { VibrationProvider.patternVibrate([500, 500]); moveToAction("bookmark"); }
                            })}
                        >
                            즐겨찾기
                        </button>

                        <button type="button"
                            onClick={useTapEvents({
                                onSingleTouch: () => { VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("즐겨찾는 버스 초기화"); },
                                onDoubleTouch: () => { VibrationProvider.patternVibrate([500, 500]); moveToAction("resetBookmark"); }
                            })}
                        >
                            즐겨찾기 초기화
                        </button>
                    </div>
                } />
            </Routes>
        </div>
    );
}
