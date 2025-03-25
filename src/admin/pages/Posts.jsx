import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { usePostsContext } from '../../hooks/usePostsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useToast } from '../../hooks/useToast'

// Icons
import { HiMagnifyingGlass, HiPlus, HiArrowPath } from "react-icons/hi2"
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardDoubleArrowRight,
    MdDashboard,
    MdArticle
} from "react-icons/md"

// Components
import AdminDrawer from "../components/AdminDrawer"
import AdminNavbar from "../components/AdminNavbar"
import CreatePostModal from "../../shared/components/CreatePostModal"
import PostItem from "./PostItem"

const Posts = () => {
    const toast = useToast()
    const { posts, dispatch } = usePostsContext()
    const { user } = useAuthContext()

    // States
    const [visible, setVisible] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [loading, setLoading] = useState(false)

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

    // Fetch posts data
    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:4000/admin/post?page=${currentPage}&limit=${limit}&search=${search}`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then((response) => {
                dispatch({ type: 'SET_POSTS', payload: response.data.posts || [] })
                setTotalPages(response.data.pages)
                setTotal(response.data.total)
            })
            .catch((error) => {
                console.log(error)
                toast('Failed to load posts', 'error')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [currentPage, limit, search, addRefresh, deleteRefresh, refreshKey])

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

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1); // Reset page to 1 on search change
        }, 500); // Wait 500ms before making the API call

        return () => clearTimeout(timeoutId);
    }, [search]);

    // Render pagination controls
    const renderPagination = () => (
        <div className="flex items-center gap-2 mt-4">
            <div className="join shadow-md rounded-lg overflow-hidden">
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    <MdOutlineKeyboardDoubleArrowLeft className="text-lg" />
                </button>
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <MdOutlineKeyboardArrowLeft className="text-lg" />
                </button>
                <div className="join-item px-3 bg-base-200 flex items-center font-medium">
                    {currentPage}/{totalPages}
                </div>
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <MdOutlineKeyboardArrowRight className="text-lg" />
                </button>
                <button
                    className="join-item btn btn-sm bg-base-200 hover:bg-base-300 border-0 text-primary"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
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

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setVisible(true)}
                                className="btn btn-primary btn-sm font-normal gap-1 transform transition hover:scale-105"
                            >
                                <HiPlus className="w-4 h-4" /> New Post
                            </button>
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
                                    {search ?
                                        `We couldn't find any posts matching "${search}"` :
                                        "There are no posts available at the moment."}
                                </p>
                                <button
                                    onClick={() => setVisible(true)}
                                    className="btn btn-primary gap-2"
                                >
                                    <HiPlus className="w-5 h-5" /> Create New Post
                                </button>
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
            </div>
        </AdminDrawer>
    )
}

export default Posts