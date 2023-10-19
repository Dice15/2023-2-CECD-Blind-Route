import axios from "axios";
import qs from 'qs';
import { UserRole } from "../types/UserRole";
import Station from "../types/Station";
import Bus from "../types/Bus";



/** 사용자 설정에 따른 Api Url 가져오기 */
function getApiUrl(userRole: UserRole, path: string) {
    let defaultUrl: string = "";

    switch (userRole) {
        case "user": {
            defaultUrl = `https://blindroute-springboot.koyeb.app${path}`;
            break;
        }
        case "developer": {
            defaultUrl = `https://localhost:8081${path}`;
            break;
        }
    }

    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${now.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(`[${formattedTime}] request: ${defaultUrl}`);

    return defaultUrl;
}



/** 
 * 로그인
 */
export function redirectToAccountLogin(userRole: UserRole) {
    window.location.href = getApiUrl(userRole, "/oauth2/authorization/google");
};


/** 
 * 로그아웃
 */
export function redirectToAccountLogout(userRole: UserRole) {
    window.location.href = getApiUrl(userRole, "/logout");
};



/** 
 * API로 로그인 세션이 유지되고 있는지 확인하는 작업
 * IAuthenticationApi
 * checkLoginSession
 */

/** API로 부터 받은 로그인 세션 확인 데이터 타입 */
type AuthSessionApi = boolean;


/** API로 부터 받은 로그인 세션 확인 결과를 boolean 형태로 반환 */
export async function checkAuthSession(userRole: UserRole) {
    let isAuthed: AuthSessionApi = false;
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
        isAuthed = response.data;
    } catch (error) {
        console.error("Failed to check login session:", error);
    }

    return isAuthed;
}



/**
 * API로 부터 정류장 리스트를 받아오는 작업
 * IStationApi
 * getStationList
 */

/** API로 부터 받은 정류장 데이터 인터페이스*/
interface IStationApi {
    busStations: {
        arsId?: string;
        stId?: string;
        stNm?: string;
    }[];
}

/** searchKeyword가 포함된 정류장들을 배열형태로 리턴함 */
export async function getStationList(userRole: UserRole, params: { searchKeyword: string }) {
    let responsedStationList: IStationApi = { busStations: [] };
    try {
        const postData = qs.stringify(params);
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
        responsedStationList = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    // api로 부터 받은 데이터를 Station 리스트로 반환
    return responsedStationList.busStations.map((station) => new Station(
        station.arsId,
        station.stId,
        station.stNm
    ));
}



/**
 * API로 부터 버스 리스트를 받아오는 작업
 * IDestinationApi
 * IBusApi
 * getBusDestinationList
 * getBusList
 */

/** API로 부터 받은 버스 노선 데이터 인터페이스*/
interface IDestinationApi {
    destinations: {
        stationNm: string;
        direction: string;
    }[];
}

/** API로 부터 받은 버스 데이터 인터페이스*/
interface IBusApi {
    busList: {
        busRouteId?: string;
        busRouteNm?: string;
        busRouteAbrv?: string;
    }[];
}

/** API로 부터 받은 버스 노선 데이터를 리스트 형태로 반환 */
async function getBusDestinationList(userRole: UserRole, params: { busRouteId: string }) {
    let responsedDestinationList: IDestinationApi = { destinations: [] };
    try {
        const postData = qs.stringify(params);
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

        responsedDestinationList = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }
    return responsedDestinationList;
}


/** API로 부터 받은 버스 데이터를 Bus타입의 리스트 형태로 반환 */
export async function getBusList(userRole: UserRole, stationArsId: string, stationName: string) {
    let responsedBusList: IBusApi = { busList: [] };

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
        responsedBusList = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }


    return Promise.all(responsedBusList.busList.filter((bus) => bus.busRouteId !== undefined).map(async (bus) => {
        const responsedDestinationList = (await getBusDestinationList(userRole, { busRouteId: bus.busRouteId! })).destinations.map((destination) => {
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
            responsedDestinationList,
        );
    }));
}



/**
 * 해당 정류장의 버스를 예약하는 API
 * IReserveBusApi
 * reserveBus
 */

/** API로 부터 받은 버스 데이터 인터페이스*/
type IReserveBusApi = "success" | "fail";


/** API로 부터 받은 버스 등록 성공 여부를 반환 받음 */
export async function reserveBus(userRole: UserRole, params: { arsId: string, busRouteId: string, busRouteNm: string, busRouteAbrv: string }) {
    let reserveCheck: IReserveBusApi = "fail";
    try {
        const postData = qs.stringify(params);
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
        reserveCheck = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return reserveCheck === "success";
}



/**
 * 해당 정류장의 버스 예약을 취소하는 API
 * IUnreserveBusApi
 * unreserveBus
 */

/** 예약을 취소하는 Api 반환 타입*/
type IUnreserveBusApi = "success" | "fail";

/** 해당 정류장에 버스 예약을 취소 */
export async function unreserveBus(userRole: UserRole, params: { arsId: string, busRouteId: string, busRouteNm: string, busRouteAbrv: string }) {
    let unreserveCheck: IUnreserveBusApi = "fail";
    try {
        const postData = qs.stringify(params);
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
        unreserveCheck = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return unreserveCheck === "success";
}



/**
 * 사용자가 예약한 버스가 도착했는지 확인하는 API
 * ICheckBusArrivalApi
 * checkBusArrival
 */

/** 약한 버스가 도착했다면 true, 아니면 false */
type ICheckBusArrivalApi = boolean;

/** 예약한 버스가 도착했는지 확인 */
export async function checkBusArrival(userRole: UserRole, params: { arsId: string, busRouteId: string, busRouteNm: string, busRouteAbrv: string }) {
    let isArrival: ICheckBusArrivalApi = false;
    try {
        const postData = qs.stringify(params);
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
        isArrival = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return isArrival;
}



/**
 * 버스를 즐거찾기에 등록
 * IRegisterBookmark
 * registerBookmark
 */

/** 버스를 즐거찾기에 등록의 성공여부를 반환*/
type IRegisterBookmarkApi = boolean;

/** 버스를 즐거찾기에 등록 */
export async function registerBookmark(userRole: UserRole, targetBus: Bus): Promise<boolean> {
    let result: IRegisterBookmarkApi = false;
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
        result = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return result;
}



/**
 * 버스를 즐거찾기에서 삭제
 * IRemoveBookmark
 * removeBookmark
 */

/** 버스를 즐거찾기에서 삭제의 성공여부를 반환*/
type IRemoveBookmarkApi = boolean;

/** 버스를 즐거찾기에서 삭제 */
export async function removeBookmark(userRole: UserRole, targetBus: Bus): Promise<boolean> {
    let result: IRemoveBookmarkApi = false;
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
        result = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return result;
}



/**
 * 즐겨찾기 비우기
 * IClearBookmark
 * clearBookmark
 */

/** 즐겨찾기 비우기 성공 여부 반환*/
type IClearBookmarkApi = boolean;

/** 즐겨찾기 비우기 */
export async function clearBookmark(userRole: UserRole): Promise<boolean> {
    let result: IClearBookmarkApi = false;
    try {
        const response = await axios.post(
            getApiUrl(userRole, "/bookmark/removeall"),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        result = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return result;
}



/**
 * 즐겨찾기 목록 가져오기
 * IClearBookmark
 * clearBookmark
 */

/** 즐겨찾기 목록*/
interface IGetBookmarkListApi {
    bookmarkList: {
        arsId: string,
        stNm: string,
        busRouteId: string,
        busRouteNm: string,
        busRouteAbrv: string
    }[]
};

/** 즐겨찾기 목록 가져오기 */
export async function getBookmarkList(userRole: UserRole): Promise<Bus[]> {
    let result: IGetBookmarkListApi = { bookmarkList: [] };
    try {
        const response = await axios.post(
            getApiUrl(userRole, "/bookmark/list"),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        console.log(response.data);
        result = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return result.bookmarkList.map((bookmark) => new Bus(
        bookmark.arsId,
        bookmark.stNm,
        bookmark.busRouteId,
        bookmark.busRouteNm,
        bookmark.busRouteAbrv
    ));
}