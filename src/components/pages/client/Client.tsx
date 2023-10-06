import style from "./Client.module.css"
import ClientMiddle from "./ClientMiddle";
import ClientTop from "./ClientTop";
import { UserRole } from "../../../cores/types/UserRole";
import { AuthenticationState } from "../common/authentication/Authentication";



/** 클라이언트 페이지 메인 컴포넌트 프로퍼티 */
export interface ClientProps {
    userRole: UserRole;
    authentication: { state: AuthenticationState, setState: React.Dispatch<React.SetStateAction<AuthenticationState>> };
}



/** 클라이언트 페이지 메인 컴포넌트 */
export default function Client({ userRole }: ClientProps) {


    return (
        <div className={style.Client}>
            <div className={style.client__top}>
                <ClientTop userRole={userRole} />
            </div>
            <div className={style.client__middle}>
                <ClientMiddle userRole={userRole} />
            </div>
        </div>
    )
}