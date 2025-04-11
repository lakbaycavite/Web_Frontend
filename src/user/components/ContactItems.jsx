import { useState, useEffect } from "react";
import { FiSearch, FiPhone, FiMapPin } from "react-icons/fi";
import { useHotlineContext } from "../../hooks/useHotlineContext";
import api from "../../lib/axios";

const ContactItems = () => {
    const { hotlines, dispatch } = useHotlineContext();
    // const [hotlines, setHotlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {

        api.get("/admin/hotline/")
            .then(response => {
                dispatch({ type: "SET_HOTLINES", payload: response.data.hotlines || [] });
                console.log(response.data)
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
                console.log(error)

            });

        // Using setTimeout to simulate network request
        setTimeout(() => {
            // setHotlines(mockHotlines);
            setLoading(false);
        }, 500);
    }, []);

    const hotlineList = hotlines || [];

    const categories = ['All', 'Fire', 'Police', 'Ambulance/ Medical', 'Disaster Response', 'Others'];

    // Filter hotlines based on search and location
    const filteredHotlines = hotlineList.filter(hotline => {
        const matchesSearch =
            hotline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotline.number.includes(searchTerm);
        const matchesFilter = activeFilter === "All" || hotline.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center p-8 bg-white rounded-lg shadow">
                <div className="text-gray-500">Loading hotlines...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-8 bg-white rounded-lg shadow">
                <div className="text-red-500">Error loading hotlines: {error}</div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow">
                <div className="relative flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder="Search hotlines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-600 whitespace-nowrap">Filter category:</label>
                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Hotlines Display */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-primary text-white py-3 px-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <FiPhone className="mr-2 h-5 w-5" />
                        Contact Hotlines
                    </h2>
                </div>

                <div className="max-h-[65vh] overflow-y-auto">
                    {filteredHotlines && filteredHotlines.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {filteredHotlines.map((hotline) => (
                                <div key={hotline._id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                        <div className="mb-2 sm:mb-0">
                                            <h3 className="font-semibold text-lg text-gray-800">{hotline.name}</h3>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                {hotline.location && (
                                                    <>
                                                        <FiMapPin className="h-4 w-4 mr-1" />
                                                        <span>{hotline.location}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p
                                            href={`tel:${hotline.number}`}
                                            className="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition mt-2 sm:mt-0"
                                        >
                                            <FiPhone className="h-4 w-4 mr-2" />
                                            {hotline.number}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm || activeFilter !== "All"
                                ? "No matches found. Try adjusting your search or filter."
                                : "No hotlines available."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactItems;