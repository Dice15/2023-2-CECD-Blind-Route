import axios from "axios";
import qs from 'qs';
import { UserRole } from "../types/UserRole";
import Station from "../types/Station";
import Bus from "../types/Bus";



/*****************************************************************
 * API URL을 구성하고 반환하는 메서드입니다.
 *****************************************************************/

/**
 * getApiUrl 메서드는 사용자의 역할에 따라 API의 기본 URL을 결정하고, API 경로를 추가하여 완성된 API URL을 반환합니다.
 * @param userRole 사용자 역할입니다. 사용자 역할에 따라 API의 기본 URL을 결정합니다.
 * @param path API 경로입니다.
 * @returns {string} 구성된 API URL을 반환합니다.
 */
function getApiUrl(userRole: UserRole, path: string): string {
    const baseUrl = userRole === 'user'
        ? `https://blindroute-springboot.koyeb.app${path}`
        : `https://localhost:8081${path}`;
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(`[${formattedTime}] request: ${baseUrl}`);
    return baseUrl;
}






/*****************************************************************
 * Google OAuth 인증 및 세션 유효성 확인을 수행하는 API 메서드들입니다.
 *****************************************************************/

/**
 * redirectToGoogleAuth 메서드는 Google OAuth 인증 페이지로 리다이렉션합니다.
 * @param userRole 사용자 역할입니다.
 */
export function redirectToGoogleAuth(userRole: UserRole): void {
    window.location.href = getApiUrl(userRole, "/oauth2/authorization/google");
}

/**
 * redirectToLogout 메서드는 로그아웃 페이지로 리다이렉션합니다.
 * @param userRole 사용자 역할입니다.
 */
export function redirectToLogout(userRole: UserRole): void {
    window.location.href = getApiUrl(userRole, "/logout");
}

/**
 * isSessionValid 메서드는 로그인 세션의 유효성을 확인합니다.
 * @param userRole 사용자 역할입니다.
 * @returns {Promise<boolean>} 로그인 세션이 유효하면 true, 그렇지 않으면 false를 반환합니다.
 */
export async function isSessionValid(userRole: UserRole): Promise<boolean> {
    let sessionData: boolean = false;
    try {
        const response = await axios.get(
            getApiUrl(userRole, "/authentication"),
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        sessionData = response.data;
    } catch (error) {
        console.error("로그인 세션 확인 실패:", error);
    }
    return sessionData;
}






/*****************************************************************
 * API로부터 정류장 데이터를 가져오는 API 메서드입니다.
 *****************************************************************/

/** 정류장 데이터 인터페이스 */
interface IResponseStationList {
    busStations: {
        arsId?: string;
        stId?: string;
        stNm?: string;
    }[] | null;
}

/**
 * getStationList 메서드는 정류장 목록을 검색합니다.
 * @param userRole 사용자 역할입니다.
 * @param searchKeyword 검색 키워드입니다.
 * @returns {Promise<Station[]>} 검색된 정류장 목록을 반환합니다.
 */
export async function getStationList(userRole: UserRole, searchKeyword: string): Promise<Station[]> {
    let stationListData: IResponseStationList = { busStations: [] };
    try {
        const postData = qs.stringify({ searchKeyword: searchKeyword });
        const response = await axios.post(
            getApiUrl(userRole, "/search/station"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        stationListData = response.data;
    } catch (error) {
        console.error("정류장 검색 요청 실패:", error);
    }
    return (stationListData.busStations || []).map(station => new Station(station.arsId, station.stId, station.stNm));
}






/*****************************************************************
 * API로부터 버스 데이터를 가져오는 API 메서드들입니다.
 *****************************************************************/

/** 버스 노선 데이터 인터페이스 */
interface IResponseDestinationList {
    destinations: {
        stationNm: string;
        direction: string;
    }[];
}

/** 버스 데이터 인터페이스 */
interface IResponseBusList {
    busList: {
        busRouteId?: string;
        busRouteNm?: string;
        busRouteAbrv?: string;
    }[];
}

/**
 * getBusDestinationList 메서드는 API로부터 버스 노선 데이터를 가져옵니다.
 * @param userRole 사용자 역할입니다.
 * @param busRouteId 버스 노선 ID입니다.
 * @returns {Promise<IResponseDestinationList>} 버스 노선 데이터를 반환합니다.
 */
async function getBusDestinationList(userRole: UserRole, busRouteId: string): Promise<IResponseDestinationList> {
    let destinationListData: IResponseDestinationList = { destinations: [] };
    try {
        const postData = qs.stringify({ busRouteId: busRouteId });
        const response = await axios.post(
            getApiUrl(userRole, "/search/destination"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );

        destinationListData = response.data;
    }
    catch (error) {
        console.error("노선 데이터 검색 요청 실패:", error);
    }
    return destinationListData;
}

/**
 * getBusList 메서드는 API로부터 버스 데이터를 가져와 Bus 타입의 리스트 형태로 반환합니다.
 * @param userRole 사용자 역할입니다.
 * @param stationArsId 정류장 ARS ID입니다.
 * @param stationName 정류장 이름입니다.
 * @returns {Promise<Bus[]>} 버스 데이터 리스트를 반환합니다.
 */
export async function getBusList(userRole: UserRole, stationArsId: string, stationName: string): Promise<Bus[]> {
    let busListData: IResponseBusList = { busList: [] };

    try {
        const postData = qs.stringify({ arsId: stationArsId });
        const response = await axios.post(
            getApiUrl(userRole, "/select/route"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        busListData = response.data;
    }
    catch (error) {
        console.error("버스 데이터 검색 요청 실패:", error);
    }

    return Promise.all(busListData.busList.filter((bus) => bus.busRouteId !== undefined).map(async (bus) => {
        const destinationListData = (await getBusDestinationList(userRole, bus.busRouteId!)).destinations.map((destination) => {
            return {
                stationName: destination.stationNm,
                direction: destination.direction
            };
        })

        return new Bus(
            stationArsId,
            stationName,
            bus.busRouteId,
            bus.busRouteNm,
            bus.busRouteAbrv,
            destinationListData,
        );
    }));
}







/*****************************************************************
 * 버스 예약, 예약 취소, 및 도착 확인을 수행하는 API 메서드들입니다.
 *****************************************************************/

/** 버스 예약 상태 인터페이스 */
type IResponseReserveStatus = "success" | "fail";

/** 버스 도착 확인 인터페이스 */
type IResponseArrivalCheck = boolean;

/**
 * reserveBus 메서드는 해당 정류장의 버스를 예약합니다.
 * @param userRole 사용자 역할입니다.
 * @param targetBus 대상 버스 객체입니다.
 * @returns {Promise<boolean>} 예약 성공 여부를 반환합니다.
 */
export async function reserveBus(userRole: UserRole, targetBus: Bus): Promise<boolean> {
    let reservationStatus: IResponseReserveStatus = "fail";
    try {
        const postData = qs.stringify({
            arsId: targetBus.stationArsId,
            busRouteId: targetBus.busRouteId,
            busRouteNm: targetBus.busRouteNumber,
            busRouteAbrv: targetBus.busRouteAbbreviation
        });
        const response = await axios.post(
            getApiUrl(userRole, "/select/bus"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        reservationStatus = response.data;
    }
    catch (error) {
        console.error("Bus reservation request failed:", error);
    }

    return reservationStatus === "success";
}

/**
 * unreserveBus 메서드는 해당 정류장의 버스 예약을 취소합니다.
 * @param userRole 사용자 역할입니다.
 * @param targetBus 대상 버스 객체입니다.
 * @returns {Promise<boolean>} 예약 취소 성공 여부를 반환합니다.
 */
export async function unreserveBus(userRole: UserRole, targetBus: Bus): Promise<boolean> {
    let cancellationStatus: IResponseReserveStatus = "fail";
    try {
        const postData = qs.stringify({
            arsId: targetBus.stationArsId,
            busRouteId: targetBus.busRouteId,
            busRouteNm: targetBus.busRouteNumber,
            busRouteAbrv: targetBus.busRouteAbbreviation
        });
        const response = await axios.post(
            getApiUrl(userRole, "/delete/bus"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        cancellationStatus = response.data;
    }
    catch (error) {
        console.error("Bus unreservation request failed:", error);
    }

    return cancellationStatus === "success";
}

/**
 * checkBusArrival 메서드는 사용자가 예약한 버스가 도착했는지 확인합니다.
 * @param userRole 사용자 역할입니다.
 * @param targetBus 대상 버스 객체입니다.
 * @returns {Promise<boolean>} 버스 도착 여부를 반환합니다.
 */
export async function checkBusArrival(userRole: UserRole, targetBus: Bus): Promise<boolean> {
    let arrivalStatus: IResponseArrivalCheck = false;
    try {
        const postData = qs.stringify({
            arsId: targetBus.stationArsId,
            busRouteId: targetBus.busRouteId,
            busRouteNm: targetBus.busRouteNumber,
            busRouteAbrv: targetBus.busRouteAbbreviation
        });
        const response = await axios.post(
            getApiUrl(userRole, "/select/arrivalCheck"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        arrivalStatus = response.data;
    }
    catch (error) {
        console.error("Bus arrival check request failed:", error);
    }

    return arrivalStatus;
}






/*****************************************************************
 * 즐겨찾기 관리를 위한 API 메서드들입니다.
 *****************************************************************/

/** 즐겨찾기 등록/삭제/목록 가져오기 상태 인터페이스 */
type IResponseBookmarkStatus = boolean;

/** 즐겨찾기 목록 인터페이스 */
interface IBookmarkList {
    bookmarkList: {
        arsId: string;
        stNm: string;
        busRouteId: string;
        busRouteNm: string;
        busRouteAbrv: string
    }[] | null;
};

/**
 * registerBookmark 메서드는 버스를 즐겨찾기에 등록합니다.
 * @param userRole 사용자 역할입니다.
 * @param targetBus 대상 버스 객체입니다.
 * @returns {Promise<boolean>} 즐겨찾기 등록 성공 여부를 반환합니다.
 */
export async function registerBookmark(userRole: UserRole, targetBus: Bus): Promise<boolean> {
    let registrationStatus: IResponseBookmarkStatus = false;
    try {
        const postData = qs.stringify({
            arsId: targetBus.stationArsId,
            stNm: targetBus.stationName,
            busRouteId: targetBus.busRouteId,
            busRouteNm: targetBus.busRouteNumber,
            busRouteAbrv: targetBus.busRouteAbbreviation
        });
        const response = await axios.post(
            getApiUrl(userRole, "/bookmark/register"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        registrationStatus = response.data;
    }
    catch (error) {
        console.error("Bookmark registration request failed:", error);
    }

    return registrationStatus;
}

/**
 * removeBookmark 메서드는 버스를 즐겨찾기에서 삭제합니다.
 * @param userRole 사용자 역할입니다.
 * @param targetBus 대상 버스 객체입니다.
 * @returns {Promise<boolean>} 즐겨찾기 삭제 성공 여부를 반환합니다.
 */
export async function removeBookmark(userRole: UserRole, targetBus: Bus): Promise<boolean> {
    let removalStatus: IResponseBookmarkStatus = false;
    try {
        const postData = qs.stringify({
            arsId: targetBus.stationArsId,
            stNm: targetBus.stationName,
            busRouteId: targetBus.busRouteId,
            busRouteNm: targetBus.busRouteNumber,
            busRouteAbrv: targetBus.busRouteAbbreviation
        });
        const response = await axios.post(
            getApiUrl(userRole, "/bookmark/remove"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        removalStatus = response.data;
    }
    catch (error) {
        console.error("Bookmark removal request failed:", error);
    }

    return removalStatus;
}

/**
 * clearBookmark 메서드는 모든 즐겨찾기를 비웁니다.
 * @param userRole 사용자 역할입니다.
 * @returns {Promise<boolean>} 즐겨찾기 비우기 성공 여부를 반환합니다.
 */
export async function clearBookmark(userRole: UserRole): Promise<boolean> {
    let clearStatus: IResponseBookmarkStatus = false;
    try {
        const postData = qs.stringify({});
        const response = await axios.post(
            getApiUrl(userRole, "/bookmark/removeall"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        clearStatus = response.data;
    }
    catch (error) {
        console.error("Clear bookmark request failed:", error);
    }

    return clearStatus;
}

/**
 * getBookmarkList 메서드는 즐겨찾기 목록을 가져옵니다.
 * @param userRole 사용자 역할입니다.
 * @returns {Promise<Bus[]>} 즐겨찾기 목록을 반환합니다.
 */
export async function getBookmarkList(userRole: UserRole): Promise<Bus[]> {
    let bookmarkListData: IBookmarkList = { bookmarkList: [] };
    try {
        const postData = qs.stringify({});
        const response = await axios.post(
            getApiUrl(userRole, "/bookmark/list"),
            postData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        bookmarkListData = response.data;
    }
    catch (error) {
        console.error("Get bookmark list request failed:", error);
    }

    return (bookmarkListData.bookmarkList || []).map((bookmark) => new Bus(
        bookmark.arsId,
        bookmark.stNm,
        bookmark.busRouteId,
        bookmark.busRouteNm,
        bookmark.busRouteAbrv
    ));
}
