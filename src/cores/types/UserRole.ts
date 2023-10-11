/** 프로그램 사용자 권한
 * 
 * user: 일반 사용자
 * 
 * develop: 개발자
 */
export type UserRole = "user" | "developer";



/** 프로그램 사용자 권한을 저장한 리스트 */
export const userRoleList: UserRole[] = ["user", "developer"];