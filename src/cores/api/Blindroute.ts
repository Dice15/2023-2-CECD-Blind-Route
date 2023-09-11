import axios from "axios";
import qs from 'qs';


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
export async function getStationList(params: { searchKeyword: string }) {
    let data: IStationApi = { busStations: [] };
    try {
        const postData = qs.stringify(params);
        const response = await axios.post(
            "https://blindroute-springboot.koyeb.app/search/station",
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
        busRouteNm?: string;
        busRouteAbrv?: string;
    }[];
}

/** API로 부터 받은 버스 데이터를 Bus타입의 리스트 형태로 반환 */
export async function getBusList(params: { arsId: string }) {
    let data: IBusApi = { busList: [] };
    try {
        const postData = qs.stringify(params);
        const response = await axios.post(
            "https://blindroute-springboot.koyeb.app/select/route",
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
export interface IRouteApi {
    busList: {
        busRouteNm?: string;
        busRouteAbrv?: string;
    }[];
}

/** API로 부터 받은 버스 데이터를 Bus타입의 리스트 형태로 반환 */
export async function getRoute(params: { busRouteNm: string }) {
    let data: string = "undefined";
    try {
        const postData = qs.stringify(params);
        const response = await axios.post(
            "https://blindroute-springboot.koyeb.app/select/bus",
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