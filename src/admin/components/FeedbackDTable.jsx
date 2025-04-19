import moment from 'moment';
import React from 'react';
import {
    FaEye,
    FaEyeSlash,
    FaComments,
    FaStar
} from 'react-icons/fa';
import { MdOutlineFeedback } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export const FeedbackDTable = ({ posts, loading = false, characterLimit = 50 }) => {
    const navigate = useNavigate();

    // Function to truncate text
    const truncateText = (text, limit) => {
        if (!text) return '';
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    // Function to determine category color
    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'bug':
                return 'text-red-500';
            case 'feature':
                return 'text-blue-500';
            case 'improvement':
                return 'text-green-500';
            case 'ui/ux':
                return 'text-purple-500';
            case 'performance':
                return 'text-orange-500';
            default:
                return 'text-gray-500';
        }
    };

    // Function to render rating stars
    const renderRatingStars = (rating) => {
        const stars = [];
        const ratingValue = parseInt(rating) || 0;

        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={i < ratingValue ? "text-yellow-400" : "text-gray-300"}
                    size={14}
                />
            );
        }

        return stars;
    };

    // Handle toggle status (placeholder function)
    const handleToggleStatus = (id) => {
        // This would typically call an API to toggle the feedback visibility
        console.log("Toggle status for feedback:", id);
    };

    // Handle open response modal (placeholder function)
    const handleOpenResponseModal = (feedback) => {
        // Navigate to feedback detail view instead of opening modal
        navigate(`/feedback/display/${feedback._id}`);
    };

    // Render loading state
    if (loading) {
        return (
            <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                <div className="w-full p-8">
                    <div className="flex flex-col items-center justify-center">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                        <p className="mt-4 text-gray-600">Loading feedback...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Render empty state
    if (!Array.isArray(posts) || posts.length === 0) {
        return (
            <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                <div className="w-full p-16">
                    <div className="flex flex-col items-center justify-center">
                        <FaComments className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No feedback found</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                            There are no feedback submissions available at the moment.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Render feedback table
    return (
        <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
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
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(posts) && posts.map((feedback) => (
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
                                        <div className="font-medium line-clamp-2">
                                            {truncateText(feedback.comment || feedback.content, characterLimit)}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {feedback.category && (
                                        <span className={`badge ${getCategoryColor(feedback.category).replace('text-', 'bg-').replace('500', '100')} ${getCategoryColor(feedback.category)} border-0`}>
                                            {feedback.category}
                                        </span>
                                    )}
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
                                {/* <td>
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            className="btn btn-sm btn-outline tooltip"
                                            data-tip={feedback.isPublic ? "Hide Feedback" : "Show Feedback"}
                                            onClick={() => handleToggleStatus(feedback._id)}
                                        >
                                            {feedback.isPublic ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-info tooltip"
                                            data-tip="View Feedback"
                                            onClick={() => handleOpenResponseModal(feedback)}
                                        >
                                            <MdOutlineFeedback className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeedbackDTable;