import { useNavigate } from "react-router-dom";
import style from "./Develop.module.css"
import { UserRole, userRoleList } from "../../../cores/types/UserRole";
import { AppType, appTypeList } from "../../../cores/types/AppType";
import { useRef } from "react";
import { LocalStorageProvider } from "../../../modules/storage/AppStorageProvider";



/** Develop 페이지 프로퍼티 */
export interface DevelopProps { }



/** Develop 페이지
 * 
 * 앱 타입: client, panel
 * 
 * 유저 타입: user, developer
 * 
 */
export default function Develop() {
    /* const */
    const history = useNavigate();


    /* ref */
    const appTypeCombobox = useRef<HTMLSelectElement>(null);
    const userRoleCombobox = useRef<HTMLSelectElement>(null);


    /** home 페이지로 이동 */
    const moveToHome = (appType: AppType, userRole: UserRole) => {
        LocalStorageProvider.set("appType", appType);
        LocalStorageProvider.set("userRole", userRole);
        history("/home");
    }


    return (
        <div className={style.Develop}>
            <div className={style.header}>
                <h1 className={style.header__title}>{`Blind Route`}</h1>
            </div>

            <div className={style.body}>
                <div className={style.appconfig}>
                    <select className={style.appconfig__combobox} ref={appTypeCombobox}>
                        {appTypeList.map((appType, index) => (<option key={index}>{appType}</option>))}
                    </select>
                    <select className={style.appconfig__combobox} ref={userRoleCombobox}>
                        {userRoleList.map((userRole, index) => (<option key={index}>{userRole}</option>))}
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