import AdminDrawer from "../components/AdminDrawer"
import AdminNavbar from "../components/AdminNavbar"
import { FaUsers } from "react-icons/fa";
import { BsFillPostcardFill } from "react-icons/bs";
import { MdOutlineEvent } from "react-icons/md";
import { TiContacts } from "react-icons/ti";
import UserDTable from "../components/UserDTable";
import PostDTable from "../components/PostDTable";
import EventDTable from "../components/EventDTable";
import PieChartGender from "../components/PieChartGender";
import BarchartAge from "../components/BarChartAge";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";


const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [ageGroups, setAgeGroups] = useState({});
    const [dashboardData, setDashboardData] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)

        api.get('/admin/dashboard')
            .then((res) => {
                setDashboardData(res.data);
                // Set gender data for pie chart
                const genders = res.data.demographics?.gender || {};
                const genderLabels = Object.keys(genders);
                const genderCounts = Object.values(genders);

                if (genderLabels.length > 0) {
                    setChartData({
                        labels: genderLabels,
                        datasets: [
                            {
                                data: genderCounts,
                                backgroundColor: ["#035594", "#32cc32", "#808080"],
                            },
                        ],
                    });
                }
                // Set age groups data for bar chart
                setAgeGroups(res.data.demographics?.ageGroups || {});
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <AdminDrawer>
            <AdminNavbar />
            <div className="flex flex-col max-h-none p-10">
                {/* Stats Cards */}
                <div className="w-full">
                    <div className="w-full flex justify-evenly items-center gap-4 flex-wrap">
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Total Users</div>
                                <div className="stat-value text-6xl">{dashboardData.totalUsers}</div>
                                <div className="stat-desc text-lg"><span className="text-secondary">{dashboardData.totalActiveUsers}</span> Active | <span className="text-secondary">{dashboardData.totalInactiveUsers}</span> Inactive</div>
                                <div className="stat-figure text-secondary">
                                    <FaUsers size={50} />
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Total Posts</div>
                                <div className="stat-value text-6xl">{dashboardData.totalPosts}</div>
                                <div className="stat-desc text-lg"><span className="text-secondary">{dashboardData.totalActivePosts}</span> visible | <span className="text-secondary">{dashboardData.totalInactivePosts}</span> Hidden</div>
                                <div className="stat-figure text-secondary">
                                    <BsFillPostcardFill size={50} />
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Total Events</div>
                                <div className="stat-value text-6xl">{dashboardData.totalEvents}</div>
                                <div className="stat-desc text-lg"><span className="text-secondary">{dashboardData.doneEvents}</span> Done | <span className="text-secondary">{dashboardData.ongoingEvents}</span> On-going | <span className="text-secondary font-bold">{dashboardData.upcomingEvents}</span> Upcoming</div>
                                <div className="stat-figure text-secondary">
                                    <MdOutlineEvent size={50} />
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Total Contacts</div>
                                <div className="stat-value text-6xl">{dashboardData.totalHotlines}</div>
                                <div className="stat-figure text-secondary">
                                    <TiContacts size={50} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="w-full mt-10">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium text-gray-700">User Demographics</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-80">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                                    <p className="mt-4 text-gray-600">Loading demographic data...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="flex flex-col items-center">
                                    <h3 className="text-lg font-medium text-gray-600 mb-4">Gender Distribution</h3>
                                    <div className="chart-container flex items-center justify-center px-4" style={{ height: "350px", width: "100%" }}>
                                        {chartData ? (
                                            <PieChartGender data={chartData} />
                                        ) : (
                                            <div className="flex justify-center items-center h-full text-gray-400">
                                                No gender data available
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <h3 className="text-lg font-medium text-gray-600 mb-4">Age Distribution</h3>
                                    <div className="chart-container" style={{ height: "350px", width: "100%" }}>
                                        {Object.keys(ageGroups).length > 0 ? (
                                            <BarchartAge ageGroups={ageGroups} />
                                        ) : (
                                            <div className="flex justify-center items-center h-full text-gray-400">
                                                No age data available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* New Users Table */}
                <div className="w-full mt-10">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium text-gray-700">New Users</h2>
                            <button
                                className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
                                onClick={() => navigate('/admin/users')}
                            >
                                View All Users
                            </button>
                        </div>

                        <UserDTable users={dashboardData.recentUsers} loading={loading} />
                    </div>
                </div>

                {/* Recent Posts Table */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-700">Recent Posts</h2>
                        <button
                            className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
                            onClick={() => navigate('/admin/post')}
                        >
                            View All Posts
                        </button>
                    </div>

                    <PostDTable posts={dashboardData.recentPosts} loading={loading} characterLimit={80} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-700">Upcoming Events</h2>
                        <button className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
                            onClick={() => navigate('/admin/event')}>
                            View Calendar
                        </button>
                    </div>

                    <EventDTable events={dashboardData.upcomingFiveEvents} loading={loading} characterLimit={100} />
                </div>
            </div>
        </AdminDrawer>
    )
}

export default Dashboard