import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { Button, Modal, Tooltip } from "flowbite-react";
import {
    HiOutlineExclamationCircle,
    HiOutlineChatAlt,
    HiOutlineThumbUp,
    HiOutlineClock,
    HiOutlineUser,
    HiOutlineDocumentText,
    HiOutlinePhotograph,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineX,
    HiOutlineCalendar
} from "react-icons/hi";
import { FiMoreVertical, FiImage, FiHeart, FiMessageCircle } from "react-icons/fi";
import { BsCalendarDate, BsPersonCircle } from "react-icons/bs";
import { useAuthContext } from "../../hooks/useAuthContext";
import moment from "moment";
import { useToast } from "../../hooks/useToast";
import api from '../../lib/axios';

// Reusing the existing modal components with minor enhancements
const CommentsModal = ({ postId, show, onClose }) => {
    const { user } = useAuthContext();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingCommentId, setProcessingCommentId] = useState(null);
    const toast = useToast();

    useEffect(() => {
        if (show) {
            fetchComments();
        }
    }, [show, postId, user.token]);

    const fetchComments = () => {
        api.get(`/admin/post/${postId}/comments`, {
            headers: { "Authorization": `Bearer ${user.token}` }
        })
            .then((res) => {
                setComments(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching comments:", err);
                setLoading(false);
            });
    };

    const handleToggleCommentVisibility = (commentId, isCurrentlyPublic) => {
        setProcessingCommentId(commentId);

        api.put(`/admin/post/${postId}/comments/${commentId}`, null, {
            headers: { "Authorization": `Bearer ${user.token}` }
        })
            .then((res) => {
                // Update the comments array with the updated visibility
                setComments(comments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, isPublic: !comment.isPublic }
                        : comment
                ));
                toast(`Comment ${isCurrentlyPublic ? 'hidden' : 'unhidden'} successfully`, "success");
            })
            .catch((err) => {
                console.error("Error toggling comment visibility:", err);
                toast("Failed to update comment visibility", "error");
            })
            .finally(() => {
                setProcessingCommentId(null);
            });
    };

    return (
        <Modal show={show} size="lg" onClose={onClose} popup>
            <Modal.Header className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                    <FiMessageCircle className="mr-2 text-blue-500 h-5 w-5" />
                    <h3 className="text-lg font-semibold text-gray-700">Comments</h3>
                </div>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className={`p-4 border rounded-lg transition-colors relative ${comment.isPublic === false ? 'bg-red-50' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    {/* Comment visibility badge */}
                                    {comment.isPublic === false && (
                                        <div className="absolute top-2 right-2">
                                            <span className="badge badge-error badge-sm text-white">Hidden</span>
                                        </div>
                                    )}

                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-primary/10">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${comment.username}&background=random`}
                                                alt={comment.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <Link
                                            to={`/user/display/${comment._id}`}
                                            className="text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            {comment.username}
                                        </Link>
                                        <span className="text-xs text-gray-500 ml-auto flex items-center">
                                            <HiOutlineClock className="mr-1" />
                                            {moment(comment.createdAt).fromNow()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <p className={`text-gray-800 pl-11 ${comment.isPublic === false ? 'text-opacity-60' : ''}`}>
                                            {comment.comment}
                                        </p>

                                        {/* Hide/Unhide Button */}
                                        <button
                                            onClick={() => handleToggleCommentVisibility(comment._id, comment.isPublic !== false)}
                                            disabled={processingCommentId === comment._id}
                                            className={`btn btn-sm ml-4 flex-shrink-0 ${comment.isPublic === false
                                                ? 'btn-success'
                                                : 'btn-error'
                                                }`}
                                        >
                                            {processingCommentId === comment._id ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : comment.isPublic === false ? (
                                                <>
                                                    <HiOutlineEye className="mr-1 w-3 h-3" /> Unhide
                                                </>
                                            ) : (
                                                <>
                                                    <HiOutlineEyeOff className="mr-1 w-3 h-3" /> Hide
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <FiMessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-gray-500">No comments yet.</p>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn btn-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all flex items-center gap-2"
                    >
                        <HiOutlineX className="w-4 h-4" /> Close
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

// Component for displaying likes
const LikesModal = ({ likedBy, show, onClose }) => {
    return (
        <Modal show={show} size="lg" onClose={onClose} popup>
            <Modal.Header className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                    <FiHeart className="mr-2 text-red-500 h-5 w-5" />
                    <h3 className="text-lg font-semibold text-gray-700">Liked by</h3>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {likedBy && likedBy.length > 0 ? (
                        likedBy.map((user, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-gray-50 flex items-center hover:bg-gray-100 transition-colors">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-primary/10">
                                    <img
                                        src={user.image || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <Link to={`/user/display/${user._id}`} className="text-sm font-medium text-blue-600 hover:underline">
                                        {user.username}
                                    </Link>
                                    <p className="text-xs text-gray-500">User</p>
                                </div>
                                {/* <Button size="xs" color="light" className="ml-auto">
                                    View Profile
                                </Button> */}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <FiHeart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500">No likes yet.</p>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end items-center">
                    <button
                        onClick={onClose}
                        className="btn btn-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all flex items-center gap-2"
                    >
                        <HiOutlineX className="" /> Close
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

// Component for displaying images
const ImageGallery = ({ attachments }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        console.log(selectedImage);
        setShowModal(true);
    };

    if (!attachments || attachments.length === 0) {
        return null;
    }

    return (
        <>
            <div className="mb-6">
                <div className="flex items-center mb-3">
                    <FiImage className="text-green-600 mr-2 h-5 w-5" />
                    <h3 className="font-bold text-gray-700">Attachments</h3>
                    <span className="ml-2 badge badge-sm badge-primary">{attachments.length}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {attachments.map((image, index) => (
                        <div key={index} className="relative h-40 overflow-hidden rounded-lg shadow-md group">
                            <img
                                className="w-full h-full object-cover cursor-pointer transform transition-transform duration-300 group-hover:scale-110"
                                src={image}
                                alt={`Attachment ${index + 1}`}
                                onClick={() => handleImageClick(image)}
                            />
                            {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <HiOutlineEye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8 transition-opacity duration-300" />
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for full-size image view */}
            <Modal show={showModal} size="4xl" onClose={() => setShowModal(false)} popup>
                <Modal.Header className="relative flex justify-end border-none">
                    {/* <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
                    >
                        <HiOutlineX className="w-6 h-6" />
                    </button> */}
                </Modal.Header>
                <Modal.Body className="p-0">

                    {selectedImage && (
                        <div className="relative w-full h-[80vh]">
                            <img
                                className="w-full h-full object-contain rounded-lg"
                                src={selectedImage}
                                alt="Post Attachment"
                            />
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

const PostDisplayModal = ({ postId, show, onClose, onPostUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [showLikes, setShowLikes] = useState(false);

    const toast = useToast();
    const { user } = useAuthContext();

    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [userPost, setUserPost] = useState('');
    const [created, setCreated] = useState('');
    const [userImage, setUserImage] = useState('');
    const [isHidden, setIsHidden] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [likedBy, setLikedBy] = useState([]);

    const [confirmModal, setConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(true);

    // Fetch post data when modal is shown
    useEffect(() => {
        if (show && postId) {
            setLoadingPost(true);
            api.get('/admin/post/' + postId, {
                headers: {
                    "Authorization": `bearer ${user.token}`
                }
            })
                .then((res) => {
                    setContent(res.data.content);
                    setUserImage(res.data.user.image);
                    setAttachments(res.data.attachments || []);
                    setIsHidden(res.data.is_hidden);
                    setCreated(res.data.createdAt);
                    setUserPost(res.data.user.username);
                    setUserId(res.data.user._id);
                    setLikedBy(res.data.likedBy || []);
                })
                .catch((err) => {
                    console.log(err);
                    toast('Failed to load post data', 'error');
                })
                .finally(() => {
                    setLoadingPost(false);
                });
        }
    }, [show, postId, user.token]);

    const handleToggleVisibility = () => {
        setLoading(true);
        setConfirmModal(false);

        api.put("/admin/post/toggle-visibility/" + postId, null, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(() => {
                toast(`Post ${isHidden ? 'unhidden' : 'hidden'} successfully`, "success");
                setIsHidden(!isHidden);
                if (onPostUpdate) onPostUpdate();
            })
            .catch((err) => {
                console.log(err);
                toast('Failed to update post visibility', 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const formattedDate = moment(created).format('h:mm a, MMMM Do, YYYY');

    // Get recent likers for display
    const recentLikers = likedBy.slice(0, 3);

    return (
        <>
            <Modal show={show} size="4xl" onClose={onClose} className="post-display-modal">
                <Modal.Header className="bg-gradient-to-r from-primary/90 to-primary text-white">
                    <div className="flex items-center">
                        <HiOutlineDocumentText className="mr-2 h-6 w-6" />
                        <h3 className="text-xl font-medium">Post Details</h3>
                    </div>
                    <div className="ml-auto">
                        <span className={`badge ${isHidden ? 'bg-red-500' : 'bg-green-500'} text-white ml-2`}>
                            {isHidden ? 'Hidden' : 'Visible'}
                        </span>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {loadingPost ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="p-6 space-y-6">
                            {/* User info section */}
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-6 pb-6 border-b border-gray-200">
                                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20">
                                    <img
                                        src={userImage ? userImage : `https://ui-avatars.com/api/?name=${userPost}&background=random`}
                                        alt="User Avatar"
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center mb-1">
                                        <BsPersonCircle className="text-gray-500 mr-2" />
                                        <span className="text-gray-500 font-medium">User:</span>
                                        <Link
                                            to={`/user/display/${userId}`}
                                            className="text-primary font-semibold ml-2 hover:underline"
                                        >
                                            {userPost}
                                        </Link>
                                    </div>
                                    <div className="flex items-center">
                                        <BsCalendarDate className="text-gray-500 mr-2" />
                                        <span className="text-gray-500 font-medium">Created:</span>
                                        <span className="text-primary ml-2">
                                            {formattedDate.includes('Invalid date') ? '' : formattedDate}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    {loading ? (
                                        <button className="btn btn-error text-white min-w-32" disabled>
                                            <span className="loading loading-spinner loading-md"></span>
                                        </button>
                                    ) : (
                                        <button
                                            className={`btn ${isHidden ? 'btn-success' : 'btn-error'} text-white min-w-32 flex items-center gap-2`}
                                            onClick={() => setConfirmModal(true)}
                                        >
                                            {isHidden ? (
                                                <>
                                                    <HiOutlineEye className="w-5 h-5" /> Unhide Post
                                                </>
                                            ) : (
                                                <>
                                                    <HiOutlineEyeOff className="w-5 h-5" /> Hide Post
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Post content section */}
                            <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
                                <div className="flex items-center mb-3">
                                    <HiOutlineDocumentText className="text-blue-600 mr-2 h-5 w-5" />
                                    <h3 className="font-bold text-gray-700">Post Content</h3>
                                </div>
                                <div className="bg-white rounded-lg border p-4 min-h-[120px] max-h-[250px] overflow-y-auto break-words">
                                    {content || <span className="text-gray-400 italic">No content</span>}
                                </div>
                            </div>

                            {/* Image Gallery Component */}
                            <ImageGallery attachments={attachments} />

                            {/* Engagement section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Likes section */}
                                <div className="bg-gray-50 p-5 rounded-lg">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            <FiHeart className="text-red-500 mr-2" />
                                            <h3 className="font-bold text-gray-700">Likes</h3>
                                            <span className="ml-2 badge badge-sm badge-primary">{likedBy.length}</span>
                                        </div>
                                        <button
                                            onClick={() => setShowLikes(true)}
                                            className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center"
                                        >
                                            View All
                                        </button>
                                    </div>

                                    {likedBy.length > 0 ? (
                                        <div className="flex items-center">
                                            <div className="flex -space-x-3">
                                                {recentLikers.map((liker, index) => (
                                                    <Tooltip key={index} content={liker.username}>
                                                        <img
                                                            src={liker.image || `https://ui-avatars.com/api/?name=${liker.username}&background=random`}
                                                            alt={liker.username}
                                                            className="w-10 h-10 rounded-full border-2 border-white"
                                                        />
                                                    </Tooltip>
                                                ))}
                                            </div>
                                            {likedBy.length > 3 && (
                                                <span className="ml-3 text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                                    +{likedBy.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-3">
                                            <p className="text-gray-400 italic">No likes yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* Comments section */}
                                <div className="bg-gray-50 p-5 rounded-lg">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center">
                                            <FiMessageCircle className="text-blue-500 mr-2" />
                                            <h3 className="font-bold text-gray-700">Comments</h3>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary w-full flex items-center justify-center gap-2 hover:bg-primary-focus transition-colors"
                                        onClick={() => setShowComments(true)}
                                    >
                                        <HiOutlineChatAlt className="w-5 h-5" /> View Comments
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="flex justify-between">
                    <div className="text-xs text-gray-500">
                        Post ID: {postId}
                    </div>
                    <Button
                        onClick={onClose}
                        className="flex bg-secondary items-center gap-2"
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Comments Modal */}
            <CommentsModal postId={postId} show={showComments} onClose={() => setShowComments(false)} />

            {/* Likes Modal */}
            <LikesModal likedBy={likedBy} show={showLikes} onClose={() => setShowLikes(false)} />

            {/* Confirmation Modal */}
            <Modal show={confirmModal} size="md" onClose={() => setConfirmModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to {isHidden ? 'unhide' : 'hide'} this post?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color={isHidden ? "success" : "failure"}
                                onClick={handleToggleVisibility}
                                className="flex items-center gap-2"
                            >
                                {isHidden ? (
                                    <>
                                        <HiOutlineEye className="w-4 h-4" /> Yes, Unhide it
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineEyeOff className="w-4 h-4" /> Yes, Hide it
                                    </>
                                )}
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setConfirmModal(false)}
                                className="flex items-center gap-2"
                            >
                                <HiOutlineX className="w-4 h-4" /> Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PostDisplayModal;