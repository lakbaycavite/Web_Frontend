import { useReducer, useEffect, useState } from "react"
import { jwtDecode } from 'jwt-decode'
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

        if (user?.token) {
            try {
                const decodedToken = jwtDecode(user.token)
                console.log('decodedToken: ', decodedToken)
                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem('user')
                    dispatch({ type: 'LOGOUT' })
                }
                else {
                    dispatch({ type: 'LOGIN', payload: user })
                }
            } catch (error) {
                console.error('Invalid token', error)
                localStorage.removeItem('user')
                dispatch({ type: 'LOGOUT' })
            }
        }

        // if (user) {
        //     dispatch({ type: 'LOGIN', payload: user })
        // }

        setIsLoading(false)

    }, [])

    console.log('AuthContext state: ', state)


    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {!isLoading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    )
}