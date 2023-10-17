import style from "./LoadingAnimation.module.css";



/** 로딩 애니메이션 컴포넌트 프로퍼티 */
export interface LoadingAnimationProps {
    active: boolean;
}



/** 로딩 애니메이션 컴포넌트 */
export default function LoadingAnimation({ active }: LoadingAnimationProps) {
    return (
        <div className={style.LoadingAnimation} style={{ visibility: `${active ? "visible" : "hidden"}` }}>
            <div className={style.loader}></div>
        </div>
    );
}
