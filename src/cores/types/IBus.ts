/**
 * 버스 인터페이스
 * busRouteId: 버스 고유 아이디
 * busRouteNumber: 버스 번호
 * busRouteAbbreviation: 버스 노선
 * busDestination: 버스 도착 정류장 리스트
 */
export default interface IBus {
    stationArsId: string;
    stationName: string;
    busRouteId: string;
    busRouteNumber: string;
    busRouteAbbreviation: string;
    busDestinationList: {
        stationName: string;
        direction: string;
    }[];

    print(): {
        stationArsId: string;
        stationName: string;
        busRouteId: string;
        busRouteNumber: string;
        busRouteAbbreviation: string;
        busDestinationList: string[];
    };
}