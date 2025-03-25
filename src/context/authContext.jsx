import { useReducer, useEffect, useState } from "react"
import AuthContext from "./createAuthContext"

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }

        setIsLoading(false)
    }, [])

    console.log('AuthContext state: ', state)


    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {!isLoading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    )
}