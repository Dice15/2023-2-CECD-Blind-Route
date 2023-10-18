import { useEffect, useState } from "react";
import style from "./ClientBookmark.module.css"
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserRole } from "../../../../cores/types/UserRole";
import Bus from "../../../../cores/types/Bus";
import ClientSelectingBookmarkedBus from "./ClientSelectingBookmarkedBus";
import ClientWaitingBookmarkedBus from "./ClientWaitingBookmarkedBus";
import ClientArrivedBookmarkedBus from "./ClientArrivedBookmarkedBus";



/** ClientBookmarkState 컴포넌트 프로퍼티 */
export interface ClientBookmarkProps {
    userRole: UserRole;
}



/** 컨트롤러 상태 */
export type ClientBookmarkState = "selectingBookmarkedBus" | "waitingBookmarkedBus" | "arrivedBookmarkedBus";



/** ClientBookmark 컴포넌트 */
export default function ClientBookmark({ userRole }: ClientBookmarkProps) {
    // States
    const [prevPageState, setPrevPageState] = useState<ClientBookmarkState>("selectingBookmarkedBus");
    const [pageState, setPageState] = useState<ClientBookmarkState>("selectingBookmarkedBus");
    const [wishBus, setWishBus] = useState<Bus | null>(null);



    /** 페이지 상태에 따른 알맞는 컨트롤러 반환 */
    const getControllerForm = () => {
        switch (pageState) {
            case "selectingBookmarkedBus": {
                return <ClientSelectingBookmarkedBus
                    userRole={userRole}
                    setPageState={setPageState}
                    setWishBus={setWishBus}
                />;
            }
            case "waitingBookmarkedBus": {
                return <ClientWaitingBookmarkedBus
                    userRole={userRole}
                    setPageState={setPageState}
                    wishBus={wishBus!}
                    setWishBus={setWishBus}
                />;
            }
            case "arrivedBookmarkedBus": {
                return <ClientArrivedBookmarkedBus
                    wishBus={wishBus!}
                    setWishBus={setWishBus}
                />;
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
        const pageOrder = ["selectingBookmarkedBus", "waitingBookmarkedBus", "arrivedBookmarkedBus"];
        const currentIndex = pageOrder.indexOf(pageState);
        const prevIndex = pageOrder.indexOf(prevPageState);
        return currentIndex > prevIndex ? 'left' : 'right';
    };



    /** 페이지가 초기화 될때 페이지 상태는 searchingStation로 설정 */
    useEffect(() => {
        setPageState("selectingBookmarkedBus");
        setWishBus(null);
    }, []);



    // Render
    return (
        <div className={style.ClientBookmark}>
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