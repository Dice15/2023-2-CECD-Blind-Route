import IBus from "./IBus";

export default class Course implements IBus {
    busRouteId: string;
    busRouteNumber: string;
    busRouteAbbreviation: string;

    constructor(
        busRouteId?: string,
        busRouteNumber?: string,
        busRouteAbbreviation?: string,
    ) {
        this.busRouteId = busRouteId ? busRouteId : "";
        this.busRouteNumber = busRouteNumber ? busRouteNumber : "";
        this.busRouteAbbreviation = busRouteAbbreviation ? busRouteAbbreviation : "";
    }

    public print() {
        return {
            busRouteId: this.busRouteId,
            busRouteNumber: this.busRouteNumber,
            busRouteAbbreviation: this.busRouteAbbreviation,
        };
    }
}