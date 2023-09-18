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

export interface IBusNumberFromImage {
    data?: Blob;
}

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
