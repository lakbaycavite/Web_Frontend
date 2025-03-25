import { useReducer } from "react";
import EventsContext from "./createEventContext";

const eventsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EVENTS':
            return {
                events: action.payload
            }
        case 'CREATE_EVENT':
            return {
                events: [action.payload, ...state.events]
            }
        case 'DELETE_EVENT':
            return {
                events: state.events.filter((e) => e._id !== action.payload._id)
            }
        case 'UPDATE_EVENT':
            return {
                events: state.events.map((e) =>
                    e._id === action.payload._id ? { ...e, ...action.payload } : e
                )
            }
        default:
            return state
    }
}

export const EventsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(eventsReducer, {
        events: null
    })

    return (
        <EventsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </EventsContext.Provider>
    )
}