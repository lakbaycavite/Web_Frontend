import HotlineContext from "../context/createHotlineContext";
import { useContext } from "react";

export const useHotlineContext = () => {
    const context = useContext(HotlineContext)

    if (!context) {
        throw Error('useHotlineContext must be used inside an HotlineContextProvider')
    }

    return context
}