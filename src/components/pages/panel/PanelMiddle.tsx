import { useEffect, useState } from "react";
import style from "./PanelMiddle.module.css";
import { UserRole } from "../../../cores/types/UserRole";
import Station from "../../../cores/types/Station";
import PanelSearchingStation from "./system/PanelSearchingStation";
import PanelSelectingStation from "./system/PanelSelectingStation";
import PanelDetectingBus from "./system/PanelDetectingBus";
import { CSSTransition, TransitionGroup } from "react-transition-group";



/** PanelMiddle 컴포넌트 프로퍼티 */
export interface PanelMiddleProps {
    userRole: UserRole;
}



/** 컨트롤러 상태 */
export type PanelMiddleState = "searchingStation" | "selectingStation" | "dectectingBus";



/** PanelMiddle 컴포넌트 */
export default function PanelMiddle({ userRole }: PanelMiddleProps) {
    // state
    const [prevPageState, setPrevPageState] = useState<PanelMiddleState>("searchingStation");
    const [pageState, setPageState] = useState<PanelMiddleState>("searchingStation");
    const [stationList, setStationList] = useState<Station[]>([]);
    const [wishStation, setWishStation] = useState<Station | null>(null);



    /** 페이지 상태에 따른 알맞는 컨트롤러 반환 */
    const getControllerForm = () => {
        switch (pageState) {
            case "searchingStation": {
                return <PanelSearchingStation
                    userRole={userRole}
                    setPageState={setPageState}
                    setStationList={setStationList}
                />;
            }
            case "selectingStation": {
                return <PanelSelectingStation
                    userRole={userRole}
                    setPageState={setPageState}
                    stationList={stationList}
                    setWishStation={setWishStation}
                />
            }
            case "dectectingBus": {
                return <PanelDetectingBus
                    userRole={userRole}
                    setPageState={setPageState}
                    wishStation={wishStation!}
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



    /** 페이지가 초기화 될때 페이지 상태는 searchingStation로 설정 */
    useEffect(() => {
        setPageState("searchingStation");
        setStationList([]);
        setWishStation(null);
    }, []);



    /** 페이지 이동 애니메이션 */
    const getAnimationDirection = () => {
        const pageOrder = ["searchingStation", "selectingStation", "dectectingBus"];
        const currentIndex = pageOrder.indexOf(pageState);
        const prevIndex = pageOrder.indexOf(prevPageState);
        return currentIndex > prevIndex ? 'left' : 'right';
    };




    return (
        <div className={style.PanelMiddle}>
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
};