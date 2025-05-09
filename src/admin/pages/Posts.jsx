import { useEffect, useRef, useState } from 'react'
import { usePostsContext } from '../../hooks/usePostsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useToast } from '../../hooks/useToast'
import PostPDFGenerator from '../components/PostPDFGenerator'

// Icons
import { HiMagnifyingGlass, HiPlus, HiArrowPath } from "react-icons/hi2"
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardDoubleArrowRight,
    MdDashboard,
    MdArticle,
    MdCalendarToday,
    MdFilterAlt
} from "react-icons/md"

// Components
import AdminDrawer from "../components/AdminDrawer"
import AdminNavbar from "../components/AdminNavbar"
import CreatePostModal from "../../shared/components/CreatePostModal"
import PostItem from "./PostItem"
import PostDisplayModal from "../components/PostDisplayModal" // Import the PostDisplayModal
import api from '../../lib/axios'

const Posts = () => {
    const toast = useToast()
    const { posts, dispatch } = usePostsContext()
    const { user } = useAuthContext()

    // States
    const [visible, setVisible] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [loading, setLoading] = useState(false)

    // Post display modal states
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [showPostModal, setShowPostModal] = useState(false)

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [inputPage, setInputPage] = useState('')

    // Filter and refresh states
    const [addRefresh, setAddRefresh] = useState(false)
    const [deleteRefresh, setDeleteRefresh] = useState(false)
    const [search, setSearch] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)

    // Date range filter states
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    const [adminUser, setAdminUser] = useState(null)

    // Fetch posts data
    useEffect(() => {
        setLoading(true)
        let queryString = `page=${currentPage}&limit=${limit}&search=${search}`;

        // Add date filters if they exist
        if (startDate) queryString += `&startDate=${startDate}`;
        if (endDate) {
            // If the dates are the same, modify the endDate to include the full day
            if (startDate === endDate) {
                // Create a date object for the end date and set it to the end of the day
                const endDateObj = new Date(endDate);
                endDateObj.setHours(23, 59, 59, 999);
                queryString += `&endDate=${endDateObj.toISOString()}`;
            } else {
                queryString += `&endDate=${endDate}`;
            }
        }

        api.get(`/admin/post?${queryString}`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then((response) => {
                dispatch({ type: 'SET_POSTS', payload: response.data.posts || [] })
                setTotalPages(response.data.pages)
                setTotal(response.data.total)
                setAdminUser(response.data.adminUser)

            })
            .catch((error) => {
                console.log(error)
                toast('Failed to load posts', 'error')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [currentPage, limit, search, addRefresh, deleteRefresh, refreshKey, startDate, endDate])

    // Event handlers
    const handleEventAdded = () => {
        setAddRefresh(prev => !prev);
    };

    const handleEventDelete = () => {
        setDeleteRefresh(prev => !prev);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const onClose = () => {
        setVisible(false)
    }

    const onSuccess = () => {
        toast('Post created successfully.', "success")
        setVisible(false)
    }

    // Handler for opening the post display modal
    const handleViewPost = (postId) => {
        setSelectedPostId(postId);
        setShowPostModal(true);
    };

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1); // Reset page to 1 on search change
        }, 500); // Wait 500ms before making the API call

        return () => clearTimeout(timeoutId);
    }, [search]);

    // Clear all filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSearch('');
        setCurrentPage(1);
    };

    // Check if any filter is active
    const isFilterActive = () => {
        return search || startDate || endDate;
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

                <div className="badge badge-primary badge-md ml-2">
                    Total: {total}
                </div>
            </div>
        </div>
    );

    return (
        <AdminDrawer>
            <AdminNavbar />

            <div className="p-10 max-w-8xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <MdArticle className="text-3xl text-primary mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">Posts Management</h1>
                    </div>
                    <div className="stats shadow bg-base-100">
                        <div className="stat place-items-center">
                            <div className="stat-title">Total Posts</div>
                            <div className="stat-value text-primary">{total}</div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <HiMagnifyingGlass className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10 pr-4 py-2 focus:outline-primary"
                                placeholder="Search posts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                                <span className="text-sm text-gray-600">Activated</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                                <span className="text-sm text-gray-600">Deactivated</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
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

                            {/* PDF Generator */}
                            <PostPDFGenerator currentPosts={posts} adminUser={adminUser} />

                            {/* Refresh Button */}
                            <button
                                onClick={() => setRefreshKey(prev => prev + 1)}
                                className="btn btn-info btn-sm text-white font-normal gap-1 transform transition hover:scale-105"
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
                                    {startDate && !endDate && (
                                        <div className="badge bg-secondary text-white">
                                            Showing posts from {new Date(startDate).toLocaleDateString()} onwards
                                        </div>
                                    )}
                                    {!startDate && endDate && (
                                        <div className="badge badge-info text-white">
                                            Showing posts until {new Date(endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                    {startDate && endDate && (
                                        <div className="badge badge-info text-white">
                                            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table Container */}
                <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                    {loading && posts.length === 0 ? (
                        <div className="w-full p-8">
                            <div className="flex flex-col items-center justify-center">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <p className="mt-4 text-gray-600">Loading posts...</p>
                            </div>
                        </div>
                    ) : posts && posts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="w-12"></th>
                                        <th className="w-2/5">Content</th>
                                        <th className="w-1/5">Author</th>
                                        <th className="w-1/5">Date Created</th>
                                        <th className="w-1/5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((item, index) => (
                                        <tr key={index} className="hover:bg-base-200 transition-colors duration-150">
                                            <PostItem
                                                index={index}
                                                pid={item._id}
                                                title={item.title}
                                                content={item.content}
                                                profileName={item.user?.username}
                                                image={item.image}
                                                created={item.createdAt}
                                                is_hidden={item.is_hidden}
                                                handleEventDelete={handleEventDelete}
                                                onViewClick={() => handleViewPost(item._id)} // Add this prop
                                            />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="w-full p-16">
                            <div className="flex flex-col items-center justify-center">
                                <MdDashboard className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                                <p className="text-gray-500 mb-6 text-center max-w-md">
                                    {isFilterActive() ?
                                        `We couldn't find any posts matching your filters` :
                                        "There are no posts available at the moment."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Pagination - Only show when we have posts */}
                    {posts && posts.length > 0 && (
                        <div className="px-6 py-4 border-t border-base-300">
                            {renderPagination()}
                        </div>
                    )}
                </div>

                {/* Create Post Modal */}
                <CreatePostModal
                    Pvisible={visible}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    handleEventAdded={handleEventAdded}
                />

                {/* Post Display Modal */}
                <PostDisplayModal
                    postId={selectedPostId}
                    show={showPostModal}
                    onClose={() => setShowPostModal(false)}
                    onPostUpdate={handleEventDelete}
                />
            </div>
        </AdminDrawer>
    )
}

export default Posts