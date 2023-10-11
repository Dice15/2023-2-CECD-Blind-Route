import axios from "axios";
import qs from 'qs';
import { UserRole } from "../types/UserRole";



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
export function redirectToLogout(userRole: UserRole) {
    window.location.href = getApiUrl(userRole, "/logout");
};



/**
 * API로 부터 정류장 리스트를 받아오는 작업
 * IStationApi
 * getStationList
 */

/** API로 부터 받은 정류장 데이터 인터페이스*/
export interface IStationApi {
    busStations: {
        arsId?: string;
        stId?: string;
        stNm?: string;
    }[];
}

/** API로 부터 받은 정류장 데이터를 Station타입의 리스트 형태로 반환 */
export async function getStationList(userRole: UserRole, params: { searchKeyword: string }) {
    let data: IStationApi = { busStations: [] };
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
        data = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }
    return data;
}



/**
 * API로 부터 버스 리스트를 받아오는 작업
 * IBusApi
 * getBusList
 */

/** API로 부터 받은 버스 데이터 인터페이스*/
export interface IBusApi {
    busList: {
        busRouteId?: string;
        busRouteNm?: string;
        busRouteAbrv?: string;
    }[];
}

/** API로 부터 받은 버스 데이터를 Bus타입의 리스트 형태로 반환 */
export async function getBusList(userRole: UserRole, params: { arsId: string }) {
    let data: IBusApi = { busList: [] };
    try {
        const postData = qs.stringify(params);
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
        data = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }
    return data;
}



/**
 * API로 부터 버스 정류장 리스트를 받아오는 작업
 * IBusApi
 * getBusList
 */

/** API로 부터 받은 버스 데이터 인터페이스*/
export interface IDestinationApi {
    destinations: {
        stationNm: string;
        direction: string;
    }[];
}


/** API로 부터 받은 버스 데이터를 Bus타입의 리스트 형태로 반환 */
export async function getBusDestinationList(userRole: UserRole, params: { busRouteId: string }) {
    let data: IDestinationApi = { destinations: [] };
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

        data = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }
    return data;
}



/**
 * API로 부터 버스 정류장 리스트를 받아오는 작업
 * IBusApi
 * getBusList
 */

/** API로 부터 받은 버스 데이터 인터페이스*/
export type IRegisterBus = "success" | "fail";


/** API로 부터 받은 버스 데이터를 Bus타입의 리스트 형태로 반환 */
export async function reserveBus(userRole: UserRole, params: { arsId: string, busRouteId: string, busRouteNm: string, busRouteAbrv: string }) {
    let data: IRegisterBus = "fail";
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
        data = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }
    return data;
}