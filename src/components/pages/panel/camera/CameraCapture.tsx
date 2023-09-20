import { useCallback, useEffect, useRef } from "react";
import style from "./CameraCapture.module.css"
import useElementDimensions from "../../../../hooks/useElementDimensions";



/** 카메라 컴포넌트 프로퍼티 */
export interface CameraCaptureProps {
    setCaptureImage: React.Dispatch<React.SetStateAction<Blob | null>>;
    captureInterval: number;
    cameraState: "capturing" | "stopped";
    visibility: "visible" | "hidden";
}



/** 카메라 컴포넌트 */
export default function CameraCapture({ setCaptureImage, captureInterval, cameraState, visibility }: CameraCaptureProps) {
    /** ref */
    const displayCameraRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureTaskRef = useRef<NodeJS.Timeout | null>(null);

    /** custom hook */
    const [videoWidth, videoHeight] = useElementDimensions<HTMLDivElement>(displayCameraRef, "Pure");


    /** 카메라 활성화 함수 */
    const startCamera = useCallback(async (video: HTMLVideoElement) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: videoWidth },
                    height: { ideal: videoHeight }
                }
            });
            video.srcObject = stream;
        } catch (error) {
            alert("카메라를 사용할 수 없습니다");
            console.error("Failed to start the camera:", error);
        }
    }, [videoWidth, videoHeight]);


    /** 카메라 종류 함수 */
    const stopCamera = useCallback(async (video: HTMLVideoElement) => {
        try {
            const srcObject = video.srcObject as MediaStream;
            const tracks = srcObject.getTracks();
            tracks.forEach((track: MediaStreamTrack) => track.stop());
        } catch (error) {
            alert("카메라 종료할 수 없습니다");
            console.error("Failed to end the camera:", error);
        }
    }, []);


    /** 이미지 캡쳐 */
    const imageCapture = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (video.srcObject) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const canvasContext2D = canvas.getContext('2d');
                if (canvasContext2D) {
                    canvasContext2D.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    canvas.toBlob((blob) => { resolve(blob); }, 'image/jpeg');
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }, []);


    /** state에 따른 카메라 활성 여부 */
    useEffect(() => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const taskRef = captureTaskRef;
        const taskInterval = captureInterval;
        const state = cameraState;

        const startCapture = async (video: HTMLVideoElement, canvas: HTMLCanvasElement, task: React.MutableRefObject<NodeJS.Timeout | null>) => {
            if (task && !task.current) {
                await startCamera(video);
                task.current = setInterval(async () => { setCaptureImage(await imageCapture(video, canvas)); }, taskInterval);
            }
        };

        const stopCapture = async (video: HTMLVideoElement, task: React.MutableRefObject<NodeJS.Timeout | null>) => {
            if (task.current) {
                clearInterval(task.current);
                task.current = null;
                await stopCamera(video);
            }
        };

        if (videoElement && canvasElement) {
            if (state === "capturing") {
                if (!captureTaskRef.current) {
                    startCapture(videoElement, canvasElement, taskRef);
                }
            } else if (state === "stopped") {
                if (captureTaskRef.current) {
                    stopCapture(videoElement, taskRef);
                }
            }
        };

        return () => {
            if (taskRef.current) {
                clearInterval(taskRef.current);
            }
        }
    }, [captureInterval, cameraState, canvasRef, videoRef, captureTaskRef, setCaptureImage, startCamera, imageCapture, stopCamera]);


    return (
        <div className={style.CameraCapture} style={{ display: `${visibility === "hidden" ? "none" : "block"}` }}>
            <div className={style.display_camera} ref={displayCameraRef}>
                <video autoPlay ref={videoRef}></video>
                <canvas style={{ display: "none" }} ref={canvasRef} ></canvas>
            </div>
        </div>
    );
}
