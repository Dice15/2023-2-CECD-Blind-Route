import React, { useState } from "react";
import styles from "./Home.module.css"
import HomeLeft from "./HomeLeft";
import HomeTop from "./HomeTop";
import Station from "../../cores/types/Station";

export const StationListContext = React.createContext<Station[]>([]);
export const SetStationListContext = React.createContext<React.Dispatch<React.SetStateAction<Station[]>> | null>(null);

export const SelectedStationContext = React.createContext<Station | null>(null);
export const SetSelectedStationContext = React.createContext<React.Dispatch<React.SetStateAction<Station | null>> | null>(null);


export default function Home() {
    const [stationList, setStationList] = useState<Station[]>([]);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    return (
        <div className={styles.home}>
            <StationListContext.Provider value={stationList}>
                <SetStationListContext.Provider value={setStationList}>
                    <SelectedStationContext.Provider value={selectedStation}>
                        <SetSelectedStationContext.Provider value={setSelectedStation}>
                            <div className={styles.home__top}>
                                <HomeTop />
                            </div>
                            <div className={styles.home__middle}>
                                <div className={styles.home__left}><HomeLeft /></div>
                                <div className={styles.home__right}></div>
                            </div>
                        </SetSelectedStationContext.Provider>
                    </SelectedStationContext.Provider>
                </SetStationListContext.Provider>
            </StationListContext.Provider>
        </div>
    )
}