import { useCallback, useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import style from "./SelectingStation.module.css";
import Station from "../../../../cores/types/Station";
import useElementDimensions from "../../../../hooks/useElementDimensions";
import { getStationList } from "../../../../cores/api/blindrouteClient";
import VirtualizedTable from "../../../../modules/virtualizedTable/VirtualizedTable";



/** 정류장 선택 컴포넌트 프로퍼티 */
export interface SelectingStationProps {
    userRole: UserRole;
    setStation: React.Dispatch<React.SetStateAction<Station | null>>;
    onClose: () => void;
}



/** 정류장 선택 컴포넌트 프로퍼티 */
export default function SelectingStation({ userRole, setStation, onClose }: SelectingStationProps) {
    /** ref */
    const stationTable = useRef<HTMLDivElement>(null);
    const stationName = useRef<HTMLInputElement>(null);

    /** state */
    const [stationList, setStationList] = useState<Station[]>([]);

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
            setStation(selectedStation);
            onClose();
        }
    }, [stationList, setStation, onClose]);



    return (
        <div className={style.SelectStation}>
            <div className={style.stationtable}>
                <div className={style.stationtable__loading}>
                    <input className={style.stationtable__loading_text} type="text" placeholder="정류장 검색" ref={stationName} />
                    <button className={style.stationtable__loading_button} type="button" onClick={loadStation}>검색</button>
                </div>
                <div className={style.stationtable__display} ref={stationTable} style={{ visibility: "hidden" }}>
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
        </div>
    );
}