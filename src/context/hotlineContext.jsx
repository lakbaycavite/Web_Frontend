import { useReducer } from "react"

import HotlineContext from "./createHotlineContext"



const hotlineReducer = (state, action) => {
    switch (action.type) {
        case 'SET_HOTLINES':
            return {
                ...state, // Preserve other state properties
                hotlines: Array.isArray(action.payload) ? action.payload : []
            }
        case 'CREATE_HOTLINE':
            return {
                hotlines: [action.payload, ...state.hotlines]
            }
        case 'DELETE_HOTLINE':
            return {
                hotlines: state.hotlines.filter((h) => h._id !== action.payload._id)
            }
        case 'UPDATE_HOTLINE':
            return {
                hotlines: state.hotlines.map((h) =>
                    h._id === action.payload._id ? { ...h, ...action.payload } : h
                )
            }
        default:
            return state
    }

}

export const HotlineContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(hotlineReducer, {
        hotlines: []
    })

    return (
        <HotlineContext.Provider value={{ ...state, dispatch }}>
            {children}
        </HotlineContext.Provider>
    )
}