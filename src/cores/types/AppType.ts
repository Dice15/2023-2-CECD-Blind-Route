/** 프로그램 타입 
 * 
 * client: 사람들이 사용할 스마트폰 앱
 * 
 * panel: 정류장의 전광판에서 사용할 앱
 */
export type AppType = "client" | "panel";



/** 프로그램 타입 종류를 저장한 리스트 */
export const appTypeList: AppType[] = ["client", "panel"];