import { useEffect, useState } from "react"
import { useUsersContext } from '../../hooks/useUsersContext'
import { useAuthContext } from "../../hooks/useAuthContext"

// Components
import AdminDrawer from "../components/AdminDrawer"
import AdminNavbar from "../components/AdminNavbar"
import UsersTable from "../components/UsersTable"
import UserPDFGenerator from "../components/UserPDFGenerator"

// Icons
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardDoubleArrowRight,
    MdPerson,
    MdRefresh
} from "react-icons/md"
import { HiMagnifyingGlass } from "react-icons/hi2"
import { FaUserCheck, FaUserTimes } from "react-icons/fa"
import api from "../../lib/axios"

const Users = () => {
    const { user } = useAuthContext()
    const { users, dispatch } = useUsersContext()

    // States
    const [loading, setLoading] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [inputPage, setInputPage] = useState('')
    const [search, setSearch] = useState('')

    // User statistics
    const [totalActiveUsers, setTotalActiveUsers] = useState(0)
    const [totalInactiveUsers, setTotalInactiveUsers] = useState(0)

    // Fetch users data with search and pagination
    useEffect(() => {
        fetchUsers()
    }, [currentPage, limit, search, refreshKey])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await api.get(
                `/admin/user?page=${currentPage}&limit=${limit}&search=${search}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            )

            dispatch({ type: 'SET_USERS', payload: response.data.users || [] })
            setTotalPages(response.data.pages)
            setTotal(response.data.total)
            setTotalActiveUsers(response.data.totalActiveUsers)
            setTotalInactiveUsers(response.data.totalInactiveUsers)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1) // Reset to first page when search changes
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [search])

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

                <div className="badge bg-primary text-white badge-md ml-2">
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
                        <MdPerson className="text-3xl text-primary mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    </div>

                    <div className="stats shadow bg-base-100">
                        <div className="stat place-items-center">
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value text-primary">{total}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title flex items-center gap-1">
                                <FaUserCheck className="text-secondary" /> Active
                            </div>
                            <div className="stat-value text-secondary">{totalActiveUsers}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title flex items-center gap-1">
                                <FaUserTimes className="text-error" /> Inactive
                            </div>
                            <div className="stat-value text-error">{totalInactiveUsers}</div>
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
                                placeholder="Search users by name, email or username..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Legend */}
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

                        {/* Stats Badges - For smaller screens, replicated for responsive design */}
                        <div className="flex md:hidden gap-2">
                            <div className="badge badge-lg badge-secondary gap-1">
                                <FaUserCheck /> {totalActiveUsers} active
                            </div>
                            <div className="badge badge-lg badge-error gap-1">
                                <FaUserTimes /> {totalInactiveUsers} inactive
                            </div>
                        </div>

                        {/* Refresh Button */}
                        <div className="flex gap-2">
                            {/* PDF Export Button */}
                            <UserPDFGenerator
                                currentUsers={users}
                                totalActiveUsers={totalActiveUsers}
                                totalInactiveUsers={totalInactiveUsers}
                            />

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
                                        <MdRefresh className="w-5 h-5" /> Refresh
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                    {loading && users.length === 0 ? (
                        <div className="w-full p-8">
                            <div className="flex flex-col items-center justify-center">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <p className="mt-4 text-gray-600">Loading users...</p>
                            </div>
                        </div>
                    ) : users && users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="w-12"></th>
                                        <th className="w-2/5">User</th>
                                        <th className="w-1/5">Name</th>
                                        <th className="w-1/5">Registration Date</th>
                                        <th className="w-1/5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((userData, index) => (
                                        <UsersTable
                                            key={index}
                                            {...userData}
                                            loading={loading}
                                            fetchUsers={fetchUsers}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="w-full p-16">
                            <div className="flex flex-col items-center justify-center">
                                <MdPerson className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
                                <p className="text-gray-500 mb-6 text-center max-w-md">
                                    {search ?
                                        `We couldn't find any users matching "${search}"` :
                                        "There are no users available at the moment."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Pagination - Only show when we have users */}
                    {users && users.length > 0 && (
                        <div className="px-6 py-4 border-t border-base-300">
                            {renderPagination()}
                        </div>
                    )}
                </div>
            </div>
        </AdminDrawer>
    )
}

export default Users