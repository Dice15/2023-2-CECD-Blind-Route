import { useCallback, useEffect, useRef, useState } from "react";
import style from "./PanelCameraCapture.module.css"
import useElementDimensions from "../../../../hooks/useElementDimensions";
import { UserRole } from "../../../../cores/types/UserRole";
import { detectedTest, extractBusNumberFromImage } from "../../../../cores/api/blindroutePanel";
import Bus from "../../../../cores/types/Bus";
import Station from "../../../../cores/types/Station";
import { getBusList } from "../../../../cores/api/blindrouteApi";
import { SpeechInputProvider, SpeechOutputProvider } from "../../../../modules/speech/SpeechProviders";



/** PanelCameraCapture 컴포넌트 프로퍼티 */
export interface PanelCameraCaptureProps {
    userRole: UserRole;
    wishStation: Station;
}



/** PanelCameraCapture 컴포넌트 */
export default function PanelCameraCapture({ userRole, wishStation }: PanelCameraCaptureProps) {
    // Const 
    const { arsId, stationName } = wishStation;  // 비구조화를 통해 arsId 추출


    // Refs 
    const displayCameraRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureTaskRef = useRef<NodeJS.Timeout | null>(null);
    const frameIdRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef<number | null>(null);  // 이전 프레임 시간을 저장하기 위한 ref


    // States
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [busList, setBusList] = useState<Bus[]>([]);
    const [detectedBus, setDetectedBus] = useState<Bus | null>(null);
    const [framesPerSecond, setFramesPerSecond] = useState<number>(0);  // 초당 프레임 상태 추가


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



    /** 프레임 카운트 업데이트 */
    const updateFrameCount = useCallback(() => {
        const currentTime = performance.now();
        if (lastFrameTimeRef.current !== null) {
            const deltaTime = currentTime - lastFrameTimeRef.current;  // 시간 차이 계산
            setFramesPerSecond(1000 / deltaTime);  // 초당 프레임 계산
        }
        lastFrameTimeRef.current = currentTime;  // 현재 시간을 이전 프레임 시간으로 저장
        frameIdRef.current = requestAnimationFrame(updateFrameCount);  // 프레임 ID 저장
    }, []);



    /** 
     * Effects
     */
    /** 버스 정류장의 버스 리스트를 가져옴 */
    useEffect(() => {
        const getWishStationBusList = async () => {
            const responsedBusList: Bus[] = await getBusList(userRole, arsId, stationName);
            setBusList(responsedBusList);
        };

        getWishStationBusList();

    }, [userRole, arsId, stationName]);



    /** 카메라로 taskInterval밀리초 마다 이미지 캡쳐 */
    useEffect(() => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const taskRef = captureTaskRef;
        const taskInterval = 2000;

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



    /** 촬영중인 영상 프레임 업데이트 */
    useEffect(() => {
        // 카메라가 활성화되고 난 후에 프레임 카운트를 시작
        updateFrameCount();
        // 컴포넌트가 언마운트될 때 프레임 카운트 업데이트를 중지
        return () => {
            if (frameIdRef.current !== null) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, [updateFrameCount]);


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




/**/

/** 캡쳐된 이미지를 서버에 보냄 */
/*useEffect(() => {
    const sendImage = async () => {
        if (capturedImage) {
            const result = await extractBusNumberFromImage(userRole, { arsId: arsId, image: capturedImage });
            setDetectedBus(result.busRouteNm);
            if (result.busRouteNm !== -1) {
                await SpeechOutputProvider.speak(`${result.busRouteNm}가 도착했습니다.`);
            }
        }
    }
    sendImage();
}, [userRole, arsId, capturedImage]);*/