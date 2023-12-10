import axios from "axios";
import qs from 'qs';
import { UserRole } from "../types/UserRole";
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
 * 해당 정류장에 예약된 버스 리스트를 받아오는 API
 * IReservedBusApi
 * getReservedBusList
 */

/** API로 부터 받은 예약된 버스 데이터 인터페이스*/
interface IReservedBusApi {
    busInfo: {
        arsId?: string;
        busRouteId?: string;
        busRouteNm?: string;
        busRouteAbrv?: string;
    }[];
}

/** 해당 정류장에 예약된 버스리스트를 받아옴 */
export async function getReservedBusList(userRole: UserRole, params: { arsId: string }) {
    let responsedReservedBusList: IReservedBusApi = { busInfo: [] };
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
        responsedReservedBusList = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }

    return responsedReservedBusList.busInfo.map((bus) => {
        return new Bus(
            params.arsId,
            bus.busRouteId,
            bus.busRouteNm,
            bus.busRouteAbrv,
        );
    });
}



/**
 * 전광판에서 캡쳐한 이미지를 서버로 보냄
 * ISendCapturedImage
 * sendCapturedImage
 */

/** 서버에서 받은 이미지를 리턴해줌 */
interface IExtractedBusNumber {
    busRouteNm: number;
}

/** 전광판에서 캡쳐한 이미지를 서버로 보냄 */
export async function extractBusNumberFromImage(userRole: UserRole, params: { arsId: string, image: Blob }) {
    let result: IExtractedBusNumber = { busRouteNm: 0 };

    const formData = new FormData();
    formData.append('image', params.image, 'photo.jpeg');

    try {
        const response = await axios.post(
            getApiUrl(userRole, "/image/test/byte"),
            formData,
            {
                headers: {
                    //"Content-Type": "application/x-www-form-urlencoded"
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            }
        );
        //console.log(response, response.data, typeof response.data);
        result.busRouteNm = response.data;

    } catch (error) {
        console.error("Image upload failed:", error);
    }

    return result.busRouteNm;
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
        //console.log("detectedTest: ", response.data);
        data = response.data;
    }
    catch (error) {
        console.error("Search request failed:", error);
    }
    return { result: data };
}

