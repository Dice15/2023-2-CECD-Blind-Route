import style from "./HomeMiddle.module.css"
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SelectedStationContext, SetSelectedStationContext, SetStationListContext, StationListContext } from "./Home";
import { getPureHeight } from "../../cores/utilities/htmlElementUtil";
import VirtualizedTable from "../virtualizedTable/VirtualizedTable";
import { IStationApi, getRoute, getStationList } from "../../cores/api/Blindroute";
import Station from "../../cores/types/Station";

export default function HomeMiddle() {
    /** ref */
    const stationTable = useRef<HTMLDivElement>(null);
    const stationName = useRef<HTMLInputElement>(null);

    /** context */
    const [stationList, setStationList] = [useContext(StationListContext), useContext(SetStationListContext)];
    // const [selectedStation, setSelectedStation] = [useContext(SelectedStationContext), useContext(SetSelectedStationContext)];

    /** state */
    const [stationListHeight, setStationListHeight] = useState<number>(0);

    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "\u00A0", style: { width: "40px", minWidth: "40px", maxWidth: "40px" } },
        { name: "정류장 이름", style: { width: "calc(100% - 40px)" } },
    ];

    /** 브라우저의 확대/축소에 따른 가상테이블 높이 재설정 */
    useEffect(() => {
        const currentTable = stationTable.current;
        let frameId: number | null = null;

        const observerCallback = () => {
            const newHeight: number = getPureHeight(stationTable) || 0;

            if (stationListHeight !== newHeight) {
                if (frameId) { cancelAnimationFrame(frameId); }
                frameId = requestAnimationFrame(() => { setStationListHeight(newHeight); });
            }
        };

        const observer = new ResizeObserver(observerCallback);

        if (currentTable) {
            observer.observe(currentTable);
        }

        return () => {
            if (currentTable) {
                observer.unobserve(currentTable);
            }
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [stationListHeight]);

    /** 정류장이 비어있다면, 테이블을 보이지 않게 함 */
    useEffect(() => {
        if (stationTable.current) {
            stationTable.current.style.visibility = stationList.length ? "visible" : "hidden";
        }
    }, [stationList]);

    /** 정류장 불러오기 */
    const loadStation = async () => {
        if (setStationList && stationName.current) {
            const apiData: IStationApi = await getStationList({ searchKeyword: stationName.current.value });
            console.log(apiData);
            const stationInstances: Station[] = apiData.busStations.map((station) => {
                return new Station(
                    station.arsId,
                    station.stId,
                    station.stNm
                );
            });
            setStationList(stationInstances);
        }
    };

    /** 정류장 선택 */
    const selectStation = useCallback(async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.id || "-1");
        const selectedStation = stationList[selectedIndex];

        if (selectedStation) {
            const result = await getRoute({ stId: selectedStation.stationId });
            alert(result ? `서버에 ${selectedStation.stationName}의 stationId 전송 성공` : `서버에 ${selectedStation.stationName}의 stationId 전송 실패`);
        }
    }, [stationList]);



    return (
        <div className={style.stationList}>
            <div className={style.stationList__loading}>
                <input className={style.stationList__loading_text} type="text" placeholder="정류장 검색" ref={stationName} />
                <button className={style.stationList__loading_button} type="button" onClick={loadStation}>검색</button>
            </div>
            <div className={style.stationList__display} ref={stationTable} style={{ visibility: "hidden" }}>
                <VirtualizedTable
                    windowHeight={stationListHeight}

                    numColumns={tableColumns.length}
                    columnHeight={30}
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
    );
}