import { useEffect, useRef, useState } from "react";
import { useModal } from "../../../modules/modal/Modal";
import { ModalAnimationType } from "../../../modules/modal/ModalAnimations";
import style from "./ReservedBusTable.module.css";
import Station from "../../../../cores/types/Station";
import { UserRole } from "../../../../cores/types/UserRole";
import SelectingStation from "./SelectingStation";
import Bus from "../../../../cores/types/Bus";
import { getReservedBusList } from "../../../../cores/api/blindroutePanel";
import VirtualizedTable from "../../../modules/virtualizedTable/VirtualizedTable";
import useElementDimensions from "../../../../hooks/useElementDimensions";



/** 정류장에 예약된 희망 버스 테이블 프로퍼티 */
export interface ReservedBusTableProps {
    taskState: "running" | "stopped";
    userRole: UserRole;
}



/** 정류장에 예약된 희망 버스 테이블 컴포넌트 */
export default function ReservedBusTable({ taskState, userRole }: ReservedBusTableProps) {
    /** ref */
    const refreshTaskRef = useRef<NodeJS.Timeout | null>(null);
    const reservedBusTableRef = useRef<HTMLDivElement | null>(null);

    /** state */
    const [station, setStation] = useState<Station | null>(null);
    const [reservedBusList, setReservedBusList] = useState<Bus[]>([]);

    /** custom hook */
    const [reservedBusTableWidth, reservedBusTableHeight] = useElementDimensions<HTMLDivElement>(reservedBusTableRef, "Pure");

    /** modal */
    const [SelectStationModal, openSelectStationModal, closeSelectStationModal] = useModal(ModalAnimationType.ZOOM);

    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "", style: { width: "50px", minWidth: "50px", maxWidth: "50px" } },
        { name: "", style: { width: "calc(100% - 50px)" } },
    ];


    /** 버스 정류장 선택 */
    const onSelectingStation = () => {
        openSelectStationModal();
    };


    /** 정류장에 예약된 버스 리스트를 주기적으로 갱신함 */
    useEffect(() => {
        if (taskState === "running" && station) {
            refreshTaskRef.current = setInterval(async () => {
                const apiData = await getReservedBusList(userRole, { arsId: station.arsId });
                const busListInstances = apiData.busInfo.map((bus) => {
                    return new Bus(
                        bus.busRouteId,
                        bus.busRouteNm,
                        bus.busRouteAbrv,
                    );
                });

                console.log(apiData);
                setReservedBusList(busListInstances);
            }, 2000);
        } else {
            if (refreshTaskRef.current) {
                clearInterval(refreshTaskRef.current);
            }
        }

        return () => {
            if (refreshTaskRef.current) {
                clearInterval(refreshTaskRef.current);
            }
        };
    }, [taskState, userRole, station]);



    return (
        <div className={style.ReservedBusTable}>
            {taskState === "running" && (!station
                ? <div className={style.select_station}>
                    <button className={style.select_station__button} type="button" onClick={onSelectingStation}>정류장 선택</button>
                </div>
                : <div className={style.reserved_bus_table} ref={reservedBusTableRef}>
                    {reservedBusList.length > 0
                        ? <VirtualizedTable
                            windowHeight={reservedBusTableHeight}

                            numColumns={tableColumns.length}
                            columnHeight={0}
                            columnWidths={tableColumns.map((column) => column.style)}
                            renderColumns={({ index, columnClassName, columnStyle }) => {
                                return (
                                    <div key={index} className={columnClassName} style={columnStyle}>
                                        {tableColumns[index].name}
                                    </div>
                                );
                            }}

                            numRows={reservedBusList.length}
                            rowHeight={30}
                            renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                                const busInfo = reservedBusList[index].print();
                                return (
                                    <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}>
                                        <div className={itemClassName} style={itemStyles[0]}>{index + 1}</div>
                                        <div className={itemClassName} style={itemStyles[1]}>{busInfo.busRouteAbbreviation}</div>
                                    </div>
                                );
                            }}
                        />
                        : <div className={style.reserved_bus_table__empty}>
                            <h2>예약된 버스가 없습니다.</h2>
                        </div>
                    }
                </div>
            )}

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