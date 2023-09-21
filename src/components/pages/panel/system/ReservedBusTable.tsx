import { useEffect, useRef, useState } from "react";
import { useModal } from "../../../modules/modal/Modal";
import { ModalAnimationType } from "../../../modules/modal/ModalAnimations";
import style from "./ReservedBusTable.module.css";
import Station from "../../../../cores/types/Station";
import { UserRole } from "../../../../cores/types/UserRole";
import SelectingStation from "./SelectingStation";
import Bus from "../../../../cores/types/Bus";
import { getReservedBusList } from "../../../../cores/api/blindroutePanel";



/** 정류장에 예약된 희망 버스 테이블 프로퍼티 */
export interface ReservedBusTableProps {
    taskState: "running" | "stopped";
    userRole: UserRole;
}



/** 정류장에 예약된 희망 버스 테이블 컴포넌트 */
export default function ReservedBusTable({ taskState, userRole }: ReservedBusTableProps) {
    /** ref */
    const refreshTaskRef = useRef<NodeJS.Timeout | null>(null);

    /** state */
    const [station, setStation] = useState<Station | null>(null);
    const [reservedBusList, setReservedBusList] = useState<Bus[]>([]);

    /** modal */
    const [SelectStationModal, openSelectStationModal, closeSelectStationModal] = useModal(ModalAnimationType.ZOOM);


    /** 버스 정류장 선택 */
    const onSelectingStation = () => {
        openSelectStationModal();
    };


    /** 정류장에 예약된 버스 리스트를 주기적으로 갱신함 */
    useEffect(() => {
        if (station) {
            refreshTaskRef.current = setInterval(async () => {
                const apiData = await getReservedBusList(userRole, { arsId: station.arsId });
                console.log(apiData);
            }, 1500);
        }

        return () => {
            if (refreshTaskRef.current) {
                clearInterval(refreshTaskRef.current);
            }
        };
    }, [userRole, station]);


    return (
        <div className={style.StationWishTable}>
            {taskState === "running" && !station
                ? <div className={style.select_station}>
                    <button className={style.select_station__button} type="button" onClick={onSelectingStation}>정류장 선택</button>
                </div>
                : <div className={style.station_wishtable}>

                </div>
            }

            <SelectStationModal>
                <div className={style.select_station_modal__wrapper}>
                    <SelectingStation
                        userRole={userRole}
                        setStation={setStation}
                        onClose={closeSelectStationModal}
                    />
                </div>
            </SelectStationModal>
        </div >
    );
}