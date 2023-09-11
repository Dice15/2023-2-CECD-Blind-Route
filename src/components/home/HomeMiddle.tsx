import { useContext } from "react";
import style from "./HomeMiddle.module.css"
import StationTable from "./StationTable";
import { BusListContext, SetBusListContext } from "./Home";
import { useModal } from "../modal/Modal";
import { ModalAnimationType } from "../modal/ModalAnimations";
import BusTable from "./BusTable";

export default function HomeMiddle() {
    return (
        <div className={style.HomeMiddle}>
            <StationTable />
        </div>
    );
}

//    