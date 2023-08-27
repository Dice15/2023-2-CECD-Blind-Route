import styles from "./Home.module.css"
import HomeTop from "./HomeTop";

export default function Home() {
    return (
        <div className={styles.home}>
            <div className={styles.home_top}>
                <HomeTop />
            </div>

        </div>
    )
}