import { useCallback, useEffect, useRef, useState } from "react";
import style from "./DetectingBus.module.css";
import { UserRole } from "../../../../cores/types/UserRole";
import { sendCapturedImage } from "../../../../cores/api/blindroutePanel";
import CameraCapture from "./CameraCapture";



/** 버스 탐지기 컴포넌트 프로퍼티 */
export interface DetectingBusProps {
    taskState: "running" | "stopped";
    userRole: UserRole;
}



/** 버스 탐지기 컴포넌트 */
export default function DetectingBus({ taskState, userRole }: DetectingBusProps) {
    /** ref */
    const imageRef = useRef<HTMLImageElement>(null);

    /** state */
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [detectedImage, setDetectedImage] = useState<Blob | null>(null);


    /** 캡쳐된 이미지에서 버스 번호를 인식하는 Api호출 */
    const detectingBusNumber = useCallback(async (image: Blob) => {
        return await sendCapturedImage(userRole, { arsId: "123", image: image });
    }, [userRole]);


    /** 캡쳐된 이미지가 갱신될떄 마다 Api에 이미지를 전송하여 버스 번호를 인식함 */
    useEffect(() => {
        (async () => {
            if (capturedImage) {
                const busData = await detectingBusNumber(capturedImage);
                if (busData.data) {
                    setDetectedImage(busData.data);
                }
            }
        })();
    }, [capturedImage, detectingBusNumber])


    /** 인식된 이미지가 없다면 img요소를 가림 */
    useEffect(() => {
        if (imageRef.current && detectedImage) {
            if (detectedImage) {
                imageRef.current.style.display = "block";
                imageRef.current.src = URL.createObjectURL(detectedImage);
            } else {
                imageRef.current.style.display = "none";
                imageRef.current.src = "";
            }
        }
    }, [detectedImage]);



    return (
        <div className={style.DetectingBus}>

            {taskState === "running"
                ? <div className={style.detected_bus_table}>
                    <div className={style.detecting_bus__header}>
                        <p>{"도착한 버스"}</p>
                    </div>
                    <div className={style.detecting_bus__body}>
                        <img className={style.detected_bus_image} alt="Captured content" style={{ display: "none" }} ref={imageRef} />
                    </div>
                </div>

                : <></>
            }
            <CameraCapture
                taskState={taskState}
                setCaptureImage={setCapturedImage}
                captureInterval={100}
                visibility={"hidden"}
            />
        </div>
    );
}