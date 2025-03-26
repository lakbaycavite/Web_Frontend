import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { useToast } from '../../hooks/useToast';
import { useAuthContext } from '../../hooks/useAuthContext';

// Icons
import { HiOutlineExclamationCircle, HiOutlineEye, HiMiniEyeSlash, HiEye } from "react-icons/hi2";
import { Button, Modal } from "flowbite-react";

const PostItem = (props) => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { handleEventDelete, is_hidden } = props;

    // Format the MongoDB date using moment
    const formattedDate = moment(props.created).format('MMMM Do, YYYY');
    const timeAgo = moment(props.created).fromNow();

    // Handle toggling visibility of a post
    const handleToggleUpdate = async (id) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:4000/admin/post/toggle-visibility/${id}`,
                null,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            toast(
                `Post ${is_hidden ? 'unhidden' : 'hidden'} successfully.`,
                "success"
            );
            handleEventDelete();
        } catch (error) {
            console.error(error);
            toast('Failed to update post visibility', 'error');
        } finally {
            setLoading(false);
            setOpenModal(false);
        }
    };

    // Navigate to post detail view
    const handleView = (id) => {
        navigate('/post/display/' + id);
    };

    // Truncate content to specified length
    const truncateContent = (content, maxLength = 100) => {
        if (content.length <= maxLength) return content;
        return content.substr(0, maxLength) + '...';
    };

    return (
        <React.Fragment key={props.index}>
            <th className={`${is_hidden ? 'bg-error' : 'bg-secondary'} transition-colors duration-200`}>
                <div className="w-3 h-full"></div>
            </th>

            <td>
                <div className="flex items-start gap-3">
                    {props.image && (
                        <div className="avatar">
                            <div className="w-10 h-10 rounded-md">
                                <img src={props.image ? props.image : 'https://ui-avatars.com/api/?name=' + userData.username} alt="Post thumbnail" />
                            </div>
                        </div>
                    )}
                    <div>
                        {props.title && (
                            <div className="font-semibold text-sm">{props.title}</div>
                        )}
                        <div className={`text-sm ${is_hidden ? 'text-gray-400' : 'text-gray-600'}`}>
                            {truncateContent(props.content)}
                        </div>
                        {is_hidden && (
                            <div className="badge badge-error badge-sm gap-1 mt-1">
                                <HiMiniEyeSlash className="w-3 h-3" /> Hidden
                            </div>
                        )}
                    </div>
                </div>
            </td>

            <td>
                <div className="flex flex-col">
                    <span className="font-medium">{props.profileName || 'Unknown User'}</span>
                    <span className="text-xs text-gray-500">Author</span>
                </div>
            </td>

            <td>
                <div className="flex flex-col">
                    <span>{formattedDate}</span>
                    <span className="text-xs text-gray-500">{timeAgo}</span>
                </div>
            </td>

            <td>
                <div className="flex justify-center gap-2">
                    <button
                        className="btn btn-sm btn-info text-white gap-1 min-w-[80px]"
                        onClick={() => handleView(props.pid)}
                    >
                        <HiEye className="w-4 h-4" /> View
                    </button>

                    <button
                        className={`btn btn-sm gap-1 min-w-[80px] ${is_hidden ? 'btn-success' : 'btn-error'} text-white`}
                        disabled={loading}
                        onClick={() => setOpenModal(true)}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <>
                                {is_hidden ? (
                                    <>
                                        <HiOutlineEye className="w-4 h-4" /> Unhide
                                    </>
                                ) : (
                                    <>
                                        <HiMiniEyeSlash className="w-4 h-4" /> Hide
                                    </>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </td>

            {/* Confirmation Modal */}
            <Modal
                show={openModal}
                size="md"
                onClose={() => setOpenModal(false)}
                popup
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to {is_hidden ? 'unhide' : 'hide'} this post?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color={is_hidden ? "success" : "failure"}
                                onClick={() => handleToggleUpdate(props.pid)}
                            >
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setOpenModal(false)}
                            >
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default PostItem