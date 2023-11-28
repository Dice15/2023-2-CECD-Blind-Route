import style from "./ClientSelectingBus.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientSearchState } from "./ClientSearch";
import Bus from "../../../../cores/types/Bus";
import { getBookmarkList, registerBookmark, removeBookmark, reserveBus } from "../../../../cores/api/blindrouteApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useElementDimensions from "../../../../hooks/useElementDimensions";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { SpeechOutputProvider } from "../../../../modules/speech/SpeechProviders";
import useTouchEvents from "../../../../hooks/useTouchEvents";
import { VibrationProvider } from "../../../../modules/vibration/VibrationProvider";
import useTouchHoldEvents from "../../../../hooks/useTouchHoldEvents";


/** ClientSelectingStation 컴포넌트 프로퍼티 */
export interface ClientSelectingBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientSearchState>>;
    busList: Bus[];
    bookmarkList: Bus[];
    setBookmarkList: React.Dispatch<React.SetStateAction<Bus[]>>;
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>;
}



/** ClientSelectingStation 컴포넌트 */
export default function ClientSelectingBus({ userRole, setPageState, busList, bookmarkList, setBookmarkList, setWishBus }: ClientSelectingBusProps) {
    // Refs
    const busInfoContainer = useRef<HTMLDivElement>(null);
    const busListIndexRef = useRef<number>(0);
    const isSlidingRef = useRef(false); // 슬라이딩 상태 추적을 위한 useRef 사용


    // States
    const [isLoading, setIsLoading] = useState(false);


    // Custom modules
    const [busInfoContainerWidth, busInfoContainerHeight] = useElementDimensions<HTMLDivElement>(busInfoContainer, "Pure");


    // Handler
    /** 즐겨찾기 불러오기 */
    const loadBookmark = useCallback(async () => {
        setIsLoading(true);
        const busList = await getBookmarkList(userRole);
        if (busList.length > 0) {
            setBookmarkList(busList);
        }
        setIsLoading(false);
    }, [userRole, setIsLoading, setBookmarkList]);



    /** 불러온 버스가 즐겨찾기에 등록되어 있는 버스인지 확인 */
    const isBookmarkedBus = (bus: Bus) => {
        return bookmarkList.some((bookmark) =>
            bookmark.stationArsId === bus.stationArsId && bookmark.busRouteId === bus.busRouteId
        );
    };


    /** 즐겨찾기에 추가 */
    const handleSlideChange = (swiper: any) => {
        isSlidingRef.current = true; // 슬라이드 중으로 상태 변경
        VibrationProvider.vibrate(200);
        busListIndexRef.current = swiper.realIndex;
        const bus = busList[busListIndexRef.current];
        SpeechOutputProvider.speak(`"${bus.busRouteAbbreviation || bus.busRouteNumber}", 화면을 두번 터치하면 버스를 예약합니다. 2초간 누르면 즐겨찾기에 추가 또는 해제가 됩니다.`);
        setTimeout(() => isSlidingRef.current = false, 250); // 300ms는 애니메이션 시간에 맞게 조정
    };

    const addBookmark = useCallback(async (bus: Bus) => {
        setIsLoading(true);
        if (await registerBookmark(userRole, bus)) {
            setBookmarkList([...bookmarkList, bus]);
            SpeechOutputProvider.speak(`${bus.busRouteAbbreviation || bus.busRouteNumber}를 즐겨찾기에 등록했습니다`);
        }
        setIsLoading(false);
    }, [userRole, bookmarkList, setBookmarkList]);


    /** 즐겨찾기에서 제거 */
    const removeBookmarkedBus = useCallback(async (bus: Bus) => {
        setIsLoading(true);
        if (await removeBookmark(userRole, bus)) {
            setBookmarkList(bookmarkList.filter(bookmark =>
                bookmark.stationArsId !== bus.stationArsId || bookmark.busRouteId !== bus.busRouteId
            ));
            SpeechOutputProvider.speak(`${bus.busRouteAbbreviation || bus.busRouteNumber}를 즐겨찾기에서 해제하였습니다`);
        }
        setIsLoading(false);
    }, [userRole, bookmarkList, setBookmarkList]);


    /* 누르고 있으면 즐겨찾기에 추가 */
    const handleBookmark = useTouchHoldEvents({
        onTouchStart: () => {
            if (!isSlidingRef.current) {
                VibrationProvider.vibrate(1000);
                const bus = busList[busListIndexRef.current];
                isBookmarkedBus(bus) ? removeBookmarkedBus(bus) : addBookmark(bus);
            }
        },
        touchDuration: 2000

    });


    /** 버스 정보 클릭 이벤트 */
    const handleBusInfoClick = useTouchEvents({
        onSingleTouch: () => {
            if (!isSlidingRef.current) {
                VibrationProvider.vibrate(1000);
                const bus = busList[busListIndexRef.current];
                SpeechOutputProvider.speak(`"${bus.busRouteAbbreviation || bus.busRouteNumber}", 화면을 두번 터치하면 버스를 예약합니다. 2초간 누르면 즐겨찾기에 추가 또는 해제가 됩니다.`);
            }
        },
        onDoubleTouch: () => {
            if (!isSlidingRef.current) {
                VibrationProvider.repeatVibrate(500, 200, 2);
                setIsLoading(true);     // 로딩 모션 on
                setTimeout(async () => {
                    const reserveResult = await reserveBus(userRole, busList[busListIndexRef.current]);

                    if (reserveResult) {
                        SpeechOutputProvider.speak(`버스를 예약하였습니다`);
                        setWishBus(busList[busListIndexRef.current]);
                        setIsLoading(false);    // 로딩 모션 off
                        setPageState("waitingBus");
                    } else {
                        SpeechOutputProvider.speak(`버스를 예약하는데 실패했습니다`);
                        setIsLoading(false);    // 로딩 모션 off
                    }
                }, 500);
            }
        }
    });


    // Effects
    useEffect(() => {
        (async () => {
            await loadBookmark();
            const bus = busList[busListIndexRef.current];
            SpeechOutputProvider.speak(`버스를 선택하세요. "${bus.busRouteAbbreviation || bus.busRouteNumber}", 화면을 두번 터치하면 버스를 예약합니다. 2초간 누르면 즐겨찾기에 추가 또는 해제가 됩니다.`);
        })();
    }, [loadBookmark, busList]);



    // Render
    return (
        <div className={style.ClientSelectingBus}>
            <LoadingAnimation active={isLoading} />

            <div className={style.busInfoContainer} ref={busInfoContainer}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={50}
                    onSlideChange={handleSlideChange}
                    speed={300}
                    loop={true}
                >
                    {busList.map((bus, index) => (
                        <SwiperSlide key={index}>
                            <div className={`${style.busInfo} ${isBookmarkedBus(bus) && style.busInfo_bookmark}`}
                                style={{ height: `${busInfoContainerHeight}px` }}
                                onClick={handleBusInfoClick}
                                onTouchStart={handleBookmark.handleTouchStart}
                                onTouchEnd={handleBookmark.handleTouchEnd}
                            >
                                <h1>{bus.busRouteAbbreviation || bus.busRouteNumber}</h1>
                                <h3>{bus.stationName}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
}