import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"
import useLogout from "../../hooks/useLogout"

import { useToast } from "../../hooks/useToast"



const Navbar = () => {

    const navigate = useNavigate()

    const { user } = useAuthContext()
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="navbar bg-gradient-to-t from-[#033594] to-[#4286F4]">
            <div className="navbar-start text-white">
                <div className="dropdown text-white">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contacts">Contacts</Link></li>
                        {user && user.role === 'admin' && <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>}
                    </ul>
                </div>
                <Link to='/home' className="btn btn-ghost text-2xl font-bold text-white">Lakbay Cavite</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-white">
                    <li><Link to="/home">Home</Link></li>

                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contacts">Contacts</Link></li>
                    {user && user.role === 'admin' && <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>}
                </ul>
            </div>
            <div className="navbar-end">
                {!user ? (
                    <button onClick={() => navigate('/login')} className="btn text-primary">Sign in</button>
                ) : (
                    <button className="btn text-primary" onClick={handleLogout}>Logout</button>
                )}
            </div>
        </div>
    )
}

export default Navbar