import style from "./ClientArrivedBus.module.css";
import { useEffect, useRef } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientMiddleState } from "../ClientMiddle";
import Bus from "../../../../cores/types/Bus";



/** ClientArrivedBus 컴포넌트 프로퍼티 */
export interface ClientArrivedBusProps {
    setPageState: React.Dispatch<React.SetStateAction<ClientMiddleState>>;
    wishBus: Bus;
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>;
}



/** ClientArrivedBus 컴포넌트 */
export default function ClientArrivedBus({ setPageState, wishBus, setWishBus }: ClientArrivedBusProps) {
    // ref
    const setPageStateTaskRef = useRef<NodeJS.Timeout | null>(null);


    /**
     * Handler functions
     */
    /** 이전 단계로 이동 */
    const onFirstStep = () => {
        setPageState("searchingStation");
        setWishBus(null);
    };



    // Effects
    useEffect(() => {
        setPageStateTaskRef.current = setInterval(() => {
            setPageState("searchingStation");
            setWishBus(null);
        }, 5000);

        return () => {
            if (setPageStateTaskRef.current) {
                clearInterval(setPageStateTaskRef.current);
            }
        };
    }, [setPageState, setWishBus]);



    // Render
    return (
        <div className={style.ClientArrivedBus}>
            <button className={style.button_movePrev} type="button" onClick={() => { }}></button>

            <div className={style.wishBusInfo} onClick={onFirstStep}>
                <h1>{wishBus.busRouteAbbreviation}</h1>
                <h3>{"버스가 도착했습니다"}</h3>
            </div>

            <button className={style.button_moveNext} type="button" onClick={() => { }}></button>
        </div >
    );
}