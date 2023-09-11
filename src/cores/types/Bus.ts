import IBus from "./IBus";
import IDestination from "./IDestination";

export default class Bus implements IBus {
    busRouteId: string;
    busRouteNumber: string;
    busRouteAbbreviation: string;
    busDestination: IDestination[];

    constructor(
        busRouteId?: string,
        busRouteNumber?: string,
        busRouteAbbreviation?: string,
        busDestination?: IDestination[],
    ) {
        this.busRouteId = busRouteId ? busRouteId : "";
        this.busRouteNumber = busRouteNumber ? busRouteNumber : "";
        this.busRouteAbbreviation = busRouteAbbreviation ? busRouteAbbreviation : "";
        this.busDestination = busDestination ? busDestination : [];
    }

    public print() {
        return {
            busRouteId: this.busRouteId,
            busRouteNumber: this.busRouteNumber,
            busRouteAbbreviation: this.busRouteAbbreviation,
            busDestination: this.busDestination.map((destiantion) => `${destiantion.stationName} (${destiantion.direction})방향`),
        };
    }
}