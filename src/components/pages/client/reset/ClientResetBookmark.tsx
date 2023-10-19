import style from "./ClientResetBookmark.module.css";
import { useCallback, useEffect, useState } from "react";
import { UserRole } from "../../../../cores/types/UserRole";
import LoadingAnimation from "../../common/loadingAnimation/LoadingAnimation";
import { SpeechOutputProvider } from "../../../../modules/speech/SpeechProviders";
import { useNavigate } from "react-router-dom";
import { clearBookmark } from "../../../../cores/api/blindrouteApi";



/** ClientClearBookmark 컴포넌트 프로퍼티 */
export interface ClientResetBookmarkProps {
    userRole: UserRole;
}



/** ClientClearBookmark 컴포넌트 */
export default function ClientResetBookmark({ userRole }: ClientResetBookmarkProps) {
    // Const
    const history = useNavigate();


    // States
    const [isLoading, setIsLoading] = useState(false);



    /** 즐겨찾기 초기화 */
    const resetBookmark = useCallback(async () => {
        setIsLoading(true);
        const isCleared = await clearBookmark(userRole);
        setIsLoading(false);
        return isCleared;
    }, [userRole, setIsLoading]);



    // Effects
    useEffect(() => {
        (async () => {
            if (await resetBookmark()) {
                SpeechOutputProvider.speak("즐겨찾기를 초기화 하였습니다");
            } else {
                SpeechOutputProvider.speak("즐겨찾기를 초기화 하는데 실패했습니다");
            }
            history(`/client`);
        })();
    }, [history, resetBookmark]);



    // Render
    return (
        <div className={style.ClientResetBookmark}>
            <LoadingAnimation active={isLoading} />
        </div>
    );
}