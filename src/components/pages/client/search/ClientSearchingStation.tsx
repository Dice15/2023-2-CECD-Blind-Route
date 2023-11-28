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
import useTouchEvents from "../../../../hooks/useTouchEvents";
import useTouchHoldEvents from "../../../../hooks/useTouchHoldEvents";



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
    const audioContainer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);


    // States
    const [isLoading, setIsLoading] = useState(false);


    // Handler
    /** 음성 인식 효과음 */
    const playVoiceRecognitionAudio = () => {
        if (audioContainer.current && audioSource.current) {
            audioContainer.current.pause();
            audioSource.current.src = `/sounds/voice_recognition.mp3`;
            audioContainer.current.load();
            audioContainer.current.volume = 0.7;
            audioContainer.current.loop = false;
            audioContainer.current.play();
        }
    };


    /** 음성 인식 시작 및 종료 */
    const handleVoiceRecognition = useTouchHoldEvents({
        onTouchStart: () => {
            SpeechOutputProvider.clearSpeak();
            playVoiceRecognitionAudio();
            VibrationProvider.vibrate(1000);

            // 검색 박스 초기화
            if (textbox_stationName.current) {
                textbox_stationName.current.value = "";
            }

            // 음성 인식 시작
            setTimeout(() => {
                SpeechInputProvider.startRecognition((result: string) => {
                    if (textbox_stationName.current) {
                        const maxLength = 30;
                        const trimmedResult = Array.from(result).slice(0, maxLength).join('');
                        textbox_stationName.current.value = trimmedResult;
                    }
                });
            }, 1000);
        },
        onTouchEnd: () => {
            playVoiceRecognitionAudio();
            VibrationProvider.vibrate(1000);
            SpeechInputProvider.stopRecognition();

            // 로딩 모션 on
            setIsLoading(true);

            // 1초후 정류장 검색 시작
            setTimeout(async () => {
                if (textbox_stationName.current) {
                    if (textbox_stationName.current.value === "") {
                        SpeechOutputProvider.speak("인식된 단어가 없습니다. 다시 시도해주세요.");
                        setIsLoading(false);    // 로딩 모션 off
                    } else {
                        const responsedStationList = await getStationList(userRole, textbox_stationName.current.value);
                        setIsLoading(false);    // 로딩 모션 off

                        if (responsedStationList.length > 0) {
                            setStationList(responsedStationList);
                            setPageState("selectingStation");
                        } else {
                            SpeechOutputProvider.speak(`'${textbox_stationName.current.value}'가 이름에 포함된 정류장이 없습니다`);
                        }
                    }
                }
            }, 1000);
        },
        touchDuration: 2000
    });

    const handleSearchStation = useTouchEvents({
        onSingleTouch: () => {
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("화면을 누르고 있으면 음성인식이 됩니다. 손을 떼면 음성인식된 내용으로 정류장 검색을 진행합니다.");
        },
        onDoubleTouch: () => {
            VibrationProvider.repeatVibrate(500, 200, 2);
            // 로딩 모션 on
            setIsLoading(true);

            // 1초후 정류장 검색 시작
            setTimeout(async () => {
                if (textbox_stationName.current) {
                    if (textbox_stationName.current.value === "") {
                        SpeechOutputProvider.speak("인식된 단어가 없습니다. 다시 시도해주세요.");
                        setIsLoading(false);    // 로딩 모션 off
                    } else {
                        const responsedStationList = await getStationList(userRole, textbox_stationName.current.value);
                        setIsLoading(false);    // 로딩 모션 off

                        if (responsedStationList.length > 0) {
                            setStationList(responsedStationList);
                            setPageState("selectingStation");
                        } else {
                            SpeechOutputProvider.speak(`'${textbox_stationName.current.value}'가 이름에 포함된 정류장이 없습니다`);
                        }
                    }
                }
            }, 1000);
        }
    });


    // Effects
    useEffect(() => {
        SpeechOutputProvider.speak("화면을 누르고 있으면 음성인식이 됩니다. 손을 떼면 음성인식된 내용으로 정류장 검색을 진행합니다.");
    }, []);



    // Render
    return (
        <div className={style.ClientSearchingStation} >
            <LoadingAnimation active={isLoading} />

            <audio ref={audioContainer}>
                <source ref={audioSource} />
            </audio>

            <div className={style.stationNameContainer}
                onClick={handleSearchStation}
                onTouchStart={handleVoiceRecognition.handleTouchStart}
                onTouchEnd={handleVoiceRecognition.handleTouchEnd}
            >
                <input className={style.textbox_stationName} type="text" placeholder="정류장 입력" ref={textbox_stationName} maxLength={30} />
            </div>

        </div>
    );
}


/*
SpeechOutputProvider.clearSpeak();
            SpeechInputProvider.stopRecognition();
            playVoiceRecognitionAudio();
            VibrationProvider.repeatVibrate(500, 200, 2);

            if (isListening) {
                if (voiceRecognitionTimeoutId.current) {
                    clearTimeout(voiceRecognitionTimeoutId.current);
                    voiceRecognitionTimeoutId.current = null;
                }
            } else {
                // 검색 박스 초기화
                if (textbox_stationName.current) {
                    textbox_stationName.current.value = "";
                }

                // 음성 인식 시작
                setTimeout(() => {
                    SpeechInputProvider.startRecognition((result: string) => {
                        resetVoiceRecognitionTimeout();  // 음성이 인식될 때마다 타이머를 재설정

                        if (textbox_stationName.current) {
                            const maxLength = 30;
                            const trimmedResult = Array.from(result).slice(0, maxLength).join('');
                            textbox_stationName.current.value = trimmedResult;
                        }
                    });

                    // 타이머 설정
                    resetVoiceRecognitionTimeout();
                }, 1000);
            }
            setIsListening(!isListening);
*/