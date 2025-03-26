import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import moment from "moment"
import { Button, Modal } from "flowbite-react"
import { useToast } from "../../hooks/useToast"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useUsersContext } from '../../hooks/useUsersContext'

// Icons
import { HiOutlineExclamationCircle, HiEye } from "react-icons/hi"
import { FaUserCheck, FaUserTimes } from "react-icons/fa"

const UsersTable = (props) => {
    const { user } = useAuthContext()
    const { dispatch } = useUsersContext()
    const navigate = useNavigate()
    const toast = useToast()

    // States
    const [openModal, setOpenModal] = useState(false)
    const [tempId, setTempId] = useState(null)
    const [loading, setLoading] = useState(false)

    // Format dates
    const formattedDate = moment(props.createdAt).format('MMMM Do, YYYY')
    const timeAgo = moment(props.createdAt).fromNow()

    // Open confirmation modal
    const handleConfirmModal = (id) => {
        setTempId(id)
        setOpenModal(true)
    }

    // Toggle user active/inactive status
    const handleToggleStatus = async (id) => {
        setLoading(true)
        setOpenModal(false)

        try {
            await axios.put(
                `http://localhost:4000/admin/user/toggle-status/${id}`,
                null,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            )

            toast(`User ${props.isActive ? 'deactivated' : 'activated'} successfully`, "success")

            dispatch({
                type: "TOGGLE_USER",
                payload: { _id: id },
            })

            props.fetchUsers()
        } catch (error) {
            console.error("Error toggling user status:", error)
            toast("Failed to update user status", "error")
        } finally {
            setLoading(false)
        }
    }

    // Navigate to user details
    const handleView = (id) => {
        navigate('/user/display/' + id)
    }

    return (
        <>
            <tr className="hover:bg-base-200 transition-colors duration-150">
                <th className={`${props.isActive ? 'bg-secondary' : 'bg-error'} transition-colors duration-200`}>
                    <div className="w-3 h-full"></div>
                </th>
                <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12 border shadow-sm">
                                <img
                                    src={props.image}
                                    alt={`${props.username}'s avatar`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://ui-avatars.com/api/?name=' + props.username;
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-base">{props.username}</div>
                            <div className="text-sm text-gray-500">{props.email}</div>
                            {!props.isActive && (
                                <div className="badge badge-error badge-sm gap-1 mt-1">
                                    <FaUserTimes className="w-3 h-3" /> Inactive
                                </div>
                            )}
                        </div>
                    </div>
                </td>
                <td>
                    <div className="font-medium">{`${props.firstName || ''} ${props.lastName || ''}`}</div>
                    {(props.role) && (
                        <div className={`badge  badge-sm mt-1 ${props.role === 'admin' ? 'badge-warning' : 'badge-ghost'}`}>{props.role}</div>
                    )}
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
                            onClick={() => handleView(props._id)}
                        >
                            <HiEye className="w-4 h-4" /> Details
                        </button>

                        <button
                            className={`btn btn-sm gap-1 min-w-[80px] ${props.isActive ? 'btn-error' : 'btn-success'} text-white`}
                            disabled={loading}
                            onClick={() => handleConfirmModal(props._id)}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <>
                                    {props.isActive ? (
                                        <>
                                            <FaUserTimes className="w-4 h-4" /> Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <FaUserCheck className="w-4 h-4" /> Activate
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </td>
            </tr>

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
                            Are you sure you want to {props.isActive ? "deactivate" : 'activate'} this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color={props.isActive ? "failure" : "success"}
                                onClick={() => handleToggleStatus(tempId)}
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
        </>
    )
}

export default UsersTable