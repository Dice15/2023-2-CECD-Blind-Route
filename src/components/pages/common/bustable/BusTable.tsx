import { registerBus } from "../../../../cores/api/blindrouteClient";
import Bus from "../../../../cores/types/Bus";
import { UserRole } from "../../../../cores/types/UserRole";
import useElementDimensions from "../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../modules/virtualizedTable/VirtualizedTable";
import style from "./BusTable.module.css"
import { useRef, useState } from "react";



/** 버스 테이블 프로퍼티 */
export interface BusTableProps {
    userRole: UserRole;
    arsId: string;
    busList: Bus[];
    onClose?: () => void;
}



/** 버스 테이블 */
export default function BusTable({ userRole, arsId, busList, onClose }: BusTableProps) {
    /** ref */
    const busTable = useRef<HTMLDivElement>(null);
    const destinationName = useRef<HTMLInputElement>(null);

    /** state */
    const [filteredBusList, setFilteredBusList] = useState<Bus[]>(busList);

    /** custom hook */
    const [busListWidth, busListHeight] = useElementDimensions<HTMLDivElement>(busTable, "Pure");

    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "", style: { width: "50px", minWidth: "50px", maxWidth: "50px" } },
        { name: "", style: { width: "calc(100% - 50px)" } },
    ];


    /** 도착지에 다른 버스 정류장 필터링 */
    const onFilterBus = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (destinationName.current) {
            if (destinationName.current.value.length > 0) {
                const newBusList = busList.filter((bus) => {
                    return bus.busDestinationList.some((destination) => destination.stationName.includes(destinationName.current!.value));
                });
                console.log(newBusList);
                setFilteredBusList(newBusList);
            } else {
                setFilteredBusList(busList);
            }
        }
    };


    /** 버스 선택 및 등록 */
    const onSelectBus = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.id || "-1");
        const selectedBus = filteredBusList[selectedIndex];

        if (selectedBus) {
            const busApiData = await registerBus(userRole, {
                arsId: arsId,
                busRouteId: selectedBus.busRouteId,
                busRouteNm: selectedBus.busRouteNumber,
                busRouteAbrv: selectedBus.busRouteAbbreviation,
            });

            if (busApiData === "success") {
                alert("버스 등록 완료");
            } else {
                alert("버스 등록 실패");
            }
        }
    };


    return (
        <div className={style.BusTable}>
            <div className={style.busList} onDoubleClick={onClose}>
                <div className={style.busList__filter}>
                    <input className={style.busList__filter_text} type="text" placeholder="도착 정류장 입력" ref={destinationName} />
                    <button className={style.busList__filter_button} type="button" onClick={onFilterBus}>검색</button>
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
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle} onClick={onSelectBus}>
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