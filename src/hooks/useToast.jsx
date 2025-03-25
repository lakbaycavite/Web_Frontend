import { useContext } from "react";
import ToastContext from "../context/ToastContext";// Import from the new file

export const useToast = () => {
    return useContext(ToastContext);
};