import { useCallback, useEffect, useRef, useState } from "react";
import style from "./PanelCameraCapture.module.css"
import useElementDimensions from "../../../../hooks/useElementDimensions";
import { UserRole } from "../../../../cores/types/UserRole";
import { detectedTest, sendCapturedImage } from "../../../../cores/api/blindroutePanel";
import Bus from "../../../../cores/types/Bus";
import Station from "../../../../cores/types/Station";
import { getBusDestinationList, getBusList } from "../../../../cores/api/blindrouteClient";



/** PanelCameraCapture 컴포넌트 프로퍼티 */
export interface PanelCameraCaptureProps {
    userRole: UserRole;
    wishStation: Station;
}



/** PanelCameraCapture 컴포넌트 */
export default function PanelCameraCapture({ userRole, wishStation }: PanelCameraCaptureProps) {
    // Refs 
    const displayCameraRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureTaskRef = useRef<NodeJS.Timeout | null>(null);


    // States
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [busList, setBusList] = useState<Bus[]>([]);
    const [detectedBus, setDetectedBus] = useState<Bus | null>(null);


    // Custom hooks
    const [videoWidth, videoHeight] = useElementDimensions<HTMLDivElement>(displayCameraRef, "Pure");



    /**
     * Handler functions
     */
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



    /** 
     * Effects
     */
    /** 버스 정류장의 버스 리스트를 가져옴 */
    useEffect(() => {
        const getWishStationBusList = async () => {
            const busApiData = await getBusList(userRole, { arsId: wishStation.arsId });
            const busInstances: Bus[] = await Promise.all(busApiData.busList.filter((bus) => bus.busRouteId !== undefined).map(async (bus) => {
                const destinationApiData = await getBusDestinationList(userRole, { busRouteId: bus.busRouteId! });
                const destinationInstances = destinationApiData.destinations.map((destination) => {
                    return {
                        stationName: destination.stationNm,
                        direction: destination.direction
                    };
                })

                return new Bus(
                    wishStation.arsId,
                    bus.busRouteId,
                    bus.busRouteNm,
                    bus.busRouteAbrv,
                    destinationInstances,
                );
            }));

            setBusList(busInstances);
        };

        getWishStationBusList();

    }, [userRole, wishStation, wishStation.arsId]);



    /** 카메라로 taskInterval밀리초 마다 이미지 캡쳐 */
    useEffect(() => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const taskRef = captureTaskRef;
        const taskInterval = 1000;

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
    }, [canvasRef, videoRef, captureTaskRef, startCamera, imageCapture, stopCamera]);



    /** 캡쳐된 이미지를 서버에 보냄 */
    useEffect(() => {
        const sendImage = async () => {
            if (capturedImage) {
                const busApiData = await sendCapturedImage(userRole, { arsId: wishStation.arsId, image: capturedImage });
                console.log(busApiData);
            }
        }
        sendImage();
    }, [userRole, capturedImage]);



    /** Test Code : 버스 도착 테스트 */
    useEffect(() => {
        let index = 0;

        const intervalId = setInterval(async () => {
            const bus = busList[index];
            setDetectedBus(bus);

            try {
                const res = await detectedTest(userRole, {
                    arsId: bus.stationArsId,
                    busRouteId: bus.busRouteId,
                    busRouteNm: bus.busRouteNumber,
                    busRouteAbrv: bus.busRouteAbbreviation
                });
            } catch (error) {
                console.error("Error in detectedTest:", error);
            }

            index = (index + 1) % busList.length;

        }, 2000);

        return () => clearInterval(intervalId);

    }, [userRole, busList, setDetectedBus]);



    // Render
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
