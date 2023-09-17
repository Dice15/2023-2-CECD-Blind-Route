import style from "./Panel.module.css";
import { UserRole } from "../../cores/types/UserRole";
import PanelTop from "./PanelTop";
import PanelMiddle from "./PanelMiddle";

export interface PanelProps {
    userRole: UserRole;
}

export default function Panel({ userRole }: PanelProps) {
    return (
        <div className={style.Panel}>
            <div className={style.panel__top}>
                <PanelTop userRole={userRole} />
            </div>
            <div className={style.panel__middle}>
                <PanelMiddle userRole={userRole} />
            </div>
        </div>
    );
}