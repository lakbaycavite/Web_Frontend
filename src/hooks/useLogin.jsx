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
    const { dispatch } = useAuthContext()

    const login = async (identifier, password) => {
        setIsLoading(true)
        setError(null)

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

            setIsLoading(false)

            if (userData.role == 'admin') {
                navigate('/admin/user')
                toast('Login successful', 'success')
            }
            else {
                navigate('/home')
                toast('Login successful', 'success')
            }

        } catch (error) {
            setError(error.response?.data?.error || "An unexpected error occurred");
            toast("Invalid email or password", "error")
        }
        finally {
            setIsLoading(false)
        }
    }

    return { login, error, isLoading }
}

export default useLogin