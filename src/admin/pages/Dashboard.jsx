import AdminDrawer from "../components/AdminDrawer"
import AdminNavbar from "../components/AdminNavbar"
import { FaUsers } from "react-icons/fa";
import { BsFillPostcardFill } from "react-icons/bs";
import { MdOutlineEvent, MdCalendarToday, MdFilterAlt } from "react-icons/md";
import { TiContacts } from "react-icons/ti";
import UserDTable from "../components/UserDTable";
import PostDTable from "../components/PostDTable";
import EventDTable from "../components/EventDTable";
import PieChartGender from "../components/PieChartGender";
import BarchartAge from "../components/BarChartAge";

import DashboardAnalyticsPDFGenerator from "../components/DashboardAnalyticsPDFGenerator";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import FeedbackDTable from "../components/FeedbackDTable";
import FeedbackAnalyticsChart from "../components/FeedbackAnalyticsChart";


const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [ageGroups, setAgeGroups] = useState({});
    const [dashboardData, setDashboardData] = useState([]);
    const [feedbackAnalytics, setFeedbackAnalytics] = useState(null);

    // Date range filter states
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const navigate = useNavigate()

    // Check if any filter is active
    const isFilterActive = () => {
        return startDate || endDate;
    };

    // Clear all filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        setLoading(true)

        let queryString = '';

        // Add date filters if they exist
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) {
            // If the dates are the same, modify the endDate to include the full day
            if (startDate === endDate) {
                const endDateObj = new Date(endDate);
                endDateObj.setHours(23, 59, 59, 999);
                queryString += `endDate=${endDateObj.toISOString()}&`;
            } else {
                queryString += `endDate=${endDate}&`;
            }
        }

        // Remove trailing & if present
        if (queryString.endsWith('&')) {
            queryString = queryString.slice(0, -1);
        }

        // Add ? prefix if query string exists
        if (queryString) {
            queryString = `?${queryString}`;
        }

        api.get(`/admin/dashboard${queryString}`)
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

                // Set feedback analytics data
                setFeedbackAnalytics(res.data.feedbackAnalytics);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false)
            })
    }, [startDate, endDate, refreshTrigger])

    console.log(dashboardData)

    return (
        <AdminDrawer>
            <AdminNavbar />
            <div className="flex flex-col max-h-none p-10">
                {/* Date Filter Section */}
                <div className="w-full mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            <h2 className="text-xl font-medium text-gray-700 flex items-center gap-2">
                                <MdCalendarToday className="text-primary" />
                                Dashboard Analytics
                            </h2>

                            <div className="flex gap-2">
                                {/* Date Filter Toggle Button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`btn btn-sm ${showFilters ? 'bg-primary hover:bg-primary/80' : 'bg-secondary hover:bg-secondary/80'} font-normal gap-1 text-white`}
                                >
                                    <MdCalendarToday className="w-4 h-4" />
                                    {showFilters ? "Hide Filters" : "Date Filters"}
                                </button>

                                {/* Clear Filters Button */}
                                {isFilterActive() && (
                                    <button
                                        onClick={clearFilters}
                                        className="btn btn-outline btn-sm font-normal gap-1"
                                    >
                                        <MdFilterAlt className="w-4 h-4" /> Clear Filters
                                    </button>
                                )}

                                {/* PDF Export Button */}
                                {!loading && (
                                    <DashboardAnalyticsPDFGenerator
                                        dashboardData={dashboardData}
                                        chartData={chartData}
                                        ageGroups={ageGroups}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Date Range Filters */}
                        {showFilters && (
                            <div className="mt-4 p-3 bg-base-200 rounded-lg">
                                <div className="flex flex-wrap gap-4 items-end">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Start Date</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="input input-bordered w-full max-w-xs focus:outline-primary"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">End Date</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="input input-bordered w-full max-w-xs focus:outline-primary"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            min={startDate}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        {isFilterActive() && (
                                            <div className="badge badge-info text-white">
                                                {startDate && !endDate && `Showing data from ${new Date(startDate).toLocaleDateString()} onwards`}
                                                {!startDate && endDate && `Showing data until ${new Date(endDate).toLocaleDateString()}`}
                                                {startDate && endDate && `Date range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="w-full">
                    <div className="w-full flex justify-evenly items-center gap-4 flex-wrap">
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Users</div>
                                <div className="stat-value text-3xl">{dashboardData.totalUsers}</div>
                                <div className="stat-desc text-md"><span className="text-secondary">{dashboardData.totalActiveUsers}</span> Active | <span className="text-secondary">{dashboardData.totalInactiveUsers}</span> Inactive</div>
                                <div className="stat-figure text-secondary">
                                    <FaUsers size={40} />
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Posts</div>
                                <div className="stat-value text-3xl">{dashboardData.totalPosts}</div>
                                <div className="stat-desc text-md"><span className="text-secondary">{dashboardData.totalActivePosts}</span> visible | <span className="text-secondary">{dashboardData.totalInactivePosts}</span> Hidden</div>
                                <div className="stat-figure text-secondary">
                                    <BsFillPostcardFill size={40} />
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Events</div>
                                <div className="stat-value text-3xl">{dashboardData.totalEvents}</div>
                                <div className="stat-desc text-md"><span className="text-secondary">{dashboardData.doneEvents}</span> Done | <span className="text-secondary">{dashboardData.ongoingEvents}</span> On-going | <span className="text-secondary font-bold">{dashboardData.upcomingEvents}</span> Upcoming</div>
                                <div className="stat-figure text-secondary">
                                    <MdOutlineEvent size={40} />
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Hotlines</div>
                                <div className="stat-value text-3xl">{dashboardData.totalHotlines}</div>
                                <div className="stat-figure text-secondary">
                                    <TiContacts size={40} />
                                </div>
                            </div>
                        </div>
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title text-xl">Feedbacks</div>
                                <div className="stat-value text-3xl">{dashboardData.totalFeedbacks}</div>
                                <div className="stat-desc text-md">Average Rating: <span className="text-secondary">  {dashboardData?.feedbackAnalytics?.averageRating ?? 'N/A'}
                                </span></div>
                                {/* {console.log(dashboardData.feedbackAnalytics.averageRating)} */}
                                <div className="stat-figure text-secondary">
                                    <TiContacts size={40} />
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

                <div className="w-full mt-10">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium text-gray-700">Feedback Analytics</h2>
                        </div>

                        {/* This is where the Component is placed */}
                        <FeedbackAnalyticsChart feedbackAnalytics={feedbackAnalytics} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-700">Recent Feedbacks</h2>
                        <button
                            className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
                            onClick={() => navigate('/admin/feedback')}
                        >
                            View All Feedbacks
                        </button>
                    </div>

                    <FeedbackDTable posts={dashboardData.tenRecentFeedbacks} loading={loading} characterLimit={80} />
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