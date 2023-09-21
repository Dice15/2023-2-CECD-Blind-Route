import { useCallback, useEffect, useRef, useState } from "react";
import style from "./PanelMiddle.module.css";
import { UserRole } from "../../../cores/types/UserRole";
import { getBusNumberFromImage } from "../../../cores/api/blindroutePanel";
import CameraCapture from "./camera/CameraCapture";
import DetectingBus from "./system/DetectedBus";
import ReservedBusTable from "./system/ReservedBusTable";



/** PanelMiddle 컴포넌트 프로퍼티 */
export interface PanelMiddleProps {
    userRole: UserRole;
}



/** PanelMiddle 컴포넌트 */
export default function PanelMiddle({ userRole }: PanelMiddleProps) {
    /** test */
    const controlButton = useRef<HTMLButtonElement>(null);

    /** state */
    const [panelSystemState, setPanelSystemState] = useState<"running" | "stopped">("stopped");
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [receivedImage, setReceivedImage] = useState<Blob | null>(null);


    /** 버튼 클릭에 따른 시스템 변경 이벤트 */
    const onClickControlButton = () => {
        setPanelSystemState(panelSystemState === "running" ? "stopped" : "running");
    };


    /** 캡쳐된 이미지에서 버스 번호를 인식하는 Api호출 */
    const detectingBusNumber = useCallback(async (image: Blob) => {
        return await getBusNumberFromImage(userRole, { image: image });
    }, [userRole]);


    /** 시스템 상태에 따른 버튼 변경 */
    useEffect(() => {
        const ctrlButton = controlButton.current;
        if (ctrlButton) {
            if (panelSystemState === "running") {
                ctrlButton.textContent = "시스템 종료";
                ctrlButton.className = [style.sysyem_control__button, style.stop_button].join(" ");
            } else {
                ctrlButton.textContent = "시스템 시작";
                ctrlButton.className = [style.sysyem_control__button, style.start_button].join(" ");
            }
        }
    }, [controlButton, panelSystemState]);


    /** 캡쳐된 이미지가 갱신될떄 마다 Api에 이미지를 전송하여 버스 번호를 인식함 */
    useEffect(() => {
        (async () => {
            if (capturedImage) {
                const busData = await detectingBusNumber(capturedImage);
                if (busData.data) {
                    setReceivedImage(busData.data);
                }
            }
        })();
    }, [capturedImage, detectingBusNumber])


    return (
        <div className={style.PanelMiddle}>
            <div className={style.panel_middle__header}>
                <button className={style.sysyem_control__button} type="button" onClick={onClickControlButton} ref={controlButton}></button>
            </div>

            <div className={style.panel_middle__body}>

                <div className={style.display_wishtable}>
                    <ReservedBusTable
                        taskState={panelSystemState}
                        userRole={userRole}
                    />
                </div>
                <div className={style.display_detectedbus}>
                    <DetectingBus
                        taskState={panelSystemState}
                        userRole={userRole}
                        detectedImage={receivedImage}
                    />
                </div>
            </div>
        </div>
    );
};

/*
                <CameraCapture
                    taskState={panelSystemState}
                    setCaptureImage={setCapturedImage}
                    captureInterval={100}
                    visibility={"hidden"}
                />
*/