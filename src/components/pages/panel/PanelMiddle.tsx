import { useCallback, useEffect, useRef, useState } from "react";
import style from "./PanelMiddle.module.css";
import { UserRole } from "../../../cores/types/UserRole";
import { getBusNumberFromImage } from "../../../cores/api/blindroutePanel";
import CameraCapture from "./camera/CameraCapture";
import DetectingBus from "./system/DetectedBus";
import StationWishTable from "./system/StationWishTable";


export interface PanelMiddleProps {
    userRole: UserRole;
}

export default function PanelMiddle({ userRole }: PanelMiddleProps) {
    /** test */
    const controlButton = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    /** state */
    const [panelSystem, setPanelSystem] = useState<"processing" | "paused">("paused");
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [receivedImage, setReceivedImage] = useState<Blob | null>(null);


    /** 캡쳐된 이미지에서 버스 번호를 인식하는 Api호출 */
    const detectingBusNumber = useCallback(async (image: Blob) => {
        return await getBusNumberFromImage(userRole, { image: image });
    }, [userRole]);


    /** 시스템 상태에 따른 버튼 변경 */
    useEffect(() => {
        const ctrlButton = controlButton.current;
        if (ctrlButton) {
            if (panelSystem === "processing") {
                ctrlButton.textContent = "시스템 종료";
                ctrlButton.className = [style.sysyem_control__button, style.stop_button].join(" ");
            } else {
                ctrlButton.textContent = "시스템 시작";
                ctrlButton.className = [style.sysyem_control__button, style.start_button].join(" ");
            }
        }
    }, [controlButton, panelSystem]);


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

    /*
        const captureAndSend = async () => {
            if (canvasRef.current && videoRef.current && videoRef.current.srcObject) {
                const canvas = canvasRef.current;
                const video = videoRef.current;
     
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const canvasContext2D = canvas.getContext('2d');
                if (canvasContext2D) {
                    canvasContext2D.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                }
     
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        const result = await getBusNumberFromImage(userRole, { image: blob });  // Wrapping blob in an object
     
                        if (result && result.data) {  // Check if result is not null and has data
                            const imageUrl = URL.createObjectURL(result.data);
                            if (imageRef.current) {
                                imageRef.current.src = imageUrl;
                            }
                        } else {
                            alert("이미지 업로드 실패");
                        }
                    }
                }, 'image/jpeg');
            }
        };
     
        const startCaptureAndSend = () => {
            if (captureInterval) return;  // 이미 실행중이면 무시
            captureAndSend();  // 처음 호출
            captureInterval = setInterval(captureAndSend, 100);  // 100ms마다 반복
        };
     
        const stopCaptureAndSend = () => {
            if (captureInterval) {
                clearInterval(captureInterval);  // Interval 중지
                captureInterval = null;
            }
        };*/

    const onClickControlButton = async () => {
        setPanelSystem(panelSystem === "processing" ? "paused" : "processing");
    };



    return (
        <div className={style.PanelMiddle}>
            <div className={style.panel_middle__header}>
                <button className={style.sysyem_control__button} type="button" onClick={onClickControlButton} ref={controlButton}></button>
            </div>

            <div className={style.panel_middle__body}>
                <CameraCapture
                    setCaptureImage={setCapturedImage}
                    captureInterval={50}
                    cameraState={panelSystem === "processing" ? "capturing" : "stopped"}
                    visibility={"hidden"}
                />
                <div className={style.display_wishtable}>
                    <StationWishTable

                    />
                </div>
                <div className={style.display_detectedbus}>
                    <DetectingBus
                        capturedImage={receivedImage}
                    />
                </div>
            </div>
        </div>
    );
};