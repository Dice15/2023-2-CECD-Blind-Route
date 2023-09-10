import style from "./HomeLeft.module.css"
import { useContext, useEffect, useRef, useState } from "react";
import { SetStationListContext, StationListContext } from "./Home";
import { getPureHeight } from "../../cores/utilities/htmlElementUtil";
import VirtualizedTable from "../virtualizedTable/VirtualizedTable";
import { IStationApi, getStationList } from "../../cores/api/Blindroute";
import Station from "../../cores/types/Station";

export default function HomeLeft() {
    /** ref */
    const stationTable = useRef<HTMLDivElement>(null);

    /** context */
    const [stationListContext, setStationListContext] = [useContext(StationListContext), useContext(SetStationListContext)];

    /** state */
    const [stationListHeight, setStationListHeight] = useState<number>(0);

    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "\u00A0", style: { minWidth: "30px" } },
        { name: "정류장 ID", style: { minWidth: "120px" } },
        { name: "정류장 이름", style: { minWidth: "360px" } },
    ];

    const totalMinWidth = tableColumns.reduce((acc, column) => {
        return acc + (column.style.minWidth ? parseInt(column.style.minWidth.toString(), 10) : 0);
    }, 0);

    tableColumns.forEach(column => {
        if (column.style.minWidth) {
            const widthPercentage = (parseInt(column.style.minWidth.toString(), 10) / totalMinWidth) * 100;
            column.style.width = `${widthPercentage}%`;
        }
    });

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

    /** 정류장 불러오기 */
    const loadStation = async () => {
        if (setStationListContext) {
            const apiData: IStationApi = await getStationList({ searchKeyword: '서울' });
            console.log(apiData);
            const stationInstances: Station[] = apiData.busStations.map((station) => {
                return new Station(
                    station.arsId,
                    station.stId,
                    station.stNm
                );
            });
            setStationListContext(stationInstances);
        }
    };



    return (
        <div className={style.stationList}>
            <div className={style.stationList__loading}>
                <button className={style.stationList__loading_button} type="button" onClick={loadStation}>정류장 검색</button>
            </div>
            <div className={style.stationList__display} ref={stationTable}>
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

                    numRows={stationListContext.length}
                    rowHeight={30}
                    renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                        const stationInfo = stationListContext[index].print();
                        return (
                            <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}>
                                <div className={itemClassName} style={itemStyles[0]}>{index + 1}</div>
                                <div className={itemClassName} style={itemStyles[1]}>{stationInfo.stationId}</div>
                                <div className={itemClassName} style={itemStyles[2]}>{stationInfo.stationName}</div>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}