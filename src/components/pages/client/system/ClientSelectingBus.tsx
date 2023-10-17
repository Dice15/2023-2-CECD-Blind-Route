import style from "./ClientSelectingBus.module.css";
import { useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientMiddleState } from "../ClientMiddle";
import Bus from "../../../../cores/types/Bus";
import { reserveBus } from "../../../../cores/api/blindrouteClient";


// module
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useElementDimensions from "../../../../hooks/useElementDimensions";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";



/** ClientSelectingStation 컴포넌트 프로퍼티 */
export interface ClientSelectingBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientMiddleState>>;
    busList: Bus[];
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>
}



/** ClientSelectingStation 컴포넌트 */
export default function ClientSelectingBus({ userRole, setPageState, busList, setWishBus }: ClientSelectingBusProps) {
    // Refs
    const busInfoContainer = useRef<HTMLDivElement>(null);


    // States
    const [busListIndex, setBusListIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);


    // Custom modules
    const [busInfoContainerWidth, busInfoContainerHeight] = useElementDimensions<HTMLDivElement>(busInfoContainer, "Pure");



    /**
     * Handler functions
     */
    /** 이전 단계로 이동: 선택한 버스를 제거하고 이전 단계로 이동 */
    const onPrevStep = () => {
        setWishBus(null);
        setPageState("selectingStation");
    };


    /** 다음 단계로 이동: 선택한 버스를 예약 등록을 함 */
    const onNextStep = async () => {
        setIsLoading(true);
        const reserveResult = await reserveBus(userRole, {
            arsId: busList[busListIndex].stationArsId,
            busRouteId: busList[busListIndex].busRouteId,
            busRouteNm: busList[busListIndex].busRouteNumber,
            busRouteAbrv: busList[busListIndex].busRouteAbbreviation,
        });
        setIsLoading(false);

        if (reserveResult) {
            setWishBus(busList[busListIndex]);
            setPageState("waitingBus");
        } else {
            alert(`${busList[busListIndex].busRouteAbbreviation} 버스를 등록하는데 실패했습니다`);
        }
    }



    // Render
    return (
        <div className={style.ClientSelectingBus}>
            <LoadingAnimation active={isLoading} />

            <button className={style.button_movePrev} type="button" onClick={onPrevStep}>
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

            <button className={style.button_moveNext} type="button" onClick={onNextStep}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 L15,30 L5,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M20,15 L30,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}