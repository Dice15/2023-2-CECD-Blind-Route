import axios from "axios";
import qs from 'qs';

export interface IStationApi {
    arsId?: string;
    stId?: string;
    stNm?: string;
}

export async function getStationList(params: { searchKeyword: string }) {
    let data: IStationApi[] = [];
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
    console.log(data);
    return data;
}