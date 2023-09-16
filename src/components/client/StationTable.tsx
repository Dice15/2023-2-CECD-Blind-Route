import style from "./StationTable.module.css"
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BusListContext, SetBusListContext, SetStationListContext, StationListContext } from "./Client";
import { getPureHeight } from "../../cores/utilities/htmlElementUtil";
import VirtualizedTable from "../virtualizedTable/VirtualizedTable";
import { IBusApi, IDestinationApi, IStationApi, getBusDestinationList, getBusList, getStationList, sendImageToAPI } from "../../cores/api/Blindroute";
import Station from "../../cores/types/Station";
import Bus from "../../cores/types/Bus";
import { useModal } from "../modal/Modal";
import { ModalAnimationType } from "../modal/ModalAnimations";
import BusTable from "./BusTable";
import IDestination from "../../cores/types/IDestination";
import { UserRole } from "../../cores/types/UserRole";


export interface StationTableProps {
    userRole: UserRole;
}



/** 정류장 리스트 테이블 */
export default function StationTable({ userRole }: StationTableProps) {
    /** ref */
    const stationTable = useRef<HTMLDivElement>(null);
    const stationName = useRef<HTMLInputElement>(null);

    /** context */
    const [stationList, setStationList] = [useContext(StationListContext), useContext(SetStationListContext)];
    const [busList, setBusList] = [useContext(BusListContext), useContext(SetBusListContext)];

    /** state */
    const [stationListHeight, setStationListHeight] = useState<number>(0);

    /** modal */
    const [BusTableModal, openBusTableModal, closeBusTableModal] = useModal(ModalAnimationType.ZOOM);

    /** 테이블 헤더 설정  */
    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "", style: { width: "50px", minWidth: "50px", maxWidth: "50px" } },
        { name: "", style: { width: "calc(100% - 50px)" } },
    ];


    /** 브라우저의 확대/축소에 따른 가상테이블 높이 재설정 */
    useEffect(() => {
        const currentStationTable = stationTable.current;
        let frameId: number | null = null;

        const observerCallback = () => {
            const newStationTableHeight: number = getPureHeight(stationTable) || 0;

            if (stationListHeight !== newStationTableHeight) {
                if (frameId) { cancelAnimationFrame(frameId); }
                frameId = requestAnimationFrame(() => { setStationListHeight(newStationTableHeight); });
            }
        };

        const observer = new ResizeObserver(observerCallback);

        if (currentStationTable) {
            observer.observe(currentStationTable);
        }

        return () => {
            if (currentStationTable) {
                observer.unobserve(currentStationTable);
            }
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [stationListHeight]);


    /** 정류장이 비어있다면, 테이블을 보이지 않게 함 */
    useEffect(() => {
        if (stationTable.current) {
            stationTable.current.style.visibility = stationList.length ? "visible" : "hidden";
        }
    }, [stationList]);


    /** 정류장 불러오기 */
    const loadStation = async () => {
        if (setStationList && stationName.current) {
            const apiData: IStationApi = await getStationList(userRole, { searchKeyword: stationName.current.value });
            const stationInstances: Station[] = apiData.busStations.map((station) => {
                return new Station(
                    station.arsId,
                    station.stId,
                    station.stNm
                );
            });

            setStationList(stationInstances);

            if (stationInstances.length === 0) {
                alert("검색된 정류장이 없음");
            }
        }
    };

    /** 정류장 선택 */
    const selectStation = useCallback(async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const selectedIndex = parseInt(e.currentTarget.id || "-1");
        const selectedStation = stationList[selectedIndex];

        if (setBusList && selectedStation) {
            const busApiData: IBusApi = await getBusList(userRole, { arsId: selectedStation.arsId });
            const busInstances: Bus[] = await Promise.all(busApiData.busList.filter((bus) => bus.busRouteId !== undefined).map(async (bus) => {
                const destinationApiData: IDestinationApi = await getBusDestinationList(userRole, { busRouteId: bus.busRouteId! });
                const destinationInstances: IDestination[] = destinationApiData.destinations.map((destination) => {
                    return {
                        stationName: destination.stationNm,
                        direction: destination.direction
                    };
                })

                return new Bus(
                    bus.busRouteId,
                    bus.busRouteNm,
                    bus.busRouteAbrv,
                    destinationInstances,
                );
            }));

            console.log(busInstances)
            setBusList(busInstances);
            openBusTableModal();
        }
    }, [stationList, setBusList, openBusTableModal]);



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
        <div className={style.StationTable}>
            <div className={style.stationList}>
                <div className={style.stationList__loading}>
                    <input className={style.stationList__loading_text} type="text" placeholder="정류장 검색" ref={stationName} />
                    <button className={style.stationList__loading_button} type="button" onClick={loadStation}>검색</button>
                    <button className={style.stationList__loading_button} type="button" onClick={startCamera}>카메라 시작</button>
                    <button className={style.stationList__loading_button} type="button" onClick={captureAndSend}>사진 찍기 & 전송</button>
                    <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                </div>
                <div className={style.stationList__display} ref={stationTable} style={{ visibility: "hidden" }}>
                    <VirtualizedTable
                        windowHeight={stationListHeight}

                        numColumns={tableColumns.length}
                        columnHeight={0}
                        columnWidths={tableColumns.map((column) => column.style)}
                        renderColumns={({ index, columnClassName, columnStyle }) => {
                            return (
                                <div key={index} className={columnClassName} style={columnStyle}>
                                    {tableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={stationList.length}
                        rowHeight={30}
                        renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                            const stationInfo = stationList[index].print();
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle} onClick={(e) => {
                                    selectStation(e);
                                }}>
                                    <div className={itemClassName} style={itemStyles[0]}>{index + 1}</div>
                                    <div className={itemClassName} style={itemStyles[1]}>{stationInfo.stationName}</div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>

            {busList.length > 0 &&
                <BusTableModal>
                    <BusTable busList={busList} onClose={() => {
                        if (setBusList) {
                            setBusList([]);
                            closeBusTableModal();
                        }
                    }} />
                </BusTableModal>
            }
        </div>
    );
}

//    <CourseDetails course={displayedCourse} onClose={closeBusListModal} />