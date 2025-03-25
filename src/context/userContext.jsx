import { useReducer } from "react";
import UsersContext from "./createUserContext";

const usersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                users: action.payload
            }
        case 'CREATE_USER':
            return {
                users: [action.payload, ...state.users]
            }
        case 'DELETE_USER':
            return {
                users: state.users.filter((u) => u._id !== action.payload._id)
            }
        case 'UPDATE_USER':
            return {
                users: state.usrs.map((u) =>
                    u._id === action.payload._id ? { ...u, ...action.payload } : u
                )
            }
        case 'TOGGLE_USER':
            return {
                users: state.users.map((u) =>
                    u._id === action.payload._id ? { ...u, isActive: !u.isActive } : u
                )
            }
    }
}

export const UsersContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(usersReducer, {
        users: []
    })

    return (
        <UsersContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UsersContext.Provider>
    )
}