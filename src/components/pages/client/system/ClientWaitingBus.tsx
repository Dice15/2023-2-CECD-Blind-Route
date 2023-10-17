import style from "./ClientWaitingBus.module.css";
import { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientMiddleState } from "../ClientMiddle";
import Bus from "../../../../cores/types/Bus";
import { checkBusArrival, unreserveBus } from "../../../../cores/api/blindrouteClient";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { speak } from "../../../../modules/speech/Speech";



/** ClientWaitingBus 컴포넌트 프로퍼티 */
export interface ClientWaitingBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientMiddleState>>;
    wishBus: Bus;
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>;
}



/** ClientWaitingBus 컴포넌트 */
export default function ClientWaitingBus({ userRole, setPageState, wishBus, setWishBus }: ClientWaitingBusProps) {
    // Refs
    const refreshTaskRef = useRef<NodeJS.Timeout | null>(null);


    // States
    const [waitingMessage, setWaitingMessage] = useState("대기중");
    const [isLoading, setIsLoading] = useState(false);


    /**
     * Handler functions
     */
    /** 이전 단계로 이동: 예약한 버스를 취소하고 이동 */
    const onPrevStep = async () => {
        setIsLoading(true);
        const unreserveResult = await unreserveBus(userRole, {
            arsId: wishBus.stationArsId,
            busRouteId: wishBus.busRouteId,
            busRouteNm: wishBus.busRouteNumber,
            busRouteAbrv: wishBus.busRouteAbbreviation,
        });
        setIsLoading(false);

        if (unreserveResult) {
            setPageState("selectingBus");
            setWishBus(null);
        } else {
            alert(`${wishBus.busRouteAbbreviation} 버스를 취소하는데 실패했습니다`);
        }
    };



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

        // 컴포넌트가 언마운트될 때 인터벌을 클리어합니다.
        return () => clearInterval(intervalId);
    }, []);



    /** 예약한 버스가 도착했는지 2초마다 확인함 */
    useEffect(() => {
        refreshTaskRef.current = setInterval(async () => {
            const isWishBusArrived = await checkBusArrival(userRole, {
                arsId: wishBus.stationArsId,
                busRouteId: wishBus.busRouteId,
                busRouteNm: wishBus.busRouteNumber,
                busRouteAbrv: wishBus.busRouteAbbreviation
            });

            if (isWishBusArrived) {
                speak(`${wishBus.busRouteAbbreviation}버스가 도착했습니다`);
                setPageState("arrivedBus");
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

            <button className={style.button_movePrev} type="button" onClick={onPrevStep}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.wishBusInfo}>
                <h1>{wishBus.busRouteAbbreviation}</h1>
                <h3>{waitingMessage}</h3>
            </div>

            <button className={style.button_moveNext} type="button" onClick={() => { }}></button>
        </div>
    );
}