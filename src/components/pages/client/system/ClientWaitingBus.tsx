import style from "./ClientWaitingBus.module.css";
import { useEffect, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientMiddleState } from "../ClientMiddle";
import Bus from "../../../../cores/types/Bus";



/** ClientSelectingStation 컴포넌트 프로퍼티 */
export interface ClientWaitingBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientMiddleState>>;
    wishBus: Bus;
}



/** ClientSelectingStation 컴포넌트 */
export default function ClientWaitingBus({ userRole, setPageState, wishBus }: ClientWaitingBusProps) {
    // state
    const [waitingMessage, setWaitingMessage] = useState("대기중");



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



    /** 이전 단계로 이동: 선택한 정류장의 버스 리스트를 불러오고 페이지 상태 업데이트 */
    const onPrevStep = () => {
        setPageState("selectingBus");
    };



    return (
        <div className={style.ClientSelectingBus}>
            <button className={style.button_movePrev} type="button" onClick={() => { onPrevStep(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.busInfo}>
                <h1>{wishBus.busRouteAbbreviation}</h1>
                <h3>{waitingMessage}</h3>
            </div>

            <button className={style.button_moveNext} type="button" onClick={() => { }}></button>
        </div>
    );
}