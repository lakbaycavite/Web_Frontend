import axios from 'axios'
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiOutlineChatAlt } from "react-icons/hi";
import { useAuthContext } from "../../hooks/useAuthContext";
import moment from "moment";
import { useToast } from "../../hooks/useToast";

const CommentsModal = ({ postId, show, onClose }) => {
    const { user } = useAuthContext();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (show) {
            axios.get(`http://localhost:4000/admin/post/${postId}/comments`, {
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
                                    <Link to={`/user/display/${comment.user._id}`} className="text-sm text-gray-600">{comment.user.username}</Link>
                                    <p className="text-gray-800">{comment.text}</p>
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

const PostDisplay = ({ onSuccess }) => {
    const [showComments, setShowComments] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const toast = useToast()
    const { id } = useParams()
    const { user } = useAuthContext()
    const [showAttachments, setShowAttachments] = useState(false)

    const navigate = useNavigate()

    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [userPost, setUserPost] = useState('')
    const [created, setCreated] = useState('')
    const [userImage, setUserImage] = useState('')
    const [isHidden, setIsHidden] = useState(false)
    const [imageURL, setImageURL] = useState('')

    const [success, setSuccess] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [deleted, setDeleted] = useState(false)
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
        axios.get('http://localhost:4000/admin/post/' + id, {
            headers: {
                "Authorization": `bearer ${user.token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                setContent(res.data.content)
                // setUser(res.data.user)
                setUserImage(res.data.user.image)
                setImageURL(res.data.imageURL)
                setIsHidden(res.data.is_hidden)
                setCreated(res.data.createdAt)
                setUserPost(res.data.user.username)
                setUserId(res.data.user._id)
                console.log(res)

            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const handleDelete = (id) => {
        setOpenModal(false)
        axios.put("http://localhost:4000/admin/post/toggle-visibility/" + id, null, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then((response) => {
                console.log(response);
                handleDeletePopup()
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleConfirmModal = () => {
        setOpenModal(true)
    }

    const handleImageClick = () => {
        setShowImageModal(true);
    };

    const formattedDate = moment(created).format('h:mm a, MMMM Do, YYYY');

    return (
        <>
            {/* <Toaster richColors /> */}

            <div className="hero min-h-screen flex justify-center items-center">
                <div className="w-full max-w-2xl bg-white p-10 flex flex-col justify-between rounded-xl shadow-lg">
                    {/* avatar */}
                    <div className="flex items-center mb-6 ">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            <img src={`http://localhost:4000/uploads/${userImage}`} alt="User Avatar" className='w-full h-full object-cover' />
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

                    {imageURL && (
                        <div className="mb-6">
                            <button onClick={handleImageClick} className="w-full h-auto">
                                <img
                                    className="w-full h-52 object-cover rounded-lg"
                                    src={`http://localhost:4000/uploads/${imageURL}`}
                                    alt="Post Attachment"
                                />
                            </button>
                            <Modal show={showImageModal} size="3xl" onClose={() => setShowImageModal(false)} popup>
                                <Modal.Header />
                                <Modal.Body>
                                    <img
                                        className="w-full h-auto object-cover rounded-lg"
                                        src={`http://localhost:4000/uploads/${imageURL}`}
                                        alt="Post Attachment"
                                    />
                                </Modal.Body>
                            </Modal>
                        </div>
                    )}
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