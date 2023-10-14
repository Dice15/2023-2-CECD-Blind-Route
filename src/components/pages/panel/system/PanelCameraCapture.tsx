import { useCallback, useEffect, useRef, useState } from "react";
import style from "./PanelCameraCapture.module.css"
import useElementDimensions from "../../../../hooks/useElementDimensions";
import { UserRole } from "../../../../cores/types/UserRole";
import { detectedTest } from "../../../../cores/api/blindroutePanel";
import Bus from "../../../../cores/types/Bus";



/** PanelCameraCapture 컴포넌트 프로퍼티 */
export interface PanelCameraCaptureProps {
    userRole: UserRole;
    captureInterval: number;
}



/** PanelCameraCapture 컴포넌트 */
export default function PanelCameraCapture({ userRole, captureInterval }: PanelCameraCaptureProps) {
    /** ref */
    const displayCameraRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureTaskRef = useRef<NodeJS.Timeout | null>(null);


    // state
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [detectedBus, setDetectedBus] = useState<Bus | null>(null);


    /** custom hook */
    const [videoWidth, videoHeight] = useElementDimensions<HTMLDivElement>(displayCameraRef, "Pure");



    /** 카메라 활성화 함수 */
    const startCamera = useCallback(async (video: HTMLVideoElement) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: videoWidth },
                    height: { ideal: videoHeight },
                    facingMode: "environment"  // 후면 카메라를 우선적으로 사용
                }
            });
            video.srcObject = stream;
        } catch (error) {
            alert("카메라를 사용할 수 없습니다");
            console.error("Failed to start the camera:", error);
        }
    }, [videoWidth, videoHeight]);



    /** 카메라 종료 함수 */
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

        const startCapture = async (video: HTMLVideoElement, canvas: HTMLCanvasElement, task: React.MutableRefObject<NodeJS.Timeout | null>) => {
            if (task && !task.current) {
                await startCamera(video);
                task.current = setInterval(async () => { setCapturedImage(await imageCapture(video, canvas)); }, taskInterval);
            }
        };

        const stopCapture = async (video: HTMLVideoElement, task: React.MutableRefObject<NodeJS.Timeout | null>) => {
            if (task.current) {
                clearInterval(task.current);
                task.current = null;
                await stopCamera(video);
                setCapturedImage(null);
            }
        };

        if (videoElement && canvasElement) {
            if (!captureTaskRef.current) {
                startCapture(videoElement, canvasElement, taskRef);
            }
        };

        return () => {
            if (videoElement && taskRef.current) {
                stopCapture(videoElement, taskRef);
                clearInterval(taskRef.current);
            }
        }
    }, [captureInterval, canvasRef, videoRef, captureTaskRef, startCamera, imageCapture, stopCamera]);



    /** 버스 도착 테스트 (쌍문역 기준) */
    const test = useCallback(async (bus: Bus) => {
        const res = await detectedTest(userRole, {
            arsId: bus.stationArsId,
            busRouteId: bus.busRouteId,
            busRouteNm: bus.busRouteNumber,
            busRouteAbrv: bus.busRouteAbbreviation
        });
    }, [userRole]);

    useEffect(() => {
        const buses = [
            new Bus("10015", "122000002", "6102", "6102"),
            new Bus("10015", "100100006", "101", "101"),
            new Bus("10015", "100100011", "106", "106"),
            new Bus("10015", "100100012", "107", "107")
        ];
        let index = 0;

        const intervalId = setInterval(async () => {
            const bus = buses[index];
            setDetectedBus(bus);
            await test(bus);

            // Move to the next bus, or reset to the first bus if we've reached the end of the array
            index = (index + 1) % buses.length;

        }, 2000);  // 2 seconds interval

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);

    }, [userRole, test, setDetectedBus]);  // Don't forget to include `test` in the dependency array if it's defined outside this useEffect



    return (
        <div className={style.PanelCameraCapture} >
            <div className={style.detected_bus}>
                <h3>{detectedBus && `도착한 버스: ${detectedBus.busRouteAbbreviation}`}</h3>
            </div>
            <div className={style.captured_image} ref={displayCameraRef}>
                <video autoPlay width={videoWidth} height={videoHeight} ref={videoRef}></video>
                <canvas style={{ display: "none" }} ref={canvasRef} ></canvas>
            </div>
        </div>
    );
}
