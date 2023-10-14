import style from "./ClientSelectingBus.module.css";
import { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientMiddleState } from "../ClientMiddle";
import Bus from "../../../../cores/types/Bus";
import { reserveBus } from "../../../../cores/api/blindrouteClient";


// module
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useElementDimensions from "../../../../hooks/useElementDimensions";



/** ClientSelectingStation 컴포넌트 프로퍼티 */
export interface ClientSelectingBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientMiddleState>>;
    busList: Bus[];
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>
}



/** ClientSelectingStation 컴포넌트 */
export default function ClientSelectingBus({ userRole, setPageState, busList, setWishBus }: ClientSelectingBusProps) {
    // ref
    const busInfoContainer = useRef<HTMLDivElement>(null);


    // state
    const [busListIndex, setBusListIndex] = useState<number>(0);


    // custom module
    const [busInfoContainerWidth, busInfoContainerHeight] = useElementDimensions<HTMLDivElement>(busInfoContainer, "Pure");



    /** 이전 단계로 이동: 선택한 정류장의 버스 리스트를 불러오고 페이지 상태 업데이트 */
    const onPrevStep = () => {
        setWishBus(null);
        setPageState("selectingStation");
    };



    /** 다음 단계로 이동: 선택한 정류장의 버스 리스트를 불러오고 페이지 상태 업데이트 */
    const onNextStep = async () => {
        const reserveApiData = await reserveBus(userRole, {
            arsId: busList[busListIndex].stationArsId,
            busRouteId: busList[busListIndex].busRouteId,
            busRouteNm: busList[busListIndex].busRouteNumber,
            busRouteAbrv: busList[busListIndex].busRouteAbbreviation,
        });

        if (reserveApiData === "success") {
            setWishBus(busList[busListIndex]);
            setPageState("waitingBus");
        } else {
            alert(`${busList[busListIndex].busRouteAbbreviation} 버스를 등록하는데 실패했습니다`);
        }
    }



    /** 이 컨트롤러가 처음 켜졌을 때는 버스 리스트 초기화 */
    useEffect(() => {
        setWishBus(null);
    }, [setWishBus]);



    return (
        <div className={style.ClientSelectingBus}>
            <button className={style.button_movePrev} type="button" onClick={() => { onPrevStep(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.busInfoContainer} ref={busInfoContainer}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={50}
                    onSlideChange={(swiper: any) => { setBusListIndex(swiper.realIndex); }}
                    loop={true}
                >
                    {busList.map((bus, index) => (
                        <SwiperSlide key={index}>
                            <div className={style.busInfo} style={{ height: `${busInfoContainerHeight}px` }}>
                                <h1>{bus.busRouteAbbreviation}</h1>
                                <h3>{`id: ${bus.busRouteId}`}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
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