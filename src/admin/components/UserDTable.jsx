import moment from 'moment';
import React from 'react';
import {
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDTable = ({ users, loading }) => {

    const navigate = useNavigate();
    // Render loading skeleton
    if (loading) {
        return (
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">User</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Joined Date</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="border-b border-gray-200 animate-pulse">
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">User</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Joined Date</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="mr-2">
                                            {user.image ? (
                                                <img
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    src={user.image}
                                                    alt={`${user.firstName}'s avatar`}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <FaUser className="text-blue-500" />
                                                </div>
                                            )}
                                        </div>
                                        <span>{user.firstName} {user.lastName}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <FaEnvelope className="mr-2 text-gray-400" />
                                        <span>{user.email}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                        <span>{moment(user.createdAt).format('MMMM Do, YYYY')}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {user.isActive ? (
                                        <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs flex items-center justify-center w-24 mx-auto">
                                            <FaCheckCircle className="mr-1" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs flex items-center justify-center w-24 mx-auto">
                                            <FaTimesCircle className="mr-1" />
                                            Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="transform hover:scale-110 transition duration-300 ease-in-out">
                                        <button
                                            onClick={() => navigate('/user/display/' + user._id)}
                                            className="bg-secondary hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                                        >
                                            <FaEye className="mr-1" />
                                            View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-4 text-center text-gray-500">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserDTable;