import style from "./PanelSelectingStation.module.css";
import React, { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import Station from "../../../../cores/types/Station";

// module
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useElementDimensions from "../../../../hooks/useElementDimensions";
import { PanelMiddleState } from "../PanelMiddle";



/** PanelSelectingStation 컴포넌트 프로퍼티 */
export interface PanelSelectingStationProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<PanelMiddleState>>;
    stationList: Station[];
    setWishStation: React.Dispatch<React.SetStateAction<Station | null>>
}



/** PanelSelectingStation 컴포넌트 */
export default function PanelSelectingStation({ userRole, setPageState, stationList, setWishStation }: PanelSelectingStationProps) {
    // ref
    const stationInfoContainer = useRef<HTMLDivElement>(null);


    // state
    const [stationListIndex, setStationListIndex] = useState<number>(0);


    // custom module
    const [stationInfoContainerWidth, stationInfoContainerHeight] = useElementDimensions<HTMLDivElement>(stationInfoContainer, "Pure");



    /** 이전 단계로 이동: 선택한 정류장 제거 */
    const onPrevStep = () => {
        setWishStation(null);
        setPageState("searchingStation");
    };



    /** 다음 단계로 이동: 정류장을 선택하고 다음 상태로 업데이트 */
    const onNextStep = async () => {
        setWishStation(stationList[stationListIndex]);
        setPageState("dectectingBus");
    }



    /** 이 컨트롤러가 처음 켜졌을 때는 정류장 초기화 */
    useEffect(() => {
        setWishStation(null);
    }, [setWishStation]);



    return (
        <div className={style.PanelSelectingStation}>
            <button className={style.button_movePrev} type="button" onClick={() => { onPrevStep(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.stationInfoContainer} ref={stationInfoContainer}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={50}
                    onSlideChange={(swiper: any) => { setStationListIndex(swiper.realIndex); }}
                    loop={true}
                >
                    {stationList.map((station, index) => (
                        <SwiperSlide key={index}>
                            <div className={style.stationInfo} style={{ height: `${stationInfoContainerHeight}px` }}>
                                <h1>{station.stationName}</h1>
                                <h3>{`id: ${station.stationId}`}</h3>
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