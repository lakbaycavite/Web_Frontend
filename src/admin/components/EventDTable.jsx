import React from 'react';
import moment from 'moment';
import {
    FaCalendarAlt,
    FaClock,
    FaSpinner,
    FaCalendarCheck,
    FaInfoCircle,
    FaArrowRight
} from 'react-icons/fa';

const EventDTable = ({ events, loading = false, characterLimit = 60 }) => {
    // Function to truncate text
    const truncateText = (text, limit) => {
        if (!text) return '';
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    // Function to format date and time using moment
    const formatDate = (dateTimeStr) => {
        return moment(dateTimeStr).format('MMM D, YYYY');
    };

    const formatTime = (dateTimeStr) => {
        return moment(dateTimeStr).format('h:mm A');
    };

    // Function to format date range - handles same-day events differently
    const formatDateRange = (startStr, endStr) => {
        const start = moment(startStr);
        const end = moment(endStr);

        if (start.isSame(end, 'day')) {
            return formatDate(startStr); // Just show one date if same day
        } else {
            return `${formatDate(startStr)} - ${formatDate(endStr)}`;
        }
    };

    // Function to format time range
    const formatTimeRange = (startStr, endStr) => {
        return `${formatTime(startStr)} - ${formatTime(endStr)}`;
    };

    // Check if an event is today using moment
    const isToday = (dateTimeStr) => {
        return moment(dateTimeStr).isSame(moment(), 'day');
    };

    // Render loading skeleton
    if (loading) {
        return (
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Title</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-center">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="border-b border-gray-200 animate-pulse">
                                <td className="py-3 px-6 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 max-w-md"></div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
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
                        <th className="py-3 px-6 text-left">Title</th>
                        <th className="py-3 px-6 text-left">Description</th>
                        <th className="py-3 px-6 text-center">Date & Time</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                    {events && events.length > 0 ? (
                        events.map((event, index) => (
                            <tr
                                key={event.id || index}
                                className={`border-b border-gray-200 hover:bg-gray-50 ${isToday(event.start) ? 'bg-yellow-50' : ''
                                    }`}
                            >
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <FaCalendarCheck className="mr-2 text-secondary" />
                                        <span className="font-medium">{event.title}</span>
                                    </div>
                                    {isToday(event.start) && (
                                        <span className="ml-6 text-xs bg-yellow-100 text-secondary px-2 py-1 rounded-full">
                                            Today
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-start">
                                        <FaInfoCircle className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                                        <p>{truncateText(event.description, characterLimit)}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center text-sm text-secondary mb-1">
                                            <FaCalendarAlt className="mr-1" />
                                            <span>{formatDateRange(event.start, event.end)}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FaClock className="mr-1" />
                                            <span>{formatTimeRange(event.start, event.end)}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-4 text-center text-gray-500">
                                No upcoming events found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EventDTable;