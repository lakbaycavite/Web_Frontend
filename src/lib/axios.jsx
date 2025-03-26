import axios from "axios";


const api = axios.create({
    // baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000",
    baseURL: import.meta.env.VITE_API_URL,
})

export default api