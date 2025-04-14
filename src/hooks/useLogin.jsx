import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from './useToast'
import api from '../lib/axios'

const useLogin = () => {
    const toast = useToast()
    const navigate = useNavigate()

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [deactivationInfo, setDeactivationInfo] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (identifier, password, showSuccessToast = true) => {
        setIsLoading(true)
        setError(null)
        setDeactivationInfo(null)

        const loginUser = {
            identifier,
            password
        }

        console.log('Sending request...')

        try {
            const response = await api.post('/admin/user/login', loginUser)
            const userData = response.data

            localStorage.setItem('user', JSON.stringify(userData))

            dispatch({ type: 'LOGIN', payload: userData })

            if (showSuccessToast) {
                toast(`Login successful! Welcome back. ${userData.firstName ? userData.firstName : userData.username}`, "success")
            }

            if (userData.role === 'admin') {
                navigate('/admin/user')
            }
            else {
                navigate('/home')
            }

            return { success: true }

        } catch (error) {
            setError(error.response?.data?.error || "An unexpected error occurred");

            // Check if this is a deactivation error
            if (error.response?.status === 403 && error.response?.data?.error?.includes('deactivated')) {
                setDeactivationInfo({
                    reason: error.response?.data?.deactivationReason || null,
                    deactivatedAt: error.response?.data?.deactivatedAt || null,
                    message: error.response?.data?.error
                });

                // Don't show the generic toast for deactivation
                return { success: false, isDeactivated: true, deactivationInfo: deactivationInfo };
            } else {
                toast("Invalid email or password", "error");
            }

            return { success: false, isDeactivated: false };
        }
        finally {
            setIsLoading(false)
        }
    }

    return { login, error, isLoading, deactivationInfo }
}

export default useLogin