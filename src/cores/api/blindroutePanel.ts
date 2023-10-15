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
 * 전광판에서 캡쳐한 이미지를 서버로 보냄
 * ISendCapturedImage
 * sendCapturedImage
 */

/** 서버에서 받은 이미지를 리턴해줌 */
export interface ISendCapturedImage {
    data?: Blob;
}

/** 전광판에서 캡쳐한 이미지를 서버로 보냄 */
export async function sendCapturedImage(userRole: UserRole, params: { arsId: string, image: Blob }) {
    let result: ISendCapturedImage = { data: undefined };

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






/** test */
export interface IDetectedTestApi {
    result: boolean;
};


export async function detectedTest(userRole: UserRole, params: { arsId: string, busRouteId: string, busRouteNm: string, busRouteAbrv: string }): Promise<IDetectedTestApi> {
    let data: boolean = false;
    try {
        const postData = qs.stringify(params);
        const response = await axios.post(
            getApiUrl(userRole, "/test"),
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
    console.log("detectedTest: ", data);
    return { result: data };
}

