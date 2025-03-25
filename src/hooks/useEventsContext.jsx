import { useContext } from "react";
import EventsContext from "../context/createEventContext";

export const useEventsContext = () => {
    const context = useContext(EventsContext)

    if (!context) {
        throw Error('useEventsContext must be used inside an EventsContextProvider')
    }

    return context
}