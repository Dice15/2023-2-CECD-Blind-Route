import style from "./BusTable.module.css"
import Bus from "../../cores/types/Bus";
import VirtualizedTable from "../virtualizedTable/VirtualizedTable";
import { useContext, useEffect, useRef, useState } from "react";
import { BusListContext, SetBusListContext } from "./Client";
import { getPureHeight } from "../../cores/utilities/htmlElementUtil";

export interface BusTableProps {
    busList: Bus[];
    onClose?: () => void;
}

export default function BusTable({ busList, onClose }: BusTableProps) {
    /** ref */
    const busTable = useRef<HTMLDivElement>(null);
    const destinationName = useRef<HTMLInputElement>(null);

    /** state */
    const [busListHeight, setBusListHeight] = useState<number>(0);
    const [filteredBusList, setFilteredBusList] = useState<Bus[]>(busList);

    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "", style: { width: "50px", minWidth: "50px", maxWidth: "50px" } },
        { name: "", style: { width: "calc(100% - 50px)" } },
    ];

    /** 브라우저의 확대/축소에 따른 가상테이블 높이 재설정 */
    useEffect(() => {
        const currentBusTable = busTable.current;
        let frameId: number | null = null;

        const observerCallback = () => {
            const newBusTableHeight: number = getPureHeight(busTable) || 0;

            if (busListHeight !== newBusTableHeight) {
                if (frameId) { cancelAnimationFrame(frameId); }
                frameId = requestAnimationFrame(() => { setBusListHeight(newBusTableHeight); });
            }
        };

        const observer = new ResizeObserver(observerCallback);

        if (currentBusTable) {
            observer.observe(currentBusTable);
        }

        return () => {
            if (currentBusTable) {
                observer.unobserve(currentBusTable);
            }
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [busListHeight]);


    /** 도착지에 다른 버스 정류장 필터링 */
    const filterBus = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (destinationName.current) {
            if (destinationName.current.value.length > 0) {
                const newBusList = busList.filter((bus) => {
                    return bus.busDestination.some((destination) => destination.stationName.includes(destinationName.current!.value));
                });
                console.log(newBusList);
                setFilteredBusList(newBusList);
            } else {
                setFilteredBusList(busList);
            }
        }
    };


    return (
        <div className={style.BusTable}>
            <div className={style.busList}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button className={style.busList__filter_closeButton} type="button" onClick={onClose}>닫기</button>
                </div>

                <div className={style.busList__filter}>
                    <input className={style.busList__filter_text} type="text" placeholder="도착 정류장 입력" ref={destinationName} />
                    <button className={style.busList__filter_button} type="button" onClick={filterBus}>검색</button>
                </div>

                <div className={style.busList__display} ref={busTable}>
                    <VirtualizedTable
                        windowHeight={busListHeight}

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

                        numRows={filteredBusList.length}
                        rowHeight={30}
                        renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                            const busInfo = filteredBusList[index].print();
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle} onClick={(e) => { }}>
                                    <div className={itemClassName} style={itemStyles[0]}>{index + 1}</div>
                                    <div className={itemClassName} style={itemStyles[1]}>{busInfo.busRouteNumber}</div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
}