import style from "./StationTable.module.css"
import { useCallback, useEffect, useRef, useState } from "react";
import { getBusDestinationList, getBusList, getStationList } from "../../../../cores/api/blindrouteClient";
import Bus from "../../../../cores/types/Bus";
import Station from "../../../../cores/types/Station";
import { UserRole } from "../../../../cores/types/UserRole";
import { useModal } from "../../../modules/modal/Modal";
import { ModalAnimationType } from "../../../modules/modal/ModalAnimations";
import VirtualizedTable from "../../../modules/virtualizedTable/VirtualizedTable";
import BusTable from "../bustable/BusTable";
import useElementDimensions from "../../../../hooks/useElementDimensions";



/** 정류장 테이블 프로퍼티 */
export interface StationTableProps {
    userRole: UserRole;
}



/** 정류장 테이블 */
export default function StationTable({ userRole }: StationTableProps) {
    /** ref */
    const stationTable = useRef<HTMLDivElement>(null);
    const stationName = useRef<HTMLInputElement>(null);

    /** state */
    const [stationList, setStationList] = useState<Station[]>([]);
    const [busList, setBusList] = useState<Bus[]>([]);
    const [arsId, setArsId] = useState<string>("");

    /** modal */
    const [BusTableModal, openBusTableModal, closeBusTableModal] = useModal(ModalAnimationType.ZOOM);

    /** custom hook */
    const [stationListWidth, stationListHeight] = useElementDimensions<HTMLDivElement>(stationTable, "Pure");

    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "", style: { minWidth: "50px" } },
        { name: "", style: { minWidth: "calc(100% - 50px)" } },
    ];

    /** 정류장이 비어있다면, 테이블을 보이지 않게 함 */
    useEffect(() => {
        if (stationTable.current) {
            stationTable.current.style.visibility = stationList.length ? "visible" : "hidden";
        }
    }, [stationList]);


    /** 정류장 불러오기 */
    const loadStation = async () => {
        if (stationName.current) {
            const apiData = await getStationList(userRole, { searchKeyword: stationName.current.value });
            const stationInstances: Station[] = apiData.busStations.map((station) => {
                return new Station(
                    station.arsId,
                    station.stId,
                    station.stNm
                );
            });

            setStationList(stationInstances);

            if (stationInstances.length === 0) {
                alert("검색된 정류장이 없음");
            }
        }
    };


    /** 정류장 선택 */
    const selectStation = useCallback(async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.id || "-1");
        const selectedStation = stationList[selectedIndex];

        if (selectedStation) {
            const busApiData = await getBusList(userRole, { arsId: selectedStation.arsId });
            const busInstances: Bus[] = await Promise.all(busApiData.busList.filter((bus) => bus.busRouteId !== undefined).map(async (bus) => {
                const destinationApiData = await getBusDestinationList(userRole, { busRouteId: bus.busRouteId! });
                const destinationInstances = destinationApiData.destinations.map((destination) => {
                    return {
                        stationName: destination.stationNm,
                        direction: destination.direction
                    };
                })

                return new Bus(
                    bus.busRouteId,
                    bus.busRouteNm,
                    bus.busRouteAbrv,
                    destinationInstances,
                );
            }));

            console.log(selectedStation.arsId)
            console.log(busInstances)
            setArsId(selectedStation.arsId);
            setBusList(busInstances);
            openBusTableModal();
        }
    }, [stationList, setBusList, openBusTableModal, userRole]);



    return (
        <div className={style.StationTable}>
            <div className={style.stationList}>
                <div className={style.stationList__loading}>
                    <input className={style.stationList__loading_text} type="text" placeholder="정류장 검색" ref={stationName} />
                    <button className={style.stationList__loading_button} type="button" onClick={loadStation}>검색</button>
                </div>
                <div className={style.stationList__display} ref={stationTable} style={{ visibility: "hidden" }}>
                    <VirtualizedTable
                        windowHeight={stationListHeight}

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

                        numRows={stationList.length}
                        rowHeight={30}
                        renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                            const stationInfo = stationList[index].print();
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle} onClick={(e) => {
                                    selectStation(e);
                                }}>
                                    <div className={itemClassName} style={itemStyles[0]}>{index + 1}</div>
                                    <div className={itemClassName} style={itemStyles[1]}>{stationInfo.stationName}</div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>

            {busList.length > 0 &&
                <BusTableModal>
                    <BusTable
                        userRole={userRole}
                        arsId={arsId}
                        busList={busList}
                        onClose={() => {
                            if (setBusList) {
                                setBusList([]);
                                closeBusTableModal();
                            }
                        }} />
                </BusTableModal>
            }
        </div>
    );
}