import IBus from "./IBus";

export default class Course implements IBus {
    busRouteNumber: string;
    busRouteAbbreviation: string;

    constructor(
        busRouteNumber?: string,
        busRouteAbbreviation?: string,
    ) {
        this.busRouteNumber = busRouteNumber ? busRouteNumber : "";
        this.busRouteAbbreviation = busRouteAbbreviation ? busRouteAbbreviation : "";
    }

    public print() {
        return {
            busRouteNumber: this.busRouteNumber,
            busRouteAbbreviation: this.busRouteAbbreviation,
        };
    }
}