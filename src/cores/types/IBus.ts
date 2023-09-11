import IDestination from "./IDestination";

/**
 * 버스 정보 인터페이스
 */
export default interface IBus {
    busRouteId: string;
    busRouteNumber: string;
    busRouteAbbreviation: string;
    busDestination: IDestination[];

    print(): {
        busRouteId: string;
        busRouteNumber: string;
        busRouteAbbreviation: string;
        busDestination: string[];
    };
}