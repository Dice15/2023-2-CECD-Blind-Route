import style from "./ClientWaitingBus.module.css";
import { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientSearchState } from "./ClientSearch";
import Bus from "../../../../cores/types/Bus";
import { checkBusArrival, unreserveBus } from "../../../../cores/api/blindrouteApi";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { SpeechOutputProvider } from "../../../../modules/speech/SpeechProviders";
import { VibrationProvider } from "../../../../modules/vibration/VibrationProvider";
import useTouchEvents from "../../../../hooks/useTouchEvents";
import { useNavigate } from "react-router-dom";



/** ClientWaitingBus 컴포넌트 프로퍼티 */
export interface ClientWaitingBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientSearchState>>;
    wishBus: Bus | null;
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>;
}



/** ClientWaitingBus 컴포넌트 */
export default function ClientWaitingBus({ userRole, setPageState, wishBus, setWishBus }: ClientWaitingBusProps) {
    // const 
    const history = useNavigate();


    // Refs
    const refreshTaskRef = useRef<NodeJS.Timeout | null>(null);


    // States
    const [waitingMessage, setWaitingMessage] = useState("대기중");
    const [isLoading, setIsLoading] = useState(false);


    // Handler
    const handleBusInfoClick = useTouchEvents({
        onSingleTouch: () => {
            VibrationProvider.vibrate(1000);
            wishBus && SpeechOutputProvider.speak(`"${wishBus.busRouteAbbreviation}", 버스를 대기중입니다. 화면을 두번 터치를 하면 예약을 취소합니다`);
        },
        onDoubleTouch: () => {
            VibrationProvider.repeatVibrate(500, 200, 2);
            // 로딩 모션 On
            setIsLoading(true);

            // 버스 검색
            setTimeout(async () => {
                if (wishBus) {
                    const unreserveResult = await unreserveBus(userRole, wishBus);

                    if (unreserveResult) {
                        await SpeechOutputProvider.speak(`버스 예약을 취소하였습니다. 홈 화면으로 돌아갑니다.`);
                        setWishBus(null);
                        setIsLoading(false);    // 로딩 모션 off
                        history("/client");
                    } else {
                        SpeechOutputProvider.speak(`버스를 취소하는데 실패했습니다`);
                        setIsLoading(false);    // 로딩 모션 off
                    }
                }
            }, 500);
        },
    });


    // Effects
    /** 대기중 메시지 이벤트 */
    useEffect(() => {
        const intervalId = setInterval(() => {
            setWaitingMessage(prevMessage => {
                if (prevMessage === "대기중") return "대기중.";
                if (prevMessage === "대기중.") return "대기중..";
                if (prevMessage === "대기중..") return "대기중...";
                return "대기중";
            });
        }, 1000);

        wishBus && SpeechOutputProvider.speak(`"${wishBus.busRouteAbbreviation}", 버스를 대기중입니다. 화면을 두번 터치를 하면 예약을 취소합니다`);
        return () => clearInterval(intervalId);
    }, [wishBus]);



    /** 예약한 버스가 도착했는지 2초마다 확인함 */
    useEffect(() => {
        refreshTaskRef.current = setInterval(async () => {
            if (wishBus) {
                const isWishBusArrived = await checkBusArrival(userRole, wishBus);

                if (isWishBusArrived) {
                    SpeechOutputProvider.speak(`${wishBus.busRouteAbbreviation} 버스가 도착했습니다`);
                    setPageState("arrivedBus");
                }
            }
        }, 2000);

        return () => {
            if (refreshTaskRef.current) {
                clearInterval(refreshTaskRef.current);
            }
        };
    }, [userRole, setPageState, wishBus]);



    // Render
    return (
        <div className={style.ClientWaitingBus}>
            <LoadingAnimation active={isLoading} />

            <div className={style.wishBusInfo}
                onClick={handleBusInfoClick}
            >
                <h1>{wishBus && wishBus.busRouteAbbreviation}</h1>
                <h3>{waitingMessage}</h3>
            </div>

        </div>
    );
}