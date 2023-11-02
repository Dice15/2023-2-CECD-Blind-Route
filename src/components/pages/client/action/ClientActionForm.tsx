import { UserRole } from "../../../../cores/types/UserRole";
import ClientBookmark from "../bookmark/ClientBookmark";
import ClientReset from "../reset/ClientReset";
import ClientSearch from "../search/ClientSearch";
import style from "./ClientActionForm.module.css";



/** ClientActionForm 컴포넌트 프로퍼티 */
export interface ClientActionFormProps {
    userRole: UserRole;
    action: ClientAction;
}



/** ClientAction 종류 */
export type ClientAction = "search" | "bookmark" | "resetBookmark";



/** ClientActionForm 컴포넌트 */
export default function ClientActionForm({ userRole, action }: ClientActionFormProps) {

    /** action에 맞는 from리턴 */
    const getActionForm = () => {
        switch (action) {
            case "search": {
                return <ClientSearch
                    userRole={userRole}
                />;
            }
            case "bookmark": {
                return <ClientBookmark
                    userRole={userRole}
                />;
            }
            case "resetBookmark": {
                return <ClientReset
                    userRole={userRole}
                    resetType={"resetBookmark"}
                />
            }
            default: {
                return <></>;
            }
        }
    };

    

    // Render
    return (
        <div className={style.ClientActionFrom}>
            {getActionForm()}
        </div>
    );
}