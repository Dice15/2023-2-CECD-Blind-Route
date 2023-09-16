import React, { useState } from "react";
import styles from "./Client.module.css"
import ClientMiddle from "./ClientMiddle";
import ClientTop from "./ClientTop";
import Station from "../../cores/types/Station";
import Bus from "../../cores/types/Bus";
import { UserRole } from "../../cores/types/UserRole";

export const StationListContext = React.createContext<Station[]>([]);
export const SetStationListContext = React.createContext<React.Dispatch<React.SetStateAction<Station[]>> | null>(null);

export const BusListContext = React.createContext<Bus[]>([]);
export const SetBusListContext = React.createContext<React.Dispatch<React.SetStateAction<Bus[]>> | null>(null);

export const SelectedStationContext = React.createContext<Station | null>(null);
export const SetSelectedStationContext = React.createContext<React.Dispatch<React.SetStateAction<Station | null>> | null>(null);


export interface ClientProps {
    userRole: UserRole;
}

export default function Client({ userRole }: ClientProps) {
    const [stationList, setStationList] = useState<Station[]>([]);
    const [BusList, setBusList] = useState<Bus[]>([]);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    return (
        <div className={styles.home}>
            <StationListContext.Provider value={stationList}>
                <SetStationListContext.Provider value={setStationList}>
                    <BusListContext.Provider value={BusList}>
                        <SetBusListContext.Provider value={setBusList}>
                            <SelectedStationContext.Provider value={selectedStation}>
                                <SetSelectedStationContext.Provider value={setSelectedStation}>
                                    <div className={styles.home__top}>
                                        <ClientTop userRole={userRole} />
                                    </div>
                                    <div className={styles.home__middle}>
                                        <ClientMiddle userRole={userRole} />
                                    </div>
                                </SetSelectedStationContext.Provider>
                            </SelectedStationContext.Provider>
                        </SetBusListContext.Provider>
                    </BusListContext.Provider>
                </SetStationListContext.Provider>
            </StationListContext.Provider>
        </div>
    )
}