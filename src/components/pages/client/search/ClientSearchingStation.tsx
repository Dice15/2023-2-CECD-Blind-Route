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
    const voiceRecognitionTimeoutId = useRef<NodeJS.Timeout | null>(null);
    const audioContainer = useRef<HTMLAudioElement>(null);
    const audioSource = useRef<HTMLSourceElement>(null);


    // States
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);


    // Handler
    /** 음성 인식 효과음 */
    const playVoiceRecognitionAudio = () => {
        if (audioContainer.current && audioSource.current) {
            audioContainer.current.pause();
            audioSource.current.src = `/sounds/voice_recognition.mp3`;
            audioContainer.current.load();
            audioContainer.current.volume = 0.5;
            audioContainer.current.loop = false;
            audioContainer.current.play();
        }
    };


    /** 타이머 재설정 함수 */
    const resetVoiceRecognitionTimeout = () => {
        if (voiceRecognitionTimeoutId.current) {
            clearTimeout(voiceRecognitionTimeoutId.current);
        }
    };


    /** 음성 인식 시작 및 종료 */
    const handleVoiceRecognition = useTapEvents({
        onSingleTouch: () => {
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("두번 터치하면 음성인식이 시작됩니다, 세번 터치하면 음성인식된 내용으로 정류장을 검색합니다.");
        },
        onDoubleTouch: () => {
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
        },
        onTripleTouch: () => {
            VibrationProvider.repeatVibrate(500, 200, 3);
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
    // 컴포넌트 언마운트 시 타이머 및 음성 인식 중지
    useEffect(() => {
        return () => {
            if (voiceRecognitionTimeoutId.current) {
                clearTimeout(voiceRecognitionTimeoutId.current);
            }
            if (isListening) {
                SpeechInputProvider.stopRecognition();
            }
        };
    }, [isListening]);


    useEffect(() => {
        SpeechOutputProvider.speak("두번 터치하면 음성인식이 시작됩니다, 세번 터치하면 음성인식된 내용으로 정류장을 검색합니다.");
    }, []);



    // Render
    return (
        <div className={style.ClientSearchingStation} >
            <LoadingAnimation active={isLoading} />

            <audio ref={audioContainer}>
                <source ref={audioSource} />
            </audio>

            <div className={style.stationNameContainer} onClick={handleVoiceRecognition}>
                <input className={style.textbox_stationName} type="text" placeholder="정류장 입력" ref={textbox_stationName} maxLength={30} />
            </div>

        </div>
    );
}