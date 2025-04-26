import moment from 'moment';
import React from 'react';
import {
    FaUser,
    FaCalendarAlt,
    FaEye,
    FaSpinner,
    FaNewspaper
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PostDTable = ({ posts, loading = false, characterLimit = 50 }) => {
    // Function to truncate text
    const truncateText = (text, limit) => {
        if (!text) return '';
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    console.log("Posts: " + posts)
    const navigate = useNavigate()

    // Render loading skeleton
    if (loading) {
        return (
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Content</th>
                            <th className="py-3 px-6 text-left">User</th>
                            <th className="py-3 px-6 text-left">Created At</th>
                            {/* <th className="py-3 px-6 text-center">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="border-b border-gray-200 animate-pulse">
                                <td className="py-3 px-6 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 max-w-md"></div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </td>
                                {/* <td className="py-3 px-6 text-center">
                                    <div className="h-8 bg-gray-200 rounded w-20 mx-auto"></div>
                                </td> */}
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
                        <th className="py-3 px-6 text-left">Content</th>
                        <th className="py-3 px-6 text-left">User</th>
                        <th className="py-3 px-6 text-left">Created At</th>
                        {/* <th className="py-3 px-6 text-center">Actions</th> */}
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                    {posts && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <tr key={post.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <FaNewspaper className="mr-2 text-gray-400" />
                                        <p className="font-medium">{truncateText(post.content, characterLimit)}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <div className="mr-2">
                                            {post.user?.image ? (
                                                <img
                                                    className="w-8 h-8 rounded-full"
                                                    src={post.user.image}
                                                    alt={`${post.user.firstName}'s avatar`}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <FaUser className="text-indigo-500" />
                                                </div>
                                            )}
                                        </div>
                                        {post.user?.firstName && post.user?.lastName ? (
                                            <span>{post.user?.firstName || ''} {post.user?.lastName || ''}</span>

                                        ) : (
                                            <>
                                                {/* <span>{post.user?.email}</span> */}
                                                <span>{post.user?.username}</span>
                                            </>


                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                        <span> {moment(post.createdAt).format('h:mm a, MMMM Do, YYYY')}</span>
                                    </div>
                                </td>
                                {/* <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => navigate('/post/display/' + post._id)}
                                        className="bg-secondary hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                                    >
                                        <FaEye className="mr-1" />
                                        View
                                    </button>
                                </td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-4 text-center text-gray-500">
                                No posts found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PostDTable;