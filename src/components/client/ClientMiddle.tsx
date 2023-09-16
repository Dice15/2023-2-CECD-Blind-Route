import { UserRole } from "../../cores/types/UserRole";
import style from "./ClientMiddle.module.css"
import StationTable from "./StationTable";

export interface ClientMiddleProps {
    userRole: UserRole;
}


export default function ClientMiddle({ userRole }: ClientMiddleProps) {
    return (
        <div className={style.HomeMiddle}>
            <StationTable userRole={userRole} />
        </div>
    );
}

//    