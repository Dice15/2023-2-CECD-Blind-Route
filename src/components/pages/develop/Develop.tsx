import { useNavigate } from "react-router-dom";
import style from "./Develop.module.css"
import { UserRole, userRoleList } from "../../../cores/types/UserRole";
import { AppType, appTypeList } from "../../../cores/types/AppType";
import { useRef } from "react";



/** Develop 페이지 프로퍼티 */
export interface DevelopProps {
    setAppType: React.Dispatch<React.SetStateAction<AppType>>;
    setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}



/** Develop 페이지
 * 
 * 앱 타입: client, panel
 * 
 * 유저 타입: user, developer
 * 
 */
export default function Develop({ setAppType, setUserRole }: DevelopProps) {
    /* const */
    const history = useNavigate();


    /* ref */
    const appTypeCombobox = useRef<HTMLSelectElement>(null);
    const userRoleCombobox = useRef<HTMLSelectElement>(null);


    /** home 페이지로 이동 */
    const moveToHome = (appTyle: AppType, userRole: UserRole) => {
        setAppType(appTyle)
        setUserRole(userRole);
        history("/home");
    }


    return (
        <div className={style.Develop}>
            <div className={style.develop__header}>
                <h1 className={style.develop__header__title}>{`Blind Route`}</h1>
            </div>
            <div className={style.develop__body}>
                <div className={style.appconfig}>
                    <select className={style.appconfig__combobox} ref={appTypeCombobox}>
                        {appTypeList.map((appType) => (<option>{appType}</option>))}
                    </select>
                    <select className={style.appconfig__combobox} ref={userRoleCombobox}>
                        {userRoleList.map((userRole) => (<option>{userRole}</option>))}
                    </select>
                    <button className={style.appconfig__button} type="button" onClick={() => {
                        if (appTypeCombobox.current && userRoleCombobox.current) {
                            moveToHome(appTypeCombobox.current.value as AppType, userRoleCombobox.current.value as UserRole);
                        }
                    }}>설정 완료</button>
                </div>
            </div>
        </div>
    )
}