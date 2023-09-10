/**
 * 정류장 정보 인터페이스
 */
export default interface IStation {
    arsId: string;
    stationId: string;
    stationName: string;

    print(): {
        arsId: string;
        stationId: string;
        stationName: string;
    };
}