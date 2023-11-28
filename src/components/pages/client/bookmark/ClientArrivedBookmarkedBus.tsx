import Bus from "../../../../cores/types/Bus";
import { useNavigate } from "react-router-dom";
import style from "./ClientArrivedBookmarkedBus.module.css";
import { useEffect, useRef } from "react";



/** ClientArrivedBookmarkedBus 컴포넌트 프로퍼티 */
export interface ClientArrivedBookmarkedBusProps {
    wishBus: Bus;
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>;
}



/** ClientArrivedBookmarkedBus 컴포넌트 */
export default function ClientArrivedBookmarkedBus({ wishBus, setWishBus }: ClientArrivedBookmarkedBusProps) {
    // Consts
    const history = useNavigate();


    // ref
    const setPageStateTaskRef = useRef<NodeJS.Timeout | null>(null);


    /**
     * Handler functions
     */
    /** 이전 단계로 이동 */
    const onFirstStep = () => {
        setWishBus(null);
        history(`/client`);
    };



    // Effects
    useEffect(() => {
        navigator.vibrate(5000);

        setPageStateTaskRef.current = setInterval(() => {
            setWishBus(null);
            history(`/client`);
        }, 5000);

        return () => {
            if (setPageStateTaskRef.current) {
                clearInterval(setPageStateTaskRef.current);
            }
        };
    }, [setWishBus, history]);



    // Render
    return (
        <div className={style.ClientArrivedBookmarkedBus}>
            <div className={style.wishBusInfo} onClick={onFirstStep}>
                <h1>{wishBus.busRouteAbbreviation}</h1>
                <h3>{"버스가 도착했습니다!!"}</h3>
            </div>
        </div >
    );
}