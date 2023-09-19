/**
 * 정류장 인터페이스
 * arsId: 정류장 고유 식별자
 * stationId: 정류장 고유 아이디
 * stationName: 정류장 이름
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