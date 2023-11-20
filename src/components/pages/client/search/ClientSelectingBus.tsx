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
import useTapEvents from "../../../../hooks/useTapEvents";
import { VibrationProvider } from "../../../../modules/vibration/VibrationProvider";


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
    // const modify
    const addBookmark = useCallback(async (bus: Bus) => {
        setIsLoading(true);
        if (await registerBookmark(userRole, bus)) {
            setBookmarkList([...bookmarkList, bus]);
            SpeechOutputProvider.speak(`${bus.busRouteAbbreviation}를 즐겨찾기에 등록했습니다`);
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
            SpeechOutputProvider.speak(`${bus.busRouteAbbreviation}를 즐겨찾기에서 해제하였습니다`);
        }
        setIsLoading(false);
    }, [userRole, bookmarkList, setBookmarkList]);


    /** 버스 정보 클릭 이벤트 */
    const handleBusInfoClick = useTapEvents({
        onSingleTouch: () => {
            VibrationProvider.vibrate(1000);
            const bus = busList[busListIndexRef.current];
            SpeechOutputProvider.speak(`"${bus.busRouteAbbreviation}" 세번 터치하면 버스를 예약합니다.`);
        },
        onDoubleTouch: () => {
            VibrationProvider.repeatVibrate(500, 200, 2);
            const bus = busList[busListIndexRef.current];
            isBookmarkedBus(bus) ? removeBookmarkedBus(bus) : addBookmark(bus);
        },
        onTripleTouch: () => {
            VibrationProvider.repeatVibrate(500, 200, 3);
            // 로딩 모션 on
            setIsLoading(true);

            // 버스 예약
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
    });


    // Effects
    useEffect(() => {
        (async () => {
            await loadBookmark();
            const bus = busList[busListIndexRef.current];
            SpeechOutputProvider.speak(`버스를 선택하세요. 두번 터치하면 즐겨찾기에 등록됩니다. "${bus.busRouteAbbreviation}" 세번 터치하면 버스를 예약합니다.`);
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
                    onSlideChange={(swiper: any) => {
                        busListIndexRef.current = swiper.realIndex;
                        VibrationProvider.vibrate(200);
                        handleBusInfoClick();
                    }}

                    loop={true}
                >
                    {busList.map((bus, index) => (
                        <SwiperSlide key={index}>
                            <div className={`${style.busInfo} ${isBookmarkedBus(bus) && style.busInfo_bookmark}`}
                                style={{ height: `${busInfoContainerHeight}px` }}
                                onClick={handleBusInfoClick}
                            >
                                <h1>{bus.busRouteAbbreviation}</h1>
                                <h3>{bus.stationName}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
}