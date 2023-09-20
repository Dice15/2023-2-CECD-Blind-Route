import style from "./Panel.module.css";
import PanelTop from "./PanelTop";
import PanelMiddle from "./PanelMiddle";
import { UserRole } from "../../../cores/types/UserRole";



/** 전광판 페이지 메인 컴포넌트 프로퍼티 */
export interface PanelProps {
    userRole: UserRole;
}



/** 전광판 페이지 메인 컴포넌트 */
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