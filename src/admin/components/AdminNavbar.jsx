import { useLocation } from "react-router-dom"
import { matchPath } from "react-router-dom"
import useLogout from "../../hooks/useLogout"
import { useToast } from "../../hooks/useToast"

const AdminNavbar = () => {

    const location = useLocation()
    const { logout } = useLogout()
    const toast = useToast()

    const getTitle = () => {
        if (location.pathname === '/admin/post') {
            return 'Posts';
        } else if (location.pathname === '/admin/event') {
            return 'Events & Announcements';
        } else if (location.pathname === '/admin/hotline') {
            return 'Hotlines';
        }
        else if (location.pathname === '/admin/dashboard') {
            return 'Dashboard';
        }
        else if (location.pathname === '/admin/user') {
            return 'Users';
        } else if (matchPath('/user/display/:id', location.pathname)) {
            return 'Users';
        }
        else {
            return 'Default Title'; // Fallback title
        }

    }

    const handleLogout = async () => {
        logout()
        // toast("Logged out successfully", "info")
    }

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">{getTitle()}</a>
            </div>
            <div className="navbar-end">
                <button className="btn bg-secondary hover:bg-green-600 text-white" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default AdminNavbar