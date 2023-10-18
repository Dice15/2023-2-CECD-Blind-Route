import { UserRole } from "../../../../cores/types/UserRole";
import ClientBookmark from "../bookmark/ClientBookmark";
import ClientSearch from "../system/ClientSearch";
import style from "./ClientActionForm.module.css";



/** ClientActionForm 컴포넌트 프로퍼티 */
export interface ClientActionFormProps {
    userRole: UserRole;
    action: "search" | "bookmark";
}



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