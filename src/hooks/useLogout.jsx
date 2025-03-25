import { useNavigate } from "react-router-dom"
import { useAuthContext } from "./useAuthContext"
import { useToast } from "./useToast"


const useLogout = () => {
    const toast = useToast()
    const navigate = useNavigate()
    const { dispatch } = useAuthContext()

    const logout = () => {

        localStorage.removeItem('user')

        dispatch({ type: 'LOGOUT' })
        navigate('/login')
        toast('Logged out successfully', 'info')
    }

    return { logout }
}

export default useLogout