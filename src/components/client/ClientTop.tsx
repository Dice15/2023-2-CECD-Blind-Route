import style from "./ClientTop.module.css"

export default function HomeTop() {
    return (
        <div className={style.homeTop}>
            <h1 className={style.homeTop__title}>{"Blind Route"}</h1>
        </div>
    )
}