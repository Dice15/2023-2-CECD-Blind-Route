import style from "./ClientSelectingStation.module.css";
import React, { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientSearchState } from "./ClientSearch";
import Station from "../../../../cores/types/Station";
import Bus from "../../../../cores/types/Bus";
import { getBusList } from "../../../../cores/api/blindrouteApi";

// module
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useElementDimensions from "../../../../hooks/useElementDimensions";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { SpeechOutputProvider } from "../../../../modules/speech/SpeechProviders";
import { VibrationProvider } from "../../../../modules/vibration/VibrationProvider";
import useTapEvents from "../../../../hooks/useTapEvents";


/** ClientSelectingStation 컴포넌트 프로퍼티 */
export interface ClientSelectingStationProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientSearchState>>;
    stationList: Station[];
    setBusList: React.Dispatch<React.SetStateAction<Bus[]>>
}



/** ClientSelectingStation 컴포넌트 */
export default function ClientSelectingStation({ userRole, setPageState, stationList, setBusList }: ClientSelectingStationProps) {
    // ref
    const stationInfoContainer = useRef<HTMLDivElement>(null);
    const stationListIndexRef = useRef<number>(0);  // useRef를 사용하여 현재 인덱스를 저장



    // state
    //    const [stationListIndex, setStationListIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // custom module
    const [stationInfoContainerWidth, stationInfoContainerHeight] = useElementDimensions<HTMLDivElement>(stationInfoContainer, "Pure");



    /** 이전 단계로 이동: 선택한 정류장의 버스 리스트를 불러오고 페이지 상태 업데이트 */
    const handlePrevStepClick = useTapEvents({
        onSingleTouch: () => {
            // 진동 1초
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("더블 터치하면 정류장 검색 페이지로 돌아갑니다");
        },
        onDoubleTouch: () => {
            // 더블 터치 진동
            VibrationProvider.repeatVibrate(500, 200, 2);

            // 버스 리스트 비우기
            setBusList([]);

            // 이전 상태로 변경
            setPageState("searchingStation");
        }
    });



    /** 다음 단계로 이동: 선택한 정류장의 버스 리스트를 불러오고 페이지 상태 업데이트 */
    const handleNextStepClick = useTapEvents({
        onSingleTouch: () => {
            // 진동 1초
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("더블 터치하면 정류장의 버스를 검색합니다.");
        },
        onDoubleTouch: async () => {
            // 더블 터치 진동
            VibrationProvider.repeatVibrate(500, 200, 2);

            // 음성 출력
            SpeechOutputProvider.speak("버스를 검색합니다");

            // 로딩 모션 On
            setIsLoading(true);

            // 버스 검색
            setTimeout(async () => {
                const responsedBusList: Bus[] = await getBusList(
                    userRole,
                    stationList[stationListIndexRef.current].arsId,
                    stationList[stationListIndexRef.current].stationName
                );

                if (responsedBusList.length > 0) {
                    //setBusList([new Bus("111111", "111111", "1119", "1119"), new Bus("111111", "222222", "1128", "1128")]);
                    setBusList(responsedBusList);
                    setTimeout(() => {
                        setIsLoading(false);    // 로딩 모션 off
                        setPageState("selectingBus");
                    }, 500);
                } else {
                    SpeechOutputProvider.speak(`검색된 버스가 없습니다`);
                    setIsLoading(false);    // 로딩 모션 off
                }
            }, 500);
        }
    });






    /** 버스 정보 클릭 이벤트 */
    const handleBusInfoClick = useTapEvents({
        onSingleTouch: () => {
            const station = stationList[stationListIndexRef.current];
            SpeechOutputProvider.speak(`${station.stationName}`);
        },
    });



    // Effects
    useEffect(() => {
        const station = stationList[stationListIndexRef.current];
        SpeechOutputProvider.speak(`정류장을 선택하세요, ${station.stationName}`);
    }, [stationList]);



    // Render
    return (
        <div className={style.ClientSelectingStation}>
            <LoadingAnimation active={isLoading} />

            <button className={style.button_movePrev} type="button" onClick={handlePrevStepClick}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

            <div className={style.stationInfoContainer} ref={stationInfoContainer}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={50}
                    onSlideChange={(swiper: any) => {
                        stationListIndexRef.current = swiper.realIndex;
                        VibrationProvider.vibrate(200);
                        handleBusInfoClick();
                    }}
                    loop={true}
                >
                    {stationList.map((station, index) => (
                        <SwiperSlide key={index}>
                            <div className={style.stationInfo}
                                style={{ height: `${stationInfoContainerHeight}px` }}
                                onClick={handleBusInfoClick}
                            >
                                <h1>{station.stationName}</h1>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <button className={style.button_moveNext} type="button" onClick={() => { handleNextStepClick(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 L15,30 L5,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M20,15 L30,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}