import { useNavigate, Link } from "react-router-dom";

import { FaUserFriends } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BsFillPostcardFill } from "react-icons/bs";
import { MdEvent } from "react-icons/md";
import { RiContactsBook3Fill } from "react-icons/ri";


const AdminDrawer = ({ children }) => {

    const navigate = useNavigate()

    return (
        <div className="drawer lg:drawer-open max-h-none">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            {/* Page content here */}
            <div className="drawer-content min-h-screen">
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-gradient-to-t from-[#033594] to-[#4286F4] text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <Link to='/home' className="btn btn-ghost text-3xl font-bold text-gray-200 hover:bg-primary">Lakbay Cavite</Link>
                    <br />
                    <br />
                    <label className="text-md text-gray-400">Main</label>
                    <li><a className="text-lg text-white hover:bg-secondary hover:text-white" onClick={() => navigate('/admin/dashboard')}><MdDashboard />Dashboard</a></li>
                    <li><a className="text-lg text-white hover:bg-secondary hover:text-white" onClick={() => navigate('/admin/user')}><FaUserFriends /> Users</a></li>
                    <li><a className="text-lg text-white hover:bg-secondary hover:text-white" onClick={() => navigate('/admin/post')}><BsFillPostcardFill /> Posts</a></li>
                    <li><a className="text-lg text-white hover:bg-secondary hover:text-white" onClick={() => navigate('/admin/event')}><MdEvent /> Events</a></li>
                    <li><a className="text-lg text-white hover:bg-secondary hover:text-white" onClick={() => navigate('/admin/hotline')}><RiContactsBook3Fill /> Hotlines</a></li>

                    <br />

                </ul>
            </div>
        </div>
    )
}

export default AdminDrawer