import style from "./ClientSelectingBus.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import { ClientSearchState } from "./ClientSearch";
import Bus from "../../../../cores/types/Bus";
import { getBookmarkList, registerBookmark, removeBookmark, reserveBus } from "../../../../cores/api/blindrouteApi";


// module
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useElementDimensions from "../../../../hooks/useElementDimensions";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { SpeechOutputProvider } from "../../../../modules/speech/SpeechProviders";
import { useGesture } from "@use-gesture/react";


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
        const reserveResult = await reserveBus(userRole, busList[busListIndex]);
        setIsLoading(false);

        if (reserveResult) {
            SpeechOutputProvider.speak(`${busList[busListIndex].busRouteAbbreviation} 버스를 예약하였습니다`);
            setWishBus(busList[busListIndex]);
            setPageState("waitingBus");
        } else {
            SpeechOutputProvider.speak(`${busList[busListIndex].busRouteAbbreviation} 버스를 예약하는데 실패했습니다`);
        }
    }



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



    /** 버스 정보 더블 클릭 이벤트 */
    const busInfoClickGestureBind = useGesture({
        onClick: ({ args }) => {
            const bus: Bus = args[0];
            SpeechOutputProvider.speak(`${bus.busRouteAbbreviation}, ${bus.stationName}`);
        },
        onDoubleClick: ({ args }) => {
            const bus: Bus = args[0];
            SpeechOutputProvider.speak("더블 더치");
            //isBookmarkedBus(bus) ? removeBookmarkedBus(bus) : addBookmark(bus);
        }
    });



    // Effects
    useEffect(() => {
        (async () => {
            await loadBookmark();
            SpeechOutputProvider.speak("버스를 선택하세요");
        })();
    }, [loadBookmark]);



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
                            <div {...busInfoClickGestureBind(bus)} className={`${style.busInfo} ${isBookmarkedBus(bus) && style.busInfo_bookmark}`} style={{ height: `${busInfoContainerHeight}px` }}>
                                <h1>{bus.busRouteAbbreviation}</h1>
                                <h3>{bus.stationName}</h3>
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