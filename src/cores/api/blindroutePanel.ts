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
 * 버스 사진을 인식하여 버스 번호를 반환하는 API
 * IBusNumberFromImage
 * getBusNumberFromImage
 */

/** 이미지에서 버스 번호를 추출하는 API의 반환 형태*/
export interface IBusNumberFromImage {
    data?: Blob;
}

/** 이미지에서 버스 번호를 추출 */
export async function getBusNumberFromImage(userRole: UserRole, params: { image: Blob }) {
    let result: IBusNumberFromImage = { data: undefined };

    const formData = new FormData();
    formData.append('image', params.image, 'photo.jpeg');

    try {
        const response = await axios.post(
            getApiUrl(userRole, "/image/test/byte"),
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
                responseType: 'blob' // Important: to receive blob data
            }
        );

        const contentType = response.headers['content-type'];
        if (contentType.includes('image')) {
            result.data = new Blob([response.data], { type: contentType });
        } else {
            console.error("Received data is not of image type:", contentType);
        }
    } catch (error) {
        console.error("Image upload failed:", error);
    }

    return result;
}



/**
 * 해당 정류장에 예약된 버스 리스트를 받아오는 API
 * IReservedBusApi
 * getReservedBusList
 */

/** API로 부터 받은 예약된 버스 데이터 인터페이스*/
export interface IReservedBusApi {
    busInfo: {
        arsId?: string;
        busRouteId?: string;
        busRouteNm?: string;
        busRouteAbrv?: string;
    }[];
}

/** 해당 정류장에 예약된 버스리스트를 받아옴 */
export async function getReservedBusList(userRole: UserRole, params: { arsId: string }) {
    let data: IReservedBusApi = { busInfo: [] };
    try {
        const postData = qs.stringify(params);
        const response = await axios.post(
            getApiUrl(userRole, "/select/wishroute"),
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
 * 해당 정류장에 버스 예약을 취소하는 API
 * IUnreserveBusApi
 * unreserveBus
 */

/** 예약을 취소하는 Api 반환 타입*/
export type IUnreserveBusApi = "success" | "fail";

/** 해당 정류장에 버스 예약을 취소 */
export async function unreserveBus(userRole: UserRole, params: { arsId: string, busRouteId: string, busRouteNm: string, busRouteAbrv: string }) {
    let data: IUnreserveBusApi = "fail";
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
        data = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }
    return data;
}