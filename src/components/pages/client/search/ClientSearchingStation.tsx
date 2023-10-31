import style from "./ClientSearchingStation.module.css";
import { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import Station from "../../../../cores/types/Station";
import { getStationList } from "../../../../cores/api/blindrouteApi";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { useNavigate } from "react-router-dom";
import { SpeechOutputProvider, SpeechInputProvider } from "../../../../modules/speech/SpeechProviders";
import { ClientSearchState } from "./ClientSearch";



/** ClientSearchingStation 컴포넌트 프로퍼티 */
export interface ClientSearchingStationProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientSearchState>>;
    setStationList: React.Dispatch<React.SetStateAction<Station[]>>;
}



/** ClientSearchingStation 컴포넌트 */
export default function ClientSearchingStation({ userRole, setPageState, setStationList }: ClientSearchingStationProps) {
    // Const
    const history = useNavigate();


    // Refs
    const textbox_stationName = useRef<HTMLInputElement>(null);


    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);



    /**
     * Handler functions
     */
    /** 이전 단계로 이동: 홈페이지로 이동 */
    const onPrevStep = () => {
        // 진동 1초
        navigator.vibrate(1000);

        // client 페이지로 이동
        history(`/client`);
    }



    /** 다음 단계로 이동: 정류장 불러오고 페이지 상태 업데이트 */
    const onNextStep = async () => {
        // 음성인식 중지
        SpeechInputProvider.stopRecognition();

        // 진동 1초
        navigator.vibrate(1000);

        // 로딩 모션 on
        setIsLoading(true);

        // 1.5초후 정류장 검색 시작
        setTimeout(async () => {
            if (textbox_stationName.current) {
                const responsedStationList = await getStationList(userRole, textbox_stationName.current.value);
                setIsLoading(false);    // 로딩 모션 off

                if (responsedStationList.length > 0) {
                    //setStationList([new Station("111111", "111111", "창동역"), new Station("222222", "222222", "노원역")]);
                    setStationList(responsedStationList);
                    setTimeout(() => {
                        setIsLoading(false);    // 로딩 모션 off
                        setPageState("selectingStation");
                    }, 500);
                } else {
                    SpeechOutputProvider.speak("검색된 정류장이 없습니다");
                    setIsLoading(false);    // 로딩 모션 off
                }
            }
        }, 1500);
    };



    /** 음성 인식 시작 및 종료 */
    const toggleListening = () => {
        if (isListening) {
            // 음성 인식 중지
            SpeechInputProvider.stopRecognition();
            if (timeoutId) clearTimeout(timeoutId);
        } else {
            // 음성 인식 시작
            SpeechOutputProvider.clearSpeak();
            SpeechInputProvider.startRecognition((result: string) => {
                if (textbox_stationName.current) {
                    textbox_stationName.current.value = result;
                }
            });
            // 20초 후에 음성 인식 중지
            const id = setTimeout(() => {
                SpeechInputProvider.stopRecognition();
                setIsListening(false);
            }, 20000);
            setTimeoutId(id);
        }
        setIsListening(!isListening);
    };



    // Effects
    // 컴포넌트 언마운트 시 타이머 및 음성 인식 중지
    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (isListening) {
                SpeechInputProvider.stopRecognition();
            }
        };
    }, [isListening, timeoutId]);



    // Effects
    useEffect(() => {
        SpeechOutputProvider.speak("정류장을 입력하세요. 더블 터치를 하면 음성인식이 시작됩니다");
    }, []);



    // Render
    return (
        <div className={style.ClientSearchingStation} >
            <LoadingAnimation active={isLoading} />

            <button className={style.button_movePrev} type="button" onClick={onPrevStep}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.stationNameContainer} onDoubleClick={toggleListening}>
                <input className={style.textbox_stationName} type="text" placeholder="정류장 입력" ref={textbox_stationName} />
            </div>

            <button className={style.button_moveNext} type="button" onClick={onNextStep}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 L15,30 L5,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M20,15 L30,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}