import { useState } from "react";
import { UserRole } from "../../../cores/types/UserRole";
import style from "./ClientMiddle.module.css"
import { Route, Routes, useNavigate } from "react-router-dom";
import ClientActionForm from "./action/ClientActionForm";



/** ClientMiddle 컴포넌트 프로퍼티 */
export interface ClientMiddleProps {
    userRole: UserRole;
}


/** ClientMiddle 컴포넌트 */
export default function ClientMiddle({ userRole }: ClientMiddleProps) {
    // Consts
    const history = useNavigate();


    // States
    const [actionOption, setActionOption] = useState<"search" | "bookmark">("search");


    /** */
    const moveToAction = (action: "search" | "bookmark") => {
        setActionOption(action);
        history(`/client/action`);
    };


    // Render
    return (
        <div className={style.ClientMiddle}>
            <Routes>
                <Route path="/action" element={<ClientActionForm
                    userRole={userRole}
                    action={actionOption}
                />} />
            </Routes>
            <div className={style.selectAction}>
                <button type="button" onClick={() => { moveToAction("search"); }}>검색하기</button>
                <button type="button" onClick={() => { moveToAction("bookmark"); }}>즐겨찾기</button>
            </div>
        </div>
    );
}