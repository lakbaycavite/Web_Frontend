import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Icons
import { FaUserFriends, FaChevronRight } from "react-icons/fa";
import { MdDashboard, MdEvent, MdFeedback, MdWavingHand } from "react-icons/md";
import { BsFillPostcardFill, BsStars } from "react-icons/bs";
import { RiContactsBook3Fill } from "react-icons/ri";
import { IoLogoOctocat } from "react-icons/io5";

const AdminDrawer = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [greeting, setGreeting] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    // Get current greeting based on time of day
    // useEffect(() => {
    //     const getGreeting = () => {
    //         const hour = new Date().getHours();
    //         if (hour < 12) return "Good Morning";
    //         if (hour < 18) return "Good Afternoon";
    //         return "Good Evening";
    //     };

    //     setGreeting(getGreeting());

    //     // Format current time
    //     const updateTime = () => {
    //         const now = new Date();
    //         const options = {
    //             weekday: 'long',
    //             hour: '2-digit',
    //             minute: '2-digit'
    //         };
    //         setCurrentTime(now.toLocaleDateString('en-US', options));
    //     };

    //     updateTime();
    //     const interval = setInterval(updateTime, 60000); // Update every minute

    //     return () => clearInterval(interval);
    // }, []);

    // Check if a menu item is active
    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    // Menu items data
    const menuItems = [
        { path: '/admin/dashboard', icon: <MdDashboard className="text-xl" />, label: 'Dashboard' },
        { path: '/admin/user', icon: <FaUserFriends className="text-xl" />, label: 'Users' },
        { path: '/admin/post', icon: <BsFillPostcardFill className="text-xl" />, label: 'Posts' },
        { path: '/admin/event', icon: <MdEvent className="text-xl" />, label: 'Events' },
        { path: '/admin/hotline', icon: <RiContactsBook3Fill className="text-xl" />, label: 'Hotlines' },
        { path: '/admin/feedback', icon: <MdFeedback className="text-xl" />, label: 'Feedbacks' },
    ];

    return (
        <div className="drawer lg:drawer-open max-h-none">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            {/* Page content */}
            <div className="drawer-content min-h-screen">
                {children}
            </div>

            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="bg-gradient-to-br from-[#033594] to-[#4286F4] text-base-content min-h-full w-80 shadow-xl overflow-hidden relative">
                    {/* Decorative elements */}
                    <div className="absolute top-40 right-0 w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
                    <div className="absolute bottom-20 left-0 w-40 h-40 bg-indigo-300 rounded-full opacity-10 blur-xl"></div>

                    {/* Header */}
                    <div className="px-6 pt-6 pb-8">
                        <Link
                            to='/home'
                            className="flex items-center gap-2 group"
                        >
                            <IoLogoOctocat className="text-white text-3xl group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 group-hover:from-blue-200 group-hover:to-white transition-all duration-300">
                                Lakbay Cavite
                            </span>
                        </Link>

                        {/* <div className="mt-5 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="flex items-center">
                                <MdWavingHand className="text-yellow-300 text-xl mr-2 animate-bounce" />
                                <h2 className="text-white font-medium">{greeting}!</h2>
                            </div>
                            <p className="text-xs text-blue-100 mt-1 opacity-80 flex items-center gap-1">
                                <BsStars className="text-yellow-200" /> {currentTime}
                            </p>
                        </div> */}
                    </div>

                    {/* Menu items */}
                    <div className="px-4">
                        <div className="text-sm text-blue-200 font-medium pl-3 mb-2 mt-2 flex items-center">
                            <span className="w-6 h-[2px] bg-blue-200 opacity-40 mr-2"></span>
                            MAIN MENU
                        </div>
                        <ul className="space-y-1.5">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`
                                            w-full flex items-center px-3 py-3 rounded-lg text-base font-medium
                                            transition-all duration-200 group relative overflow-hidden
                                            ${isActive(item.path)
                                                ? 'bg-white text-[#033594] shadow-md'
                                                : 'text-white hover:bg-white/20'}
                                        `}
                                    >
                                        {/* Background animation for hover */}
                                        <span className="absolute -left-full group-hover:left-0 top-0 w-full h-full bg-white/10 transition-all duration-500"></span>

                                        {/* Icon with animation */}
                                        <span className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-md mr-3 
                                            ${isActive(item.path)
                                                ? 'bg-blue-100 text-[#033594]'
                                                : 'bg-white/10 text-white'}
                                            group-hover:scale-110 transition-all duration-200
                                        `}>
                                            {item.icon}
                                        </span>

                                        {/* Label */}
                                        <span className="relative z-10 flex-grow">{item.label}</span>

                                        {/* Arrow indicator for active item */}
                                        {isActive(item.path) && (
                                            <FaChevronRight className="relative z-10 text-sm opacity-70" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer section */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                        <div className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm">
                            <p className="text-blue-100 text-xs">
                                © 2025 Lakbay Cavite
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDrawer;