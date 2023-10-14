import style from "./ClientSelectingStation.module.css";
import { useEffect, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientMiddleState } from "../ClientMiddle";
import Station from "../../../../cores/types/Station";
import Bus from "../../../../cores/types/Bus";
import { getBusDestinationList, getBusList } from "../../../../cores/api/blindrouteClient";



/** ClientSelectingStation 컴포넌트 프로퍼티 */
export interface ClientSelectingStationProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientMiddleState>>;
    stationList: Station[];
    setBusList: React.Dispatch<React.SetStateAction<Bus[]>>
}



/** ClientSelectingStation 컴포넌트 */
export default function ClientSelectingStation({ userRole, setPageState, stationList, setBusList }: ClientSelectingStationProps) {
    // state
    const [stationListIndex, setStationListIndex] = useState<number>(0);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);



    /** 정류장을 보여주는 div의 터치 이벤트 시작 */
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    }



    /** 정류장을 보여주는 div의 터치 이벤트 끝 */
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY === null) return;

        const deltaY = touchStartY - e.changedTouches[0].clientY;
        setTouchStartY(null); // Reset touch start position

        if (deltaY > 30) { // 위로 스와이프
            if (stationListIndex < stationList.length - 1) {
                setStationListIndex(prev => prev + 1);
            } else {
                setStationListIndex(0);
            }
        } else if (deltaY < -30) { // 아래로 스와이프
            if (stationListIndex > 0) {
                setStationListIndex(prev => prev - 1);
            } else {
                setStationListIndex(stationList.length - 1);
            }
        }
    }



    /** 이전 단계로 이동: 선택한 정류장의 버스 리스트를 불러오고 페이지 상태 업데이트 */
    const onPrevStep = () => {
        setBusList([]);
        setPageState("searchingStation");
    };



    /** 다음 단계로 이동: 선택한 정류장의 버스 리스트를 불러오고 페이지 상태 업데이트 */
    const onNextStep = async () => {
        const busApiData = await getBusList(userRole, { arsId: stationList[stationListIndex].arsId });
        const busInstances: Bus[] = await Promise.all(busApiData.busList.filter((bus) => bus.busRouteId !== undefined).map(async (bus) => {
            const destinationApiData = await getBusDestinationList(userRole, { busRouteId: bus.busRouteId! });
            const destinationInstances = destinationApiData.destinations.map((destination) => {
                return {
                    stationName: destination.stationNm,
                    direction: destination.direction
                };
            })

            return new Bus(
                stationList[stationListIndex].arsId,
                bus.busRouteId,
                bus.busRouteNm,
                bus.busRouteAbrv,
                destinationInstances,
            );
        }));

        if (busInstances.length >= 0) {
            setBusList([
                new Bus("111111", "111111", "1119", "1119"),
                new Bus("111111", "222222", "1128", "1128")
            ]);
            setPageState("selectingBus");
        } else {
            alert(`${stationList[stationListIndex].stationName}에서 검색된 버스가 없습니다`);
        }
    }



    /** 이 컨트롤러가 처음 켜졌을 때는 버스 리스트 초기화 */
    useEffect(() => {
        setBusList([]);
    }, [setBusList]);



    return (
        <div className={style.ClientSelectingStation}>
            <button className={style.button_movePrev} type="button" onClick={() => { onPrevStep(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.stationInfo} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <h1>{stationList[stationListIndex].stationName}</h1>
                <h3>{stationList[stationListIndex].stationId}</h3>
            </div>

            <button className={style.button_moveNext} type="button" onClick={() => { onNextStep(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 L15,30 L5,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M20,15 L30,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}