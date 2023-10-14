import { useEffect, useState } from "react";
import { UserRole } from "../../../cores/types/UserRole";
import style from "./ClientMiddle.module.css"
import Station from "../../../cores/types/Station";
import ClientSearchingStation from "./system/ClientSearchingStation";
import ClientSelectingStation from "./system/ClientSelectingStation";
import Bus from "../../../cores/types/Bus";
import ClientSelectingBus from "./system/ClientSelectingBus";
import ClientWaitingBus from "./system/ClientWaitingBus";



/** ClientMiddle 컴포넌트 프로퍼티 */
export interface ClientMiddleProps {
    userRole: UserRole;
}



/** 컨트롤러 상태 */
export type ClientMiddleState = "searchingStation" | "selectingStation" | "selectingBus" | "waitingBus" | "arrivedBus";



/** ClientMiddle 컴포넌트 */
export default function ClientMiddle({ userRole }: ClientMiddleProps) {
    // state
    const [pageState, setPageState] = useState<ClientMiddleState>("searchingStation");
    const [stationList, setStationList] = useState<Station[]>([]);
    const [busList, setBusList] = useState<Bus[]>([]);
    const [wishBus, setWishBus] = useState<Bus | null>(null);



    /** 페이지 상태에 따른 알맞는 컨트롤러 반환 */
    const getControllerForm = () => {
        switch (pageState) {
            case "searchingStation": {
                return <ClientSearchingStation
                    userRole={userRole}
                    setPageState={setPageState}
                    setStationList={setStationList}
                />;
            }
            case "selectingStation": {
                return <ClientSelectingStation
                    userRole={userRole}
                    setPageState={setPageState}
                    stationList={stationList}
                    setBusList={setBusList}
                />
            }
            case "selectingBus": {
                return <ClientSelectingBus
                    userRole={userRole}
                    setPageState={setPageState}
                    busList={busList}
                    setWishBus={setWishBus}
                />
            }
            case "waitingBus": {
                return <ClientWaitingBus
                    userRole={userRole}
                    setPageState={setPageState}
                    wishBus={wishBus!}
                />
            }
            default: {
                return <></>;
            }
        }
    };



    /** 페이지가 초기화 될때 페이지 상태는 searchingStation로 설정 */
    useEffect(() => {
        setPageState("searchingStation");
    }, []);


    return (
        <div className={style.ClientMiddle}>
            {getControllerForm()}
        </div>
    );
}