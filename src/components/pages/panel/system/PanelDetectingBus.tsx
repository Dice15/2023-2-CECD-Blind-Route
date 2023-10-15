import Station from "../../../../cores/types/Station";
import { UserRole } from "../../../../cores/types/UserRole";
import { PanelMiddleState } from "../PanelMiddle";
import PanelCameraCapture from "./PanelCameraCapture";
import style from "./PanelDetectingBus.module.css";
import PanelReservedBus from "./PanelReservedBus";



/** PanelDetectingBus 컴포넌트 프로퍼티 */
export interface PanelDetectingBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<PanelMiddleState>>
    wishStation: Station
}



/** PanelDetectingBus 컴포넌트 */
export default function PanelDetectingBus({ userRole, setPageState, wishStation }: PanelDetectingBusProps) {


    /** 이전 단계로 이동 */
    const onPrevStep = () => {
        setPageState("selectingStation");
    };



    return (
        <div className={style.PanelDetectingBus}>
            <button className={style.button_movePrev} type="button" onClick={() => { onPrevStep(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.busTable}>
                <div className={style.reserved_bus}>
                    <PanelReservedBus
                        userRole={userRole}
                        wishStation={wishStation}
                    />
                </div>
                <div className={style.detected_bus}>
                    <PanelCameraCapture
                        userRole={userRole}
                        wishStation={wishStation}
                    />
                </div>
            </div>

            <button className={style.button_moveNext} type="button" onClick={() => { }}></button>
        </div>
    );
};