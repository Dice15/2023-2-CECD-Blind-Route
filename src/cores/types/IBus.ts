/**
 * 버스 정보 인터페이스
 */
export default interface IBus {
    busRouteNumber: string;
    busRouteAbbreviation: string;

    print(): {
        busRouteNumber: string;
        busRouteAbbreviation: string;
    };
}