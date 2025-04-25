import { useState, useEffect } from "react";
import moment from "moment"; // Assuming moment is available in your project
import AdminDrawer from "../components/AdminDrawer";
import AdminNavbar from "../components/AdminNavbar";
import { FaStar, FaEye, FaEyeSlash, FaReply, FaFilter, FaComment, FaComments } from "react-icons/fa";
import { HiMagnifyingGlass, HiArrowPath } from "react-icons/hi2";
import { MdOutlineFeedback } from "react-icons/md";
import FeedbackPDFGenerator from "../components/FeedbackPDFGenerator";

import { MdClose, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useToast } from "../../hooks/useToast";
import api from "../../lib/axios";
import { useAuthContext } from "../../hooks/useAuthContext";

const Feedbacks = () => {
    const { user } = useAuthContext();
    const toast = useToast();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [inputPage, setInputPage] = useState("");
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [adminResponse, setAdminResponse] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [filters, setFilters] = useState({
        rating: "",
        category: "",
    });
    const [adminUser, setAdminUser] = useState(null);

    // Categories - update these based on your actual categories
    const categories = ['UI/UX', 'Performance', 'Features', 'Bug', 'Content', 'All/Other'];

    // Statistics
    const [categoryCounts, setCategoryCounts] = useState({
        'UI/UX': 0,
        'Performance': 0,
        'Features': 0,
        'Bug': 0,
        'Content': 0,
        'All/Other': 0
    });

    // Rating stats 
    const [ratingCounts, setRatingCounts] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    });

    useEffect(() => {
        fetchFeedbacks();
    }, [currentPage, filters, limit, refreshTrigger]);

    // Calculate category counts
    useEffect(() => {
        if (Array.isArray(feedbacks) && feedbacks.length) {
            const catCounts = { 'UI/UX': 0, 'Performance': 0, 'Features': 0, 'Bug': 0, 'Content': 0, 'All/Other': 0 };
            const rateCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            feedbacks.forEach(feedback => {
                // Count categories
                if (catCounts[feedback.category] !== undefined) {
                    catCounts[feedback.category]++;
                } else {
                    catCounts['All/Other']++;
                }

                // Count ratings
                const rating = Number(feedback.rating);
                if (rateCounts[rating] !== undefined) {
                    rateCounts[rating]++;
                }
            });

            setCategoryCounts(catCounts);
            setRatingCounts(rateCounts);
        }
    }, [feedbacks]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const { rating, category } = filters;
            let query = `page=${currentPage}&limit=${limit}`;
            if (rating) query += `&rating=${rating}`;
            if (category) query += `&category=${category}`;

            const response = await api.get(`/admin/feedback?${query}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            if (Array.isArray(response.data)) {
                setFeedbacks(response.data);
            } else {
                if (response.data && Array.isArray(response.data.data)) {
                    setFeedbacks(response.data.data);
                    setAdminUser(response.data.adminUser || null);
                } else {
                    console.error("Unexpected API response format:", response.data);
                    setFeedbacks([]);
                    toast("Failed to parse feedback data", "error");
                }
            }

            const totalCount = parseInt(response.headers['x-total-count'] || '0') ||
                (response.data && response.data.total) ||
                (Array.isArray(response.data) ? response.data.length : 0);

            setTotal(totalCount);
            setTotalPages(Math.ceil(totalCount / limit) || 1);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            toast("Failed to fetch feedbacks", "error");
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.put(
                `/admin/feedback/toggle-status/${id}`,
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            setFeedbacks(currentFeedbacks =>
                currentFeedbacks.map(feedback =>
                    feedback._id === id
                        ? { ...feedback, isPublic: !feedback.isPublic }
                        : feedback
                )
            );

            toast("Feedback visibility updated", "success");
        } catch (error) {
            console.error("Error toggling status:", error);
            toast("Failed to update feedback visibility", "error");
        }
    };

    const handleOpenResponseModal = (feedback) => {
        setSelectedFeedback(feedback);
        setAdminResponse(feedback.adminResponse || "");
        setIsModalOpen(true);
    };

    const handleSubmitResponse = async () => {
        if (!selectedFeedback) return;
        console.log("Submitting response:", adminResponse);
        console.log('id:', selectedFeedback._id);
        try {
            await api.put(
                `/admin/feedback/update/${selectedFeedback._id}`,
                { adminResponse },
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            setFeedbacks(currentFeedbacks =>
                currentFeedbacks.map(feedback =>
                    feedback._id === selectedFeedback._id
                        ? { ...feedback, adminResponse }
                        : feedback
                )
            );

            setIsModalOpen(false);
            toast("Response submitted successfully", "success");
        } catch (error) {
            console.error("Error submitting response:", error);
            toast("Failed to submit response", "error");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ rating: "", category: "" });
        setCurrentPage(1);
    };

    // Render stars based on rating
    const renderRatingStars = (rating) => {
        return Array(5)
            .fill()
            .map((_, i) => (
                <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
            ));
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Get category icon color
    const getCategoryColor = (category) => {
        switch (category) {
            case 'UI/UX': return 'text-purple-500';
            case 'Performance': return 'text-blue-500';
            case 'Features': return 'text-green-500';
            case 'Bug': return 'text-red-500';
            case 'Content': return 'text-orange-500';
            default: return 'text-gray-500';
        }
    };

    // Render pagination controls
    const renderPagination = () => (
        <div className="flex items-center gap-2 mt-4">
            <div className="join shadow-md rounded-lg overflow-hidden">
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || loading}
                >
                    <MdOutlineKeyboardDoubleArrowLeft className="text-lg" />
                </button>
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                >
                    <MdOutlineKeyboardArrowLeft className="text-lg" />
                </button>
                <div className="join-item px-3 bg-base-200 flex items-center font-medium">
                    {currentPage}/{totalPages}
                </div>
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                >
                    <MdOutlineKeyboardArrowRight className="text-lg" />
                </button>
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || loading}
                >
                    <MdOutlineKeyboardDoubleArrowRight className="text-lg" />
                </button>
            </div>

            <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-medium">Go to:</span>
                <input
                    type="text"
                    className="input input-bordered input-sm w-16 focus:outline-primary"
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const page = Number(inputPage);
                            if (page >= 1 && page <= totalPages) {
                                setCurrentPage(page);
                                setInputPage('');
                            }
                        }
                    }}
                />

                <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm font-medium">Show:</span>
                    <select
                        className="select select-bordered select-sm focus:outline-primary"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="badge bg-primary text-white badge-md ml-2">
                    Total: {total}
                </div>
            </div>
        </div>
    );

    console.log("Feedbacks:", feedbacks);

    return (
        <AdminDrawer>
            <AdminNavbar />

            <div className="p-10 max-w-8xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <FaComments className="text-3xl text-primary mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">User Feedback Management</h1>
                    </div>

                    <div className="stats shadow bg-base-100">
                        <div className="stat place-items-center">
                            <div className="stat-title">Total Feedback</div>
                            <div className="stat-value text-primary">{total}</div>
                        </div>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Rating Stats */}
                    <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FaStar className="text-yellow-400" />
                            Rating Distribution
                        </h2>
                        <div className="grid grid-cols-5 gap-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="stat bg-base-50 p-2 rounded-lg">
                                    <div className="flex items-center gap-1">
                                        <div className="stat-value text-lg">{ratingCounts[rating]}</div>
                                        <div className="flex">
                                            {Array(rating).fill().map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400 text-xs" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="stat-desc">{rating} {rating === 1 ? 'Star' : 'Stars'}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Stats */}
                    <div className="bg-base-100 p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FaComment className="text-primary" />
                            Category Distribution
                        </h2>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(categoryCounts).map(([category, count]) => (
                                <div key={category} className="stat bg-base-50 p-2 rounded-lg">
                                    <div className={`stat-desc font-medium ${getCategoryColor(category)}`}>
                                        {category}
                                    </div>
                                    <div className="stat-value text-lg">{count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center mb-2">
                        <FaFilter className="text-gray-500 mr-2" />
                        <h2 className="text-lg font-semibold">Filters</h2>
                    </div>
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Rating</span>
                            </label>
                            <select
                                className="select select-bordered w-full max-w-xs focus:outline-primary"
                                name="rating"
                                value={filters.rating}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select
                                className="select select-bordered w-full max-w-xs focus:outline-primary"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="btn btn-outline"
                                onClick={clearFilters}
                                disabled={!filters.rating && !filters.category}
                            >
                                <FaFilter className="mr-1" /> Clear Filters
                            </button>

                            <button
                                onClick={() => setRefreshTrigger(prev => prev + 1)}
                                className="btn btn-info text-white font-normal gap-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        <HiArrowPath className="w-4 h-4" /> Refresh
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex-grow flex justify-end">
                            <FeedbackPDFGenerator
                                currentFeedbacks={feedbacks || []}
                                ratingCounts={ratingCounts}
                                categoryCounts={categoryCounts}
                                adminUser={adminUser}
                            />

                        </div>


                    </div>

                </div>

                {/* Table Container */}
                <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="w-full p-8">
                            <div className="flex flex-col items-center justify-center">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <p className="mt-4 text-gray-600">Loading feedback...</p>
                            </div>
                        </div>
                    ) : !Array.isArray(feedbacks) || feedbacks.length === 0 ? (
                        <div className="w-full p-16">
                            <div className="flex flex-col items-center justify-center">
                                <FaComments className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No feedback found</h3>
                                <p className="text-gray-500 mb-6 text-center max-w-md">
                                    {filters.rating || filters.category ?
                                        `We couldn't find any feedback matching your filters.` :
                                        "There are no feedback submissions available at the moment."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="w-1/6">User</th>
                                        <th className="w-1/4">Feedback</th>
                                        <th className="w-1/12">Category</th>
                                        <th className="w-1/12">Rating</th>
                                        <th className="w-1/12">Date</th>
                                        <th className="w-1/12">Status</th>
                                        {/* <th className="w-1/6 text-center">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(feedbacks) && feedbacks.map((feedback) => (
                                        <tr key={feedback._id}>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-10 h-10">
                                                            <img
                                                                src={feedback.user?.image || "https://via.placeholder.com/40"}
                                                                alt="User avatar"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://via.placeholder.com/40";
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">
                                                            {feedback.user?.firstName
                                                                ? `${feedback.user.firstName} ${feedback.user.lastName || ''}`
                                                                : feedback.user?.username || 'Unknown User'}
                                                        </div>
                                                        <div className="text-sm opacity-50">{feedback.user?.email || 'No email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="max-w-xs">
                                                    <div className="font-medium line-clamp-2">{feedback.comment}</div>
                                                    {/* {feedback.adminResponse && (
                                                        <div className="text-xs bg-blue-50 p-2 mt-1 rounded">
                                                            <span className="font-semibold">Your response:</span> {feedback.adminResponse}
                                                        </div>
                                                    )} */}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${getCategoryColor(feedback.category).replace('text-', 'bg-').replace('500', '100')} ${getCategoryColor(feedback.category)} border-0`}>
                                                    {feedback.category}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex">{renderRatingStars(feedback.rating)}</div>
                                            </td>
                                            <td>
                                                {feedback.createdAt
                                                    ? moment(feedback.createdAt).format('MMM D, h:mm A')
                                                    : 'Unknown date'}
                                            </td>
                                            <td>
                                                <span className={`badge ${feedback.isPublic ? 'badge-success' : 'badge-error'} text-white`}>
                                                    {feedback.isPublic ? 'Public' : 'Hidden'}
                                                </span>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination - Only show when we have feedbacks */}
                    {feedbacks && feedbacks.length > 0 && (
                        <div className="px-6 py-4 border-t border-base-300">
                            {renderPagination()}
                        </div>
                    )}
                </div>
            </div>

            {/* Response Modal */}
            {isModalOpen && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {/* <FaReply className="text-primary" /> */}
                                {/* Respond to Feedback */}
                                <MdOutlineFeedback className="text-primary" />
                                User FeedBack
                            </h3>
                            <button
                                className="btn btn-sm btn-circle"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <MdClose />
                            </button>
                        </div>

                        <div className="divider"></div>

                        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                            <div className="mb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-8 h-8">
                                            <img
                                                src={selectedFeedback.user?.image || "https://via.placeholder.com/32"}
                                                alt="User avatar"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/32";
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="font-semibold">
                                        {selectedFeedback.user?.firstName
                                            ? `${selectedFeedback.user.firstName} ${selectedFeedback.user.lastName || ''}`
                                            : selectedFeedback.user?.username || 'Unknown User'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        • {selectedFeedback.createdAt
                                            ? moment(selectedFeedback.createdAt).format('MMM D, h:mm A')
                                            : 'Unknown date'}
                                    </span>
                                </div>
                                <div className="flex mb-1">{renderRatingStars(selectedFeedback.rating)}</div>
                                <span className={`badge ${getCategoryColor(selectedFeedback.category).replace('text-', 'bg-').replace('500', '100')} ${getCategoryColor(selectedFeedback.category)} border-0 mb-2`}>
                                    {selectedFeedback.category}
                                </span>
                            </div>
                            <p className="text-gray-700">{selectedFeedback.comment}</p>
                        </div>

                        {/* <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Your Response</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-32 focus:outline-primary"
                                placeholder="Type your response here..."
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                className="btn btn-outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary gap-2"
                                onClick={handleSubmitResponse}
                                disabled={!adminResponse.trim()}
                            >
                                <FaReply className="w-4 h-4" /> Submit Response
                            </button>
                        </div> */}
                    </div>
                </div>
            )}
        </AdminDrawer>
    );
};

export default Feedbacks;