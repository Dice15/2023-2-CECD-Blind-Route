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
import useTouchEvents from "../../../../hooks/useTouchEvents";


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
    const isSlidingRef = useRef(false); // 슬라이딩 상태 추적을 위한 useRef 사용


    // state
    const [isLoading, setIsLoading] = useState(false);


    // custom module
    const [stationInfoContainerWidth, stationInfoContainerHeight] = useElementDimensions<HTMLDivElement>(stationInfoContainer, "Pure");


    // Handler
    const handleSlideChange = (swiper: any) => {
        isSlidingRef.current = true; // 슬라이드 중으로 상태 변경
        VibrationProvider.vibrate(200);
        stationListIndexRef.current = swiper.realIndex;
        const station = stationList[stationListIndexRef.current];
        SpeechOutputProvider.speak(`"${station.stationName}", 화면을 두번 터치하면 정류장의 버스를 검색합니다.`);
        setTimeout(() => isSlidingRef.current = false, 250); // 300ms는 애니메이션 시간에 맞게 조정
    };

    const handleBusInfoClick = useTouchEvents({
        onSingleTouch: () => {
            if (!isSlidingRef.current) {
                VibrationProvider.vibrate(1000);
                const station = stationList[stationListIndexRef.current];
                SpeechOutputProvider.speak(`"${station.stationName}", 화면을 두번 터치하면 정류장의 버스를 검색합니다.`);
            }
        },
        onDoubleTouch: () => {
            if (!isSlidingRef.current) {
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
        }
    });


    // Effects
    useEffect(() => {
        const station = stationList[stationListIndexRef.current];
        SpeechOutputProvider.speak(`정류장을 선택하세요, "${station.stationName}", 화면을 두번 터치하면 정류장의 버스를 검색합니다.`);
    }, [stationList]);


    // Render
    return (
        <div className={style.ClientSelectingStation}>
            <LoadingAnimation active={isLoading} />

            <div className={style.stationInfoContainer} ref={stationInfoContainer}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={50}
                    onSlideChange={handleSlideChange}
                    speed={300}
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

        </div>
    );
}