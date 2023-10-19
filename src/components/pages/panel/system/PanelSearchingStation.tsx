import style from "./PanelSearchingStation.module.css";
import { useEffect, useRef, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import Station from "../../../../cores/types/Station";
import { getStationList } from "../../../../cores/api/blindrouteApi";
import { PanelMiddleState } from "../PanelMiddle";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";



/** PanelSearchingStation 컴포넌트 프로퍼티 */
export interface ClientSearchingStationProps {
    userRole: UserRole;
    setPageState: React.Dispatch<React.SetStateAction<PanelMiddleState>>;
    setStationList: React.Dispatch<React.SetStateAction<Station[]>>;
}



/** PanelSearchingStation 컴포넌트 */
export default function PanelSearchingStation({ userRole, setPageState, setStationList }: ClientSearchingStationProps) {
    // ref
    const textbox_stationName = useRef<HTMLInputElement>(null);


    // States
    const [isLoading, setIsLoading] = useState(false);



    /** 다음 단계로 이동: 정류장 불러오고 페이지 상태 업데이트 */
    const onNextStep = async () => {
        if (textbox_stationName.current) {
            setIsLoading(true);
            const responsedStationList = await getStationList(userRole, textbox_stationName.current.value);
            setIsLoading(false);

            if (responsedStationList.length > 0) {
                //setStationList([new Station("111111", "111111", "창동역"), new Station("222222", "222222", "노원역")]);
                setStationList(responsedStationList);
                setPageState("selectingStation");
            } else {
                alert("검색된 정류장이 없습니다");
            }
        }
    };


    /** 이 컨트롤러가 처음 켜졌을 때는 정류장 리스트 초기화 */
    useEffect(() => {
        setStationList([]);
    }, [setStationList]);



    return (
        <div className={style.PanelSearchingStation}>
            <LoadingAnimation active={isLoading} />

            <button className={style.button_movePrev} type="button" onClick={() => { }}></button>

            <input className={style.textbox_stationName} type="text" placeholder="정류장 입력" ref={textbox_stationName} />

            <button className={style.button_moveNext} type="button" onClick={() => { onNextStep(); }}>
                <svg width="40" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5,15 L15,30 L5,45" fill="none" stroke="black" strokeWidth="2" />
                    <path d="M20,15 L30,30 L20,45" fill="none" stroke="black" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}