import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Button, Modal, Tooltip } from "flowbite-react";
import { HiOutlineExclamationCircle, HiOutlineChatAlt, HiOutlineThumbUp } from "react-icons/hi";
import { useAuthContext } from "../../hooks/useAuthContext";
import moment from "moment";
import { useToast } from "../../hooks/useToast";
import api from '../../lib/axios';

const CommentsModal = ({ postId, show, onClose }) => {
    const { user } = useAuthContext();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (show) {
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
        }
    }, [show, postId, user.token]);

    return (
        <Modal show={show} size="md" onClose={onClose} popup>
            <Modal.Header />
            <Modal.Body>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Comments</h3>
                {loading ? (
                    <p>Loading comments...</p>
                ) : (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                                    <Link to={`/user/display/${comment._id}`} className="text-sm text-gray-600">{comment.username}</Link>
                                    <p className="text-gray-800">{comment.comment}</p>
                                    <p className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                    </div>
                )}
                <div className="mt-4 flex justify-end">
                    <button color="gray" onClick={onClose} className="btn btn-md">Close</button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

// Component for displaying likes
const LikesModal = ({ likedBy, show, onClose }) => {
    return (

        <Modal show={show} size="md" onClose={onClose} popup>
            <Modal.Header />
            <Modal.Body>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Liked by</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {likedBy && likedBy.length > 0 ? (

                        likedBy.map((user, index) => (
                            <div key={index} className="p-2 border rounded-lg bg-gray-50 flex items-center">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                                    <img
                                        src={user.image || `https://ui-avatars.com/api/?name=${user.username}`}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Link to={`/user/display/${user._id}`} className="text-sm text-blue-600 hover:underline">
                                    {user.username}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No likes yet.</p>
                    )}
                </div>
                <div className="mt-4 flex justify-end">
                    <button color="gray" onClick={onClose} className="btn btn-md">Close</button>
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
        setShowModal(true);
    };

    return (
        <>
            {attachments && attachments.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-bold mb-2">Attachments:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {attachments.map((image, index) => (
                            <div key={index} className="relative h-40 overflow-hidden rounded-lg">
                                <img
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    src={image}
                                    alt={`Attachment ${index + 1}`}
                                    onClick={() => handleImageClick(image)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal for full-size image view */}
            <Modal show={showModal} size="3xl" onClose={() => setShowModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    {selectedImage && (
                        <img
                            className="w-full h-auto object-contain rounded-lg"
                            src={selectedImage}
                            alt="Post Attachment"
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

const PostDisplay = ({ onSuccess }) => {
    const [showComments, setShowComments] = useState(false);
    const [showLikes, setShowLikes] = useState(false);

    const toast = useToast()
    const { id } = useParams()
    const { user } = useAuthContext()

    const navigate = useNavigate()

    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [userPost, setUserPost] = useState('')
    const [created, setCreated] = useState('')
    const [userImage, setUserImage] = useState('')
    const [isHidden, setIsHidden] = useState(false)
    const [attachments, setAttachments] = useState([])
    const [likedBy, setLikedBy] = useState([])

    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleBack = () => {
        navigate('/admin/post')
    }

    const handleDeletePopup = () => {
        toast('Post has been successfully deleted', "success")
        setLoading(true)
        navigate('/admin/post')
    }

    useEffect(() => {
        api.get('/admin/post/' + id, {
            headers: {
                "Authorization": `bearer ${user.token}`
            }
        })
            .then((res) => {

                setContent(res.data.content)
                setUserImage(res.data.user.image)
                setAttachments(res.data.attachments || [])
                setIsHidden(res.data.is_hidden)
                setCreated(res.data.createdAt)
                setUserPost(res.data.user.username)
                setUserId(res.data.user._id)
                setLikedBy(res.data.likedBy || [])
                // console.log(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])



    const handleDelete = (id) => {
        setLoading(true)
        setOpenModal(false)
        api.put("/admin/post/toggle-visibility/" + id, null, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(() => {
                handleDeletePopup()
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleConfirmModal = () => {
        setOpenModal(true)
    }

    const formattedDate = moment(created).format('h:mm a, MMMM Do, YYYY');

    // Get recent likers for display
    const recentLikers = likedBy.slice(0, 3);

    return (
        <>
            <div className="hero min-h-screen flex justify-center items-center">
                <div className="w-full max-w-2xl bg-white p-10 flex flex-col justify-between rounded-xl shadow-lg">
                    {/* avatar */}
                    <div className="flex items-center mb-6 ">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            <img src={userImage ? userImage : 'https://ui-avatars.com/api/?name=' + userPost} alt="User Avatar" className='w-full h-full object-cover' />
                        </div>
                        <div className="ml-6">
                            <p className="text-gray-500">User: <Link to={`/user/display/${userId}`} className="text-primary hover:underline">{userPost}</Link></p>
                            <p className="text-gray-500">Created: <span className="text-primary">{formattedDate.includes('Invalid date') ? '' : formattedDate}</span></p>
                        </div>
                        <div className="ml-auto">
                            {loading ? (
                                <button className="btn btn-error text-white w-32" disabled>
                                    <span className="loading loading-spinner loading-md"></span>
                                </button>
                            ) : (
                                <button className="btn btn-error text-white w-32" onClick={handleConfirmModal}>
                                    {isHidden ? 'Unhide' : 'Hide'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* post */}
                    <div className="mb-6">
                        <label className="font-bold">Post Description:</label>
                        <p className="py-4 text-gray-500 min-h-36 max-h-44 overflow-y-auto break-words">{content}</p>
                    </div>

                    {/* Image Gallery Component */}
                    <ImageGallery attachments={attachments} />

                    {/* Likes section */}
                    <div className="mb-6">
                        <button
                            onClick={() => setShowLikes(true)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <HiOutlineThumbUp className="mr-1" />
                            <span className="font-medium">{likedBy.length}</span>
                            <span className="ml-1">Likes</span>
                        </button>

                        {likedBy.length > 0 && (
                            <div className="mt-2 flex items-center">
                                <div className="flex -space-x-2">
                                    {recentLikers.map((liker, index) => (
                                        <Tooltip key={index} content={liker.username}>
                                            <img
                                                src={liker.image || `https://ui-avatars.com/api/?name=${liker.username}`}
                                                alt={liker.username}
                                                className="w-8 h-8 rounded-full border-2 border-white"
                                            />
                                        </Tooltip>
                                    ))}
                                </div>
                                {likedBy.length > 3 && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        and {likedBy.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        <LikesModal
                            likedBy={likedBy}
                            show={showLikes}
                            onClose={() => setShowLikes(false)}
                        />
                    </div>

                    {/* comments button */}
                    <div className="flex justify-between items-center mb-6">
                        <button className="btn btn-primary flex items-center" onClick={() => setShowComments(true)}>
                            <HiOutlineChatAlt className="mr-2" /> View Comments
                        </button>
                        <CommentsModal postId={id} show={showComments} onClose={() => setShowComments(false)} />
                    </div>

                    {/* back button */}
                    <div className="flex justify-end">
                        <button className="btn btn-sm w-28" onClick={handleBack}>Back</button>
                    </div>
                </div>
            </div>
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to {isHidden ? 'unhide' : 'hide'} this post?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => handleDelete(id)}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PostDisplay