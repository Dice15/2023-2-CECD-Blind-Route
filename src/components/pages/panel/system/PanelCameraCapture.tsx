import { useCallback, useEffect, useRef, useState } from "react";
import style from "./PanelCameraCapture.module.css"
import useElementDimensions from "../../../../hooks/useElementDimensions";
import { UserRole } from "../../../../cores/types/UserRole";
import { detectedTest, extractBusNumberFromImage } from "../../../../cores/api/blindroutePanel";
import Bus from "../../../../cores/types/Bus";
import Station from "../../../../cores/types/Station";
import { getBusList } from "../../../../cores/api/blindrouteApi";



/** PanelCameraCapture 컴포넌트 프로퍼티 */
export interface PanelCameraCaptureProps {
    userRole: UserRole;
    wishStation: Station;
}



/** PanelCameraCapture 컴포넌트 */
export default function PanelCameraCapture({ userRole, wishStation }: PanelCameraCaptureProps) {
    // Const 
    const { arsId, stationName } = wishStation;

    // Refs 
    const displayCameraRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureTaskRef = useRef<NodeJS.Timeout | null>(null);

    // States
    const [busList, setBusList] = useState<Bus[]>([]);
    const [detectedBus, setDetectedBus] = useState<Bus | null>(null);
    const [busImage, setBusImage] = useState<Blob | null>(null);

    // Custom hooks
    const [videoWidth, videoHeight] = useElementDimensions<HTMLDivElement>(displayCameraRef, "Pure");

    // 이미지 캡쳐 함수
    const imageCapture = useCallback((canvas: HTMLCanvasElement): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const video = videoRef.current;
            if (video && canvas) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const canvasContext = canvas.getContext('2d');
                if (canvasContext) {
                    canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }, []);

    // 버스 리스트 가져오기
    useEffect(() => {
        const getWishStationBusList = async () => {
            const responsedBusList: Bus[] = await getBusList(userRole, arsId, stationName);
            setBusList(responsedBusList);
        };
        getWishStationBusList();
    }, [userRole, arsId, stationName]);

    // 카메라 스트림 설정
    useEffect(() => {
        const getCameraStream = async (facingMode = "environment") => {
            try {
                const constraints = { video: { facingMode } };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                }
            } catch (err) {
                console.error("카메라 접근에 실패했습니다.", err);
                if (facingMode === "environment") {
                    getCameraStream("user");
                }
            }
        };
        getCameraStream();
    }, []);

    // 영상 캡쳐
    useEffect(() => {
        const canvasElement = canvasRef.current;
        const captureInterval = 4000; // 4초 간격

        const startCapture = async () => {
            if (canvasElement && !captureTaskRef.current) {
                captureTaskRef.current = setInterval(async () => {
                    const capturedImage = await imageCapture(canvasElement);
                    setBusImage(capturedImage);
                }, captureInterval);
            }
        };

        startCapture();

        return () => {
            if (captureTaskRef.current) {
                clearInterval(captureTaskRef.current);
            }
        }
    }, [imageCapture]);

    // 캡쳐된 영상 인식
    useEffect(() => {
        const sendImage = async () => {
            if (busImage) {
                const result = await extractBusNumberFromImage(userRole, { arsId: arsId, image: busImage });
                if (result !== -1) {
                    const bus = busList.find((bus) => bus.busRouteNumber === result.toString());
                    if (bus) {
                        setDetectedBus(bus);
                        detectedTest(userRole, { arsId: arsId, busRouteId: bus.busRouteId, busRouteNm: bus.busRouteNumber, busRouteAbrv: bus.busRouteAbbreviation });
                    } else {
                        setDetectedBus(new Bus("", "", "", result.toString(), result.toString(), []));
                    }
                } else {
                    setDetectedBus(null);
                }
            }
        }
        sendImage();
    }, [userRole, arsId, busImage, busList]);


    // Render
    return (
        <div className={style.PanelCameraCapture} >
            <div className={style.detected_bus}>
                <div className={style.arriveed_bus} >{detectedBus ? `도착한 버스: ${detectedBus.busRouteAbbreviation}` : "도착한 버스가 없습니다"}</div>
            </div>
            <div className={style.captured_image} ref={displayCameraRef}>
                <video autoPlay width={videoWidth} height={videoHeight} ref={videoRef}></video>
                <canvas style={{ display: "none" }} ref={canvasRef}></canvas>
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

/** Test Code : 버스 도착 테스트 */
/*useEffect(() => {
    let index = 0;
    const intervalId = setInterval(async () => {
        if (busList.length > 0) {
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
        }
    }, 2000);
    return () => clearInterval(intervalId);
}, [userRole, busList, setDetectedBus]);*/




/*useEffect(() => {
        if (busList.length > 0) {
            setTimeout(() => {
                const bus = busList.find((bus) => bus.busRouteNumber === "2222");
                if (bus) {
                    setDetectedBus(bus);
                    const interval = setInterval(async () => {
                        try {
                            await detectedTest(userRole, {
                                arsId: bus.stationArsId,
                                busRouteId: bus.busRouteId,
                                busRouteNm: bus.busRouteNumber,
                                busRouteAbrv: bus.busRouteAbbreviation
                            });
                        } catch (error) {
                            console.error("Error in detectedTest:", error);
                        }
                    }, 1000);
                    setTimeout(() => {
                        clearInterval(interval);
                        setDetectedBus(null);
                    }, 15000);
                }
            }, 5000);

            setTimeout(() => {
                const bus = busList.find((bus) => bus.busRouteNumber === "721");
                if (bus) {
                    setDetectedBus(bus);
                    const interval = setInterval(async () => {
                        try {
                            await detectedTest(userRole, {
                                arsId: bus.stationArsId,
                                busRouteId: bus.busRouteId,
                                busRouteNm: bus.busRouteNumber,
                                busRouteAbrv: bus.busRouteAbbreviation
                            });
                        } catch (error) {
                            console.error("Error in detectedTest:", error);
                        }
                    }, 1000);
                    setTimeout(() => {
                        clearInterval(interval);
                        setDetectedBus(null);
                    }, 20000);
                }
            }, 28000);
        }
    }, [busList, userRole]);*/