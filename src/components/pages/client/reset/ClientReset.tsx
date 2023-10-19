import style from "./ClientReset.module.css"
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserRole } from "../../../../cores/types/UserRole";
import ClientResetBookmark from "./ClientResetBookmark";



/** ClientReset 컴포넌트 프로퍼티 */
export interface ClientResetProps {
    userRole: UserRole;
    resetType: ClientResetType;
}



/** 컨트롤러 상태 */
export type ClientResetType = "resetBookmark";



/** ClientReset 컴포넌트 */
export default function ClientReset({ userRole, resetType }: ClientResetProps) {

    /** 페이지 상태에 따른 알맞는 컨트롤러 반환 */
    const getControllerForm = () => {
        switch (resetType) {
            case "resetBookmark": {
                return <ClientResetBookmark
                    userRole={userRole}
                />;
            }
            default: {
                return <></>;
            }
        }
    };



    // Render
    return (
        <div className={style.ClientReset}>
            <TransitionGroup>
                <CSSTransition
                    key={resetType}
                    timeout={300}
                    classNames={{
                        enter: style["zoomEnter"],
                        enterActive: style["zoomEnterActive"],
                        exit: style["zoomExit"],
                        exitActive: style["zoomExitActive"]
                    }}
                >
                    <div className={style.controllerForm}>
                        {getControllerForm()}
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}