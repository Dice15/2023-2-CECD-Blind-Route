import axios from "axios";
import qs from 'qs';
import { UserRole } from "../types/UserRole";



/** 사용자 설정에 따른 Api Url 가져오기 */
function getApiUrl(userRole: UserRole, path: string) {
    let defaultUrl: string = "";

    switch (userRole) {
        case UserRole.USER: {
            defaultUrl = `https://blindroute-springboot.koyeb.app${path}`;
            break;
        }
        case UserRole.DEVELOPER: {
            defaultUrl = `https://localhost:8081${path}`;
            break;
        }
    }

    console.log(defaultUrl);
    return defaultUrl;
}



/** 
 * 로그인
 */
export function onLogin(userRole: UserRole) {
    window.location.href = getApiUrl(userRole, "/oauth2/authorization/google");
};


/** 
 * 로그아웃
 */
export function onLogout(userRole: UserRole) {
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
    console.log(data);
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
 * 이미지 테스트
 */

export interface IImageUploadApi {
    success: boolean;
    message: string;
}

export async function sendImageToAPI(userRole: UserRole, params: { image: Blob }) {
    let result: any;

    const formData = new FormData();
    formData.append('image', params.image, 'photo.jpg');

    try {
        const response = await axios.post(
            getApiUrl(userRole, "/image/test/byte"),
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            }
        );

        result = response.data;
    } catch (error) {
        console.error("Image upload failed:", error);
    }

    return result;
}
