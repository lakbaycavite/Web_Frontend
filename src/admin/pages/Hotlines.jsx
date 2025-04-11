import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useHotlineContext } from "../../hooks/useHotlineContext";
import { useToast } from "../../hooks/useToast";

// Components
import AdminDrawer from "../components/AdminDrawer";
import AdminNavbar from "../components/AdminNavbar";
import HotlineItems from "../components/HotlineItems";

// Icons
import { HiMagnifyingGlass, HiPlus, HiPhone, HiArrowPath } from "react-icons/hi2";
import { FaPhoneAlt, FaFire, FaAmbulance, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardDoubleArrowRight,
    MdLocationOn
} from "react-icons/md";
import api from "../../lib/axios";

const Hotlines = () => {
    const navigate = useNavigate();
    const { hotlines, dispatch } = useHotlineContext();
    const toast = useToast();
    const { user } = useAuthContext();

    // States
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [inputPage, setInputPage] = useState("");

    // Filter states
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");

    // Categories
    const categories = ['Fire', 'Police', 'Ambulance/ Medical', 'Disaster Response', 'Others'];

    // Statistics
    const [categoryCounts, setCategoryCounts] = useState({
        Fire: 0,
        Police: 0,
        'Ambulance/ Medical': 0,
        'Disaster Response': 0,
        Others: 0
    });

    // Get category counts from hotlines data
    useEffect(() => {
        if (hotlines && hotlines.length) {
            const counts = { Fire: 0, Police: 0, 'Ambulance/ Medical': 0, 'Disaster Response': 0, Others: 0 };
            hotlines.forEach(hotline => {
                if (counts[hotline.category] !== undefined) {
                    counts[hotline.category]++;
                } else {
                    counts['Others']++;
                }
            });
            setCategoryCounts(counts);
        }
    }, [hotlines]);

    // Fetch hotlines data
    useEffect(() => {
        const fetchHotlines = async () => {
            setLoading(true);
            try {
                const categoryParam = categoryFilter ? `&category=${categoryFilter}` : '';
                // const requestUrl = `http://localhost:4000/admin/hotline?page=${currentPage}&limit=${limit}&search=${search}${categoryParam}`;

                const response = await api.get(`/admin/hotline?page=${currentPage}&limit=${limit}&search=${search}${categoryParam}`, {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                });

                dispatch({ type: "SET_HOTLINES", payload: response.data.hotlines || [] });
                setTotal(response.data.total);
                setTotalPages(response.data.pages);
            } catch (error) {
                console.error("Error fetching hotlines:", error);
                toast("Failed to load hotlines", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchHotlines();
    }, [currentPage, limit, search, categoryFilter, dispatch, refreshTrigger, user.token]);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Handle number input validation
    const handleNumberChange = (e) => {
        const value = e.target.value;

        if (value === '' || (/^[0-9()-]+$/.test(value) && value.length <= 15)) {
            setNumber(value);
            setError("");
        } else if (value.length > 15) {
            setError("Maximum 15 characters allowed");
        } else {
            setError("Please enter only numbers, hyphens, and parentheses");
        }
    };

    // Submit new hotline
    const handleSubmit = async () => {
        setModalLoading(true);
        try {
            const data = { name, number, location, category };

            const response = await api.post("/admin/hotline", data, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            setRefreshTrigger(prev => prev + 1);
            dispatch({ type: "CREATE_HOTLINE", payload: response.data });
            document.getElementById('my_modal_2').close();
            toast("Contact number created successfully", "success");
        } catch (error) {
            console.error("Error creating hotline:", error);
            toast("Failed to create contact", "error");
        } finally {
            setName("");
            setNumber("");
            setLocation("");
            setCategory("");
            setModalLoading(false);
        }
    };

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

                <div className="badge bg-primary text-white badge-md ml-2">
                    Total: {total}
                </div>
            </div>
        </div>
    );

    // Get icon for category
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Fire': return <FaFire className="text-red-500" />;
            case 'Police': return <FaShieldAlt className="text-blue-500" />;
            case 'Ambulance/ Medical': return <FaAmbulance className="text-green-500" />;
            case 'Disaster Response': return <FaExclamationTriangle className="text-yellow-500" />;
            default: return <FaPhoneAlt className="text-gray-500" />;
        }
    };

    return (
        <AdminDrawer>
            <AdminNavbar />

            <div className="p-10 max-w-8xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <HiPhone className="text-3xl text-primary mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">Emergency Hotlines</h1>
                    </div>

                    <div className="stats shadow bg-base-100">
                        <div className="stat place-items-center">
                            <div className="stat-title">Total Contacts</div>
                            <div className="stat-value text-primary">{total}</div>
                        </div>
                    </div>
                </div>

                {/* Category Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {Object.entries(categoryCounts).map(([category, count]) => (
                        <div
                            key={category}
                            className={`stat bg-base-100 shadow-sm rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${categoryFilter === category ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setCategoryFilter(prev => prev === category ? '' : category)}
                        >
                            <div className="flex items-center gap-2 stat-title text-xs">
                                {getCategoryIcon(category)}
                                {category}
                            </div>
                            <div className="stat-value text-xl">{count}</div>
                        </div>
                    ))}
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
                                placeholder="Search contacts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Category Filter - For smaller screens */}
                        <div className="md:hidden flex-1">
                            <select
                                className="select select-bordered w-full"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => document.getElementById('my_modal_2').showModal()}
                                className="btn bg-primary text-white hover:bg-primary/80 btn-sm font-normal gap-1 transform transition hover:scale-105"
                                disabled={loading}
                            >
                                <HiPlus className="w-4 h-4" /> Add Contact
                            </button>
                            <button
                                onClick={() => setRefreshTrigger(prev => prev + 1)}
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
                    {loading && hotlines.length === 0 ? (
                        <div className="w-full p-8">
                            <div className="flex flex-col items-center justify-center">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <p className="mt-4 text-gray-600">Loading hotlines...</p>
                            </div>
                        </div>
                    ) : hotlines && hotlines.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="w-12"></th>
                                        <th className="w-1/5">Name</th>
                                        <th className="w-1/5">Number</th>
                                        <th className="w-1/5">Location</th>
                                        <th className="w-1/5">Category</th>
                                        <th className="w-1/5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotlines.map((hotline, index) => (
                                        <HotlineItems
                                            key={hotline._id}
                                            index={index}
                                            id={hotline._id}
                                            name={hotline.name}
                                            number={hotline.number}
                                            location={hotline.location}
                                            category={hotline.category}
                                            setRefreshTrigger={setRefreshTrigger}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="w-full p-16">
                            <div className="flex flex-col items-center justify-center">
                                <HiPhone className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hotlines found</h3>
                                <p className="text-gray-500 mb-6 text-center max-w-md">
                                    {search || categoryFilter ?
                                        `We couldn't find any contacts matching your filters.` :
                                        "There are no emergency contacts available at the moment."}
                                </p>
                                <button
                                    onClick={() => document.getElementById('my_modal_2').showModal()}
                                    className="btn btn-primary gap-2"
                                >
                                    <HiPlus className="w-5 h-5" /> Add First Contact
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pagination - Only show when we have hotlines */}
                    {hotlines && hotlines.length > 0 && (
                        <div className="px-6 py-4 border-t border-base-300">
                            {renderPagination()}
                        </div>
                    )}
                </div>

                {/* Create Contact Modal */}
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box w-11/12 max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <HiPhone className="text-2xl text-primary" />
                            <h3 className="font-bold text-lg">Create New Contact</h3>
                        </div>

                        <div className="divider"></div>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Name<span className="text-red-500">*</span></span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter contact name"
                                        className="input input-bordered w-full pl-10"
                                        value={name || ""}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaPhoneAlt className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Contact Number<span className="text-red-500">*</span></span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. (123) 456-7890"
                                        maxLength={15}
                                        className={`input input-bordered w-full pl-10 ${error ? 'input-error' : ''}`}
                                        value={number || ""}
                                        onChange={handleNumberChange}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <HiPhone className="text-gray-400" />
                                    </div>
                                </div>
                                {error && <p className="text-error text-xs mt-1">{error}</p>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Location</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter location"
                                        className="input input-bordered w-full pl-10"
                                        value={location || ""}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <MdLocationOn className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Category<span className="text-red-500">*</span></span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="select select-bordered w-full pl-10"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        {getCategoryIcon(category || 'Others')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action mt-6">
                            <button
                                className="btn btn-ghost"
                                onClick={() => document.getElementById('my_modal_2').close()}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary gap-2"
                                disabled={modalLoading || !name || !number || !category || !!error}
                                onClick={handleSubmit}
                            >
                                {modalLoading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        <HiPlus className="w-4 h-4" /> Create Contact
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </AdminDrawer>
    );
};

export default Hotlines;