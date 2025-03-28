import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const api = axios.create({
    // baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000",
    baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            const { dispatch } = useAuthContext()
            dispatch({ type: 'LOGOUT' })
            localStorage.removeItem('user')
        }
        return Promise.reject(error)
    }
)

export default api