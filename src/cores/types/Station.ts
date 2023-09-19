import IStation from "./IStation";



/**
 * 정류장 클래스
 * arsId: 정류장 고유 식별자
 * stationId: 정류장 고유 아이디
 * stationName: 정류장 이름
 */
export default class Station implements IStation {
    arsId: string;
    stationId: string;
    stationName: string;

    constructor(
        arsId?: string,
        stationId?: string,
        stationName?: string
    ) {
        this.arsId = arsId ? arsId : "";
        this.stationId = stationId ? stationId : "";
        this.stationName = stationName ? stationName : "";
    }

    public print() {
        return {
            arsId: this.arsId,
            stationId: this.stationId,
            stationName: this.stationName,
        };
    }
}