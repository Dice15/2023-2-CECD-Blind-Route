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
        busRouteId?: string;
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
export async function getBusDestinationList(params: { busRouteId: string }) {
    let data: IDestinationApi = { destinations: [] };
    try {
        const postData = qs.stringify(params);
        const response = await axios.post(
            "https://blindroute-springboot.koyeb.app/search/destination",
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

export async function sendImageToAPI(params: { image: Blob }) {
    let result: any;

    const formData = new FormData();
    formData.append('image', params.image, 'photo.jpg');

    try {
        const response = await axios.post(
            "https://blindroute-springboot.koyeb.app/image/test/string",
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
