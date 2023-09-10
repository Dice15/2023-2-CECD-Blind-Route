import React, { useState } from "react";
import styles from "./Home.module.css"
import HomeLeft from "./HomeLeft";
import HomeTop from "./HomeTop";
import Station from "../../cores/types/Station";

export const StationListContext = React.createContext<Station[]>([]);
export const SetStationListContext = React.createContext<React.Dispatch<React.SetStateAction<Station[]>> | null>(null);

export default function Home() {
    const [stationList, setStationList] = useState<Station[]>([]);

    return (
        <div className={styles.home}>
            <StationListContext.Provider value={stationList}>
                <SetStationListContext.Provider value={setStationList}>
                    <div className={styles.home__top}>
                        <HomeTop />
                    </div>
                    <div className={styles.home__middle}>
                        <div className={styles.home__left}><HomeLeft /></div>
                        <div className={styles.home__right}></div>
                    </div>
                </SetStationListContext.Provider>
            </StationListContext.Provider>
        </div>
    )
}