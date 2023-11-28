import style from "./ClientSelectingBookmarkedBus.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import Bus from "../../../../cores/types/Bus";
import { getBookmarkList, removeBookmark, reserveBus } from "../../../../cores/api/blindrouteApi";
import { ClientBookmarkState } from "./ClientBookmark";


// module
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useElementDimensions from "../../../../hooks/useElementDimensions";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { SpeechOutputProvider } from "../../../../modules/speech/SpeechProviders";
import { useNavigate } from "react-router-dom";
import useTouchEvents from "../../../../hooks/useTouchEvents";
import { VibrationProvider } from "../../../../modules/vibration/VibrationProvider";



/** ClientSelectingStation 컴포넌트 프로퍼티 */
export interface ClientSelectingBookmarkedBusProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<ClientBookmarkState>>;
    setWishBus: React.Dispatch<React.SetStateAction<Bus | null>>
}



/** ClientSelectingStation 컴포넌트 */
export default function ClientSelectingBookmarkedBus({ userRole, setPageState, setWishBus }: ClientSelectingBookmarkedBusProps) {
    // Const
    const history = useNavigate();


    // Refs
    const busInfoContainer = useRef<HTMLDivElement>(null);
    const busListIndexRef = useRef<number>(0);

    // States
    const [bookmarkList, setBookmarkList] = useState<Bus[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    // Custom modules
    const [busInfoContainerWidth, busInfoContainerHeight] = useElementDimensions<HTMLDivElement>(busInfoContainer, "Pure");



    /**
     * Handler functions
     */
    /** 이전 단계로 이동: 선택한 버스를 제거하고 이전 단계로 이동 */
    const handlePrevStepClick = useTouchEvents({
        onSingleTouch: () => {
            // 진동 1초
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("더블 터치하면 홈으로 돌아갑니다.");
        },
        onDoubleTouch: () => {
            // 더블 터치 진동
            VibrationProvider.repeatVibrate(500, 200, 2);
            history(`/client`);
        }
    });



    /** 다음 단계로 이동: 선택한 버스를 예약 등록을 함 */
    const handleNextStepClick = useTouchEvents({
        onSingleTouch: () => {
            // 진동 1초
            VibrationProvider.vibrate(1000);
            SpeechOutputProvider.speak("더블 터치하면 버스를 예약합니다.");
        },
        onDoubleTouch: async () => {
            // 더블 터치 진동
            VibrationProvider.repeatVibrate(500, 200, 2);

            // 로딩 모션 on
            setIsLoading(true);

            // 버스 예약
            setTimeout(async () => {
                const reserveResult = await reserveBus(userRole, bookmarkList[busListIndexRef.current]);

                if (reserveResult) {
                    SpeechOutputProvider.speak(`버스를 예약하였습니다`);
                    setWishBus(bookmarkList[busListIndexRef.current]);
                    setIsLoading(false);    // 로딩 모션 off
                    setPageState("waitingBookmarkedBus");
                } else {
                    SpeechOutputProvider.speak(`버스를 예약하는데 실패했습니다`);
                    setIsLoading(false);    // 로딩 모션 off
                }
            }, 500);
        }
    });


    /* useEffect(() => {
         setIsLoading(true);
 
         setBusList([
             new Bus(
                 "10266",
                 "창동역동측(노원방면)",
                 "100100138",
                 "1120",
                 "1120",
                 [
                     {
                         "stationName": "한성여객종점",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "홈플러스중계점",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "대진여자고등학교",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "중계건영2차아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "어린이교통공원",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "마들근린공원.노원에코센터",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창동주공17단지",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창동주공18단지",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창동주공19단지",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창동동아아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창동농협물류센터",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "노원구청",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "노원역8번출구",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "노원구청앞",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창4동주민센터",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "서울북부지방법원등기국",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창동주공1단지",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "창5동현대1차아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "도봉구보건소앞",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "쌍문동금호1차삼익아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "쌍문동현대.한양아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "쌍문동성원아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "청구아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "방학동우성.청구아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "초당초등학교",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "쌍문동우이빌라",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "쌍문동청한빌라",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "서라벌중학교.우이동대우아파트",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "덕성여대솔밭근린공원",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "4.19민주묘지역",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "인수동장미원",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "가오리역",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "우이초등학교",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "강북노인종합복지관",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "신일병원",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "수유시장.성신여대미아캠퍼스앞",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "미아역8번출구.신일중고",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "미아역.신일중고",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "도봉세무서.성북시장",
                         "direction": "삼양동입구"
                     },
                     {
                         "stationName": "도봉세무서.성북시장",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "미아역.신일중고",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "수유시장.성신여대미아캠퍼스앞",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "신일병원",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "강북노인종합복지관",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "우이초등학교",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "가오리역",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "인수동장미원",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "4.19민주묘지역",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "덕성여대입구",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "서라벌중학교.우이동대우아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "북서울교회",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "쌍문동청한빌라",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "쌍문동우이빌라",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "초당초등학교",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "방학동우성아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "청구아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "쌍문동성원아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "쌍문동한양.현대아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "쌍문동삼익금호1차아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "도봉구보건소앞",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창5동현대아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동주공1단지아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "서울북부지방법원등기국",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동농협물류센터",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동역동측(노원방면)",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동농협물류센터",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "상계6동우체국",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "상계주공3단지",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "상계주공2단지",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "당현초등학교",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "상계주공2단지223동",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "상계주공2단지상가",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "상계주공2단지",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "상계주공6단지",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "노원구청앞",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동농협물류센터",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동역동측",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동동아아파트",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동주공19단지",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동주공18단지",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "창동주공17단지",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "마들근린공원.노원에코센터",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "중계역2번출구",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "청계초등학교",
                         "direction": "하계동"
                     },
                     {
                         "stationName": "홈플러스중계점",
                         "direction": "하계동"
                     }
                 ]
             )
         ]);
         setIsLoading(false);
 
         SpeechOutputProvider.speak("버스를 선택하세요");
 
     }, [setBusList]);*/



    /** 즐겨찾기 불러오기 */
    const loadBookmark = useCallback(async () => {
        setIsLoading(true);
        const busList = await getBookmarkList(userRole);
        if (busList.length > 0) {
            setBookmarkList(busList);
            SpeechOutputProvider.speak(`버스를 선택하세요, ${busList[0].busRouteAbbreviation}`);
        }
        setIsLoading(false);
        return busList.length > 0;
    }, [userRole, setIsLoading, setBookmarkList]);



    /** 즐겨찾기에서 제거 */
    const removeBookmarkedBus = useCallback(async (bus: Bus) => {
        setIsLoading(true);
        if (await removeBookmark(userRole, bus)) {
            setBookmarkList(bookmarkList.filter(bookmark =>
                bookmark.stationArsId !== bus.stationArsId || bookmark.busRouteId !== bus.busRouteId
            ));

            SpeechOutputProvider.speak(`${bus.busRouteAbbreviation}를 즐겨찾기에서 해제하였습니다`);

            if (!(await loadBookmark())) {
                setTimeout(() => {
                    SpeechOutputProvider.speak(`이제 즐겨찾기에 등록된 버스가 없습니다. 홈으로 돌아갑니다.`);
                    setTimeout(() => {
                        history(`/client`);
                    }, 3000);
                }, 3000);
            }
        }
        setIsLoading(false);
    }, [userRole, history, bookmarkList, setBookmarkList, loadBookmark]);



    /** 버스 정보 클릭 이벤트 */
    const handleBusInfoClick = useTouchEvents({
        onSingleTouch: () => {
            const bus = bookmarkList[busListIndexRef.current];
            SpeechOutputProvider.speak(`${bus.busRouteAbbreviation}, ${bus.stationName}`);
        },
        onDoubleTouch: () => {
            const bus = bookmarkList[busListIndexRef.current];
            removeBookmarkedBus(bus);
        }
    });


    // Effects
    useEffect(() => {
        (async () => {
            if (await loadBookmark()) {
                SpeechOutputProvider.speak("버스를 선택하세요");
            } else {
                SpeechOutputProvider.speak("즐겨찾기에 등록된 버스가 없습니다");
                history(`/client`);
            }
        })();
    }, [history, loadBookmark]);


    // Render
    return (
        <div className={style.ClientSelectingBookmarkedBus}>
            <LoadingAnimation active={isLoading} />

            <button className={style.button_movePrev} type="button" onClick={handlePrevStepClick}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,15 L10,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M35,15 L25,30 L35,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>

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
                    {bookmarkList.map((bus, index) => (
                        <SwiperSlide key={index}>
                            <div className={`${style.busInfo} ${style.busInfo_bookmark}`}
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

            <button className={style.button_moveNext} type="button" onClick={handleNextStepClick}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 L15,30 L5,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M20,15 L30,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}