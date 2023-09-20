import { useRef } from "react";
import style from "./DetectingBus.module.css";



/** 버스 탐지기 컴포넌트 프로퍼티 */
export interface DetectingBusProps {
    capturedImage: Blob | null;
}



/** 버스 탐지기 컴포넌트 */
export default function DetectingBus({ capturedImage }: DetectingBusProps) {
    /** ref */
    const imageRef = useRef<HTMLImageElement>(null);

    if (imageRef.current && capturedImage) {
        imageRef.current.src = URL.createObjectURL(capturedImage);
    }

    return (
        <div className={style.DetectingBus}>
            <img className={style.recieved_image} ref={imageRef} alt="Captured content" />
        </div>
    );
}