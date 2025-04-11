import { createContext } from "react";
import { Toaster, toast } from "sonner";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const showToast = (message, type = "info") => {
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "error":
                toast.error(message);
                break;
            case "info":
            default:
                toast.info(message);
                break;
        }
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toaster richColors expand={true} position="bottom-right" />
        </ToastContext.Provider>
    );
};

export default ToastContext;
