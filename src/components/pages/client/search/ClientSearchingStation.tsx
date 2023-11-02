import style from "./ClientSearchingStation.module.css";
import { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import Station from "../../../../cores/types/Station";
import { getStationList } from "../../../../cores/api/blindrouteApi";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { useNavigate } from "react-router-dom";
import { SpeechOutputProvider, SpeechInputProvider } from "../../../../modules/speech/SpeechProviders";
import { ClientSearchState } from "./ClientSearch";
import { VibrationProvider } from "../../../../modules/vibration/VibrationProvider";
import useTapEvents from "../../../../hooks/useTapEvents";



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
    const timeoutId = useRef<NodeJS.Timeout | null>(null);
    const audioContainer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);


    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);



    /**
     * Handler functions
     */
    /** 이전 단계로 이동: 홈페이지로 이동 */
    const handlePrevStepClick = useTapEvents({
        onSingleTouch: () => {
            // 진동 1초
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("더블 터치하면 홈으로 돌아갑니다.");
        },
        onDoubleTouch: () => {
            // 더블 터치 진동
            VibrationProvider.repeatVibrate(500, 200, 2);

            // client 페이지로 이동
            history(`/client`);
        }
    });



    /** 다음 단계로 이동: 정류장 불러오고 페이지 상태 업데이트 */
    const handleNextStepClick = useTapEvents({
        onSingleTouch: () => {
            // 진동 1초
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("더블 터치하면 정류장을 검색합니다.");
        },
        onDoubleTouch: async () => {
            // 음성인식이 진행 중이라면 중지
            if (isListening) {
                SpeechInputProvider.stopRecognition();
            }

            // 더블 터치 진동
            VibrationProvider.repeatVibrate(500, 200, 2);

            // 음성 출력
            SpeechOutputProvider.speak("정류장을 검색합니다");

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
                        setIsLoading(false);    // 로딩 모션 off
                        setPageState("selectingStation");
                    } else {
                        SpeechOutputProvider.speak(`'${textbox_stationName.current.value}'가 이름에 포함된 정류장이 없습니다`);
                        setIsLoading(false);    // 로딩 모션 off
                    }
                }
            }, 1000);
        }
    });



    /** 음성 인식 시작 효과음 시작 */
    const playVoiceRecognitionStartAudio = () => {
        if (audioContainer.current && audioSource.current) {
            audioSource.current.src = `/sounds/voice_recognition.mp3`;
            audioContainer.current.load();
            audioContainer.current.volume = 0.5;
            audioContainer.current.loop = false;
            audioContainer.current.play();
        }
    };



    /** 음성 인식 시작 효과음 종료 */
    const stopVoiceRecognitionStartAudio = () => {
        if (audioContainer.current) {
            audioContainer.current.pause();
        }
    };



    /** 음성 인식 시작 및 종료 */
    const handleVoiceRecognition = useTapEvents({
        onDoubleTouch: () => {
            if (isListening) {
                // 음성 인식 중지
                SpeechInputProvider.stopRecognition();
                VibrationProvider.vibrate(1000);
                stopVoiceRecognitionStartAudio();

                if (timeoutId.current) {
                    clearTimeout(timeoutId.current);
                    timeoutId.current = null;
                }

                // 로딩 모션 on
                setIsLoading(true);

                // 1초후 정류장 검색 시작
                setTimeout(async () => {
                    if (textbox_stationName.current) {
                        const responsedStationList = await getStationList(userRole, textbox_stationName.current.value);
                        setIsLoading(false);    // 로딩 모션 off

                        if (responsedStationList.length > 0) {
                            //setStationList([new Station("111111", "111111", "창동역"), new Station("222222", "222222", "노원역")]);
                            setStationList(responsedStationList);
                            setIsLoading(false);    // 로딩 모션 off
                            setPageState("selectingStation");
                        } else {
                            SpeechOutputProvider.speak(`'${textbox_stationName.current.value}'가 이름에 포함된 정류장이 없습니다`);
                            setIsLoading(false);    // 로딩 모션 off
                        }
                    }
                }, 1000);
            } else {
                // 검색 박스 초기화
                if (textbox_stationName.current) {
                    textbox_stationName.current.value = "";
                }

                // 음성 인식 시작
                SpeechOutputProvider.clearSpeak();
                VibrationProvider.vibrate(1000);
                playVoiceRecognitionStartAudio();

                // 음성 인식 결과 저장
                SpeechInputProvider.startRecognition((result: string) => {
                    if (textbox_stationName.current) {
                        const maxLength = 30;
                        const trimmedResult = Array.from(result).slice(0, maxLength).join('');
                        textbox_stationName.current.value = trimmedResult;
                    }
                });

                // 60초 후에 음성 인식 중지
                timeoutId.current = setTimeout(() => {
                    SpeechInputProvider.stopRecognition();
                    VibrationProvider.vibrate(1000);
                    playVoiceRecognitionStartAudio();
                    setIsListening(false);
                }, 60000);
            }
            setIsListening(!isListening);
        }
    });




    // Effects
    // 컴포넌트 언마운트 시 타이머 및 음성 인식 중지
    useEffect(() => {
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            if (isListening) {
                SpeechInputProvider.stopRecognition();
            }
        };
    }, [isListening]);



    // Effects
    useEffect(() => {
        SpeechOutputProvider.speak("더블 터치를 하면 음성인식이 시작됩니다. 음성 입력을 완료 후 더블 터치하여 음성인식을 종료하면 정류장 검색을 시작합니다.");
    }, []);



    // Render
    return (
        <div className={style.ClientSearchingStation} >
            <LoadingAnimation active={isLoading} />

            <audio ref={audioContainer}>
                <source ref={audioSource} />
            </audio>

            <button className={style.button_movePrev} type="button" onClick={handlePrevStepClick}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.stationNameContainer} onClick={handleVoiceRecognition}>
                <input className={style.textbox_stationName} type="text" placeholder="정류장 입력" ref={textbox_stationName} maxLength={30} />
            </div>

            <button className={style.button_moveNext} type="button" onClick={handleNextStepClick}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 L15,30 L5,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M20,15 L30,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}