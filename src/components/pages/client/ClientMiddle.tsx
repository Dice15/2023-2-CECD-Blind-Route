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
        SpeechOutputProvider.speak("화면 중앙을 두번 터치하면 버스 검색하기, 세번 터치하면 즐겨찾기로 이동합니다.");
        SpeechOutputProvider.speak("상단바를 두번 터치하면 홈으로 이동합니다");
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
                                onSingleTouch: () => { VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("두번 터치하면 버스 검색하기, 세번 터치하면 즐겨찾기로 이동합니다."); },
                                onDoubleTouch: () => { VibrationProvider.repeatVibrate(500, 200, 2); moveToAction("search"); },
                                onTripleTouch: () => { VibrationProvider.repeatVibrate(500, 200, 3); moveToAction("bookmark"); }
                            })}
                        >
                            버스 예약하기
                        </button>
                    </div>
                } />
            </Routes>
        </div>
    );
}



/*

 <button type="button"
                            onClick={useTapEvents({
                                onSingleTouch: () => { VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("더블 터치하면 버스 검색을 시작합니다"); },
                                onDoubleTouch: () => { VibrationProvider.repeatVibrate(500, 200, 2); moveToAction("search"); }
                            })}
                        >
                            검색하기
                        </button>

                        <button type="button"
                            onClick={useTapEvents({
                                onSingleTouch: () => { VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("더블 터치하면 즐겨찾는 버스를 조회할 수 있습니다"); },
                                onDoubleTouch: () => { VibrationProvider.repeatVibrate(500, 200, 2); moveToAction("bookmark"); }
                            })}
                        >
                            즐겨찾기
                        </button>

                        <button type="button"
                            onClick={useTapEvents({
                                onSingleTouch: () => { VibrationProvider.vibrate(1000); SpeechOutputProvider.speak("더블 터치하여 즐겨찾는 버스를 초기화 할 수 있습니다"); },
                                onDoubleTouch: () => { VibrationProvider.repeatVibrate(500, 200, 2); moveToAction("resetBookmark"); }
                            })}
                        >
                            즐겨찾기 초기화
                        </button>
*/