import IStation from "./IStation";

export default class Course implements IStation {
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