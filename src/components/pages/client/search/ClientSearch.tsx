import { useEffect, useState } from "react";
import style from "./ClientSearch.module.css"
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserRole } from "../../../../cores/types/UserRole";
import Station from "../../../../cores/types/Station";
import Bus from "../../../../cores/types/Bus";
import ClientSearchingStation from "./ClientSearchingStation";
import ClientSelectingStation from "./ClientSelectingStation";
import ClientSelectingBus from "./ClientSelectingBus";
import ClientWaitingBus from "./ClientWaitingBus";
import ClientArrivedBus from "./ClientArrivedBus";



/** ClientSearch 컴포넌트 프로퍼티 */
export interface ClientSearchProps {
    userRole: UserRole;
}



/** 컨트롤러 상태 */
export type ClientSearchState = "searchingStation" | "selectingStation" | "selectingBus" | "waitingBus" | "arrivedBus";



/** ClientSearch 컴포넌트 */
export default function ClientSearch({ userRole }: ClientSearchProps) {
    // States
    const [prevPageState, setPrevPageState] = useState<ClientSearchState>("searchingStation");
    const [pageState, setPageState] = useState<ClientSearchState>("searchingStation");
    const [stationList, setStationList] = useState<Station[]>([]);
    const [busList, setBusList] = useState<Bus[]>([]);
    const [bookmarkList, setBookmarkList] = useState<Bus[]>([]);
    const [wishBus, setWishBus] = useState<Bus | null>(null);



    /** 페이지 상태에 따른 알맞는 컨트롤러 반환 */
    const getControllerForm = () => {
        switch (pageState) {
            case "searchingStation": {
                return <ClientSearchingStation
                    userRole={userRole}
                    setPageState={setPageState}
                    setStationList={setStationList}
                />;
            }
            case "selectingStation": {
                return <ClientSelectingStation
                    userRole={userRole}
                    setPageState={setPageState}
                    stationList={stationList}
                    setBusList={setBusList}
                />
            }
            case "selectingBus": {
                return <ClientSelectingBus
                    userRole={userRole}
                    setPageState={setPageState}
                    busList={busList}
                    bookmarkList={bookmarkList}
                    setBookmarkList={setBookmarkList}
                    setWishBus={setWishBus}
                />
            }
            case "waitingBus": {
                return <ClientWaitingBus
                    userRole={userRole}
                    setPageState={setPageState}
                    wishBus={wishBus!}
                    setWishBus={setWishBus}
                />
            }
            case "arrivedBus": {
                return <ClientArrivedBus
                    wishBus={wishBus!}
                    setWishBus={setWishBus}
                />
            }
            default: {
                return <></>;
            }
        }
    };



    /** 페이지 상태가 바뀌면 이전 페이지 저장 */
    useEffect(() => {
        setPrevPageState(pageState);
    }, [pageState]);



    /** 페이지 이동 애니메이션 */
    const getAnimationDirection = () => {
        const pageOrder = ["searchingStation", "selectingStation", "selectingBus", "waitingBus", "arrivedBus"];
        const currentIndex = pageOrder.indexOf(pageState);
        const prevIndex = pageOrder.indexOf(prevPageState);
        return currentIndex > prevIndex ? 'left' : 'right';
    };



    /** 페이지가 초기화 될때 페이지 상태는 searchingStation로 설정 */
    useEffect(() => {
        setPageState("searchingStation");
        setStationList([]);
        setBusList([]);
        setWishBus(null);
    }, []);



    // Render
    return (
        <div className={style.ClientSearch}>
            <TransitionGroup>
                <CSSTransition
                    key={pageState}
                    timeout={300}
                    classNames={{
                        enter: style[`${getAnimationDirection()}SlideEnter`],
                        enterActive: style[`${getAnimationDirection()}SlideEnterActive`],
                        exit: style[`${getAnimationDirection()}SlideExit`],
                        exitActive: style[`${getAnimationDirection()}SlideExitActive`]
                    }}
                >
                    <div className={style.controllerForm}>
                        {getControllerForm()}
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}