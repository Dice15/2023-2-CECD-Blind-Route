import style from "./PanelReservedBus.module.css";
import { UserRole } from "../../../../cores/types/UserRole";
import { useEffect, useRef, useState } from "react";
import Station from "../../../../cores/types/Station";
import Bus from "../../../../cores/types/Bus";
import { getReservedBusList } from "../../../../cores/api/blindroutePanel";
import VirtualizedTable from "../../../../modules/virtualizedTable/VirtualizedTable";
import useElementDimensions from "../../../../hooks/useElementDimensions";


/** 정류장에 예약된 버스를 보여주는 컴포넌트  프로퍼티 */
export interface PanelReservedBusProps {
    userRole: UserRole;
    wishStation: Station;
}



/** 정류장에 예약된 버스를 보여주는 컴포넌트 */
export default function PanelReservedBus({ userRole, wishStation }: PanelReservedBusProps) {
    /** ref */
    const refreshTaskRef = useRef<NodeJS.Timeout | null>(null);
    const reservedBusTableRef = useRef<HTMLDivElement | null>(null);


    // state
    const [busList, setBusList] = useState<Bus[]>([]);


    // custom module
    const [reservedBusTableWidth, reservedBusTableHeight] = useElementDimensions<HTMLDivElement>(reservedBusTableRef, "Pure");


    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "", style: { width: "50px", minWidth: "50px", maxWidth: "50px" } },
        { name: "예약된 버스", style: { width: "calc(100% - 50px)" } },
    ];


    /** 정류장에 예약된 버스 리스트를 주기적으로 갱신함 */
    useEffect(() => {
        refreshTaskRef.current = setInterval(async () => {
            const reponsedReservedBusList = await getReservedBusList(userRole, { arsId: wishStation.arsId });
            //setBusList([new Bus("111111", "111111", "1119", "1119"), new Bus("111111", "222222", "1128", "1128")]);
            console.log(reponsedReservedBusList);
            setBusList(reponsedReservedBusList);
        }, 2000);


        return () => {
            if (refreshTaskRef.current) {
                clearInterval(refreshTaskRef.current);
                setBusList([]);
            }
        };
    }, [userRole, wishStation]);



    return (<div className={style.PanelReservedBus} ref={reservedBusTableRef}>
        <VirtualizedTable
            windowHeight={reservedBusTableHeight}

            numColumns={tableColumns.length}
            columnHeight={50}
            columnWidths={tableColumns.map((column) => column.style)}
            renderColumns={({ index, columnClassName, columnStyle }) => {
                return (
                    <div key={index} className={columnClassName} style={columnStyle}>
                        {tableColumns[index].name}
                    </div>
                );
            }}

            numRows={busList.length}
            rowHeight={40}
            renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                const busInfo = busList[index].print();
                return (
                    <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}>
                        <div className={itemClassName} style={itemStyles[0]}>{index + 1}</div>
                        <div className={itemClassName} style={itemStyles[1]}>{busInfo.busRouteAbbreviation}</div>
                    </div>
                );
            }}
        />
    </div>);
}