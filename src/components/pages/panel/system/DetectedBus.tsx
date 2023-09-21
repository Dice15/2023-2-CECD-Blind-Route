import { useEffect, useRef } from "react";
import style from "./DetectedBus.module.css";
import { UserRole } from "../../../../cores/types/UserRole";



/** 버스 탐지기 컴포넌트 프로퍼티 */
export interface DetectingBusProps {
    taskState: "running" | "stopped";
    userRole: UserRole;
    detectedImage: Blob | null;
}



/** 버스 탐지기 컴포넌트 */
export default function DetectingBus({ taskState, userRole, detectedImage }: DetectingBusProps) {
    /** ref */
    const imageRef = useRef<HTMLImageElement>(null);

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
    }, [detectedImage])

    return (
        <div className={style.DetectingBus}>
            {taskState === "running"
                ? <img className={style.recieved_image} alt="Captured content" style={{ display: "none" }} ref={imageRef} />
                : <></>
            }
        </div>
    );
}