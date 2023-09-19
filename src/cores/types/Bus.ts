import IBus from "./IBus";


/**
 * 버스 클래스
 * busRouteId: 버스 고유 아이디
 * busRouteNumber: 버스 번호
 * busRouteAbbreviation: 버스 노선
 * busDestination: 버스 도착 정류장 리스트
 */
export default class Bus implements IBus {
    busRouteId: string;
    busRouteNumber: string;
    busRouteAbbreviation: string;
    busDestinationList: {
        stationName: string;
        direction: string;
    }[];

    constructor(
        busRouteId?: string,
        busRouteNumber?: string,
        busRouteAbbreviation?: string,
        busDestination?: {
            stationName: string;
            direction: string;
        }[],
    ) {
        this.busRouteId = busRouteId ? busRouteId : "";
        this.busRouteNumber = busRouteNumber ? busRouteNumber : "";
        this.busRouteAbbreviation = busRouteAbbreviation ? busRouteAbbreviation : "";
        this.busDestinationList = busDestination ? busDestination : [];
    }

    public print() {
        return {
            busRouteId: this.busRouteId,
            busRouteNumber: this.busRouteNumber,
            busRouteAbbreviation: this.busRouteAbbreviation,
            busDestinationList: this.busDestinationList.map((destiantion) => `${destiantion.stationName} (${destiantion.direction})방향`),
        };
    }
}