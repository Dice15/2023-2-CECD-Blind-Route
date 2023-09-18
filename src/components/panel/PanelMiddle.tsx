import { useRef } from "react";
import { UserRole } from "../../cores/types/UserRole";
import style from "./PanelMiddle.module.css";
import { getBusNumberFromImage } from "../../cores/api/blindroutePanel";

export interface PanelMiddleProps {
    userRole: UserRole;
}

export default function PanelMiddle({ userRole }: PanelMiddleProps) {
    /** test */
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    /**  */
    let captureInterval: NodeJS.Timeout | null = null;



    const startCamera = async () => {
        if (videoRef.current) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Failed to start the camera:", error);
            }
        }
    };

    const stopCamera = async () => {
        if (videoRef.current) {
            try {
                const srcObject = videoRef.current.srcObject as MediaStream;
                const tracks = srcObject.getTracks();
                tracks.forEach((track: MediaStreamTrack) => track.stop());
            } catch (error) {
                console.error("Failed to end the camera:", error);
            }
        }
    }

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
    };

    const startCameraAndCapture = async () => {
        await startCamera(); // 카메라를 먼저 시작
        startCaptureAndSend(); // 그 후 촬영 시작
    }

    const stopCameraAndCapture = async () => {
        stopCaptureAndSend();  // 먼저 촬영을 중지
        await stopCamera();   // 그 후 카메라를 종료
    }

    return (
        <div className={style.PanelMiddle}>
            <div className={style.panel_middle__header}>
                <button className={style.camera_control__button} type="button" onClick={startCameraAndCapture}>촬영 & 전송 시작</button>
                <button className={style.camera_control__button} type="button" onClick={stopCameraAndCapture}>촬영 & 전송 종료</button>
            </div>

            <div className={style.panel_middle__body}>
                <div className={style.display_camera}>
                    <video className={style.camera} ref={videoRef} autoPlay></video>
                </div>
                <div className={style.display_recieved_image}>
                    <img className={style.recieved_image} ref={imageRef} alt="Captured content" />
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
        </div>
    );
};