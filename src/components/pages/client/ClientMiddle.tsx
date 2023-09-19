import { UserRole } from "../../../cores/types/UserRole";
import StationTable from "../common/stationtable/StationTable";
import style from "./ClientMiddle.module.css"



/** ClientMiddle 컴포넌트 프로퍼티 */
export interface ClientMiddleProps {
    userRole: UserRole;
}



/** ClientMiddle 컴포넌트 */
export default function ClientMiddle({ userRole }: ClientMiddleProps) {
    return (
        <div className={style.ClientMiddle}>
            <StationTable userRole={userRole} />
        </div>
    );
}

//        