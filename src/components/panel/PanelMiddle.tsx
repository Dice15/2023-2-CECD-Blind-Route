import { useRef } from "react";
import { UserRole } from "../../cores/types/UserRole";
import style from "./PanelMiddle.module.css";
import { sendImageToAPI } from "../../cores/api/Blindroute";

export interface PanelMiddleProps {
    userRole: UserRole;
}

export default function PanelMiddle({ userRole }: PanelMiddleProps) {
    /** test */
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const captureAndSend = async () => {
        if (canvasRef.current && videoRef.current && videoRef.current.srcObject) {
            const canvas = canvasRef.current;
            const video = videoRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }

            const srcObject = video.srcObject as MediaStream;  // Type casting to MediaStream
            const tracks = srcObject.getTracks();
            tracks.forEach((track: MediaStreamTrack) => track.stop());  // Specifying type for track

            canvas.toBlob(async (blob) => {
                if (blob) {
                    const result = await sendImageToAPI(userRole, { image: blob });  // Wrapping blob in an object
                    alert(result);
                    console.log(result);
                }
            }, 'image/jpeg');
        }

    };

    return (
        <div className={style.PanelMiddle}>
            <button className={style.stationList__loading_button} type="button" onClick={startCamera}>카메라 시작</button>
            <button className={style.stationList__loading_button} type="button" onClick={captureAndSend}>사진 찍기 & 전송</button>
            <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    )
};