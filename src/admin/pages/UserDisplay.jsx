import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "flowbite-react";
import { Toaster, toast } from "sonner";
import moment from "moment";
// Components
import AdminDrawer from "../components/AdminDrawer";
import AdminNavbar from "../components/AdminNavbar";

// Icons
import {
    HiOutlineExclamationCircle,
    HiUser,
    HiMail,
    HiOfficeBuilding,
    HiArrowLeft,
    HiUpload,
    HiPencil,
    HiSave,
    HiIdentification,
    HiOutlineCake
} from "react-icons/hi";
import {
    FaUserAlt,
    FaRegCommentDots,
    FaUserCheck,
    FaUserSlash,
    FaUserEdit,
    FaTransgender,
    FaMale,
    FaFemale
} from "react-icons/fa";
import { BsFilePost, BsCalendarDate } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { SlLogin } from "react-icons/sl";
import { useAuthContext } from "../../hooks/useAuthContext";
import api from "../../lib/axios";

const UserDisplay = () => {

    const { user } = useAuthContext()
    const navigate = useNavigate();
    const { id } = useParams();

    // User data states
    const [userData, setUserData] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        isActive: false,
        image: '',
        role: '',
        createdAt: '',
        lastLogin: ''
    });

    const [postsCount, setPostCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    // UI states
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState({});

    // Fetch user data
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/user/${id}`);
            const user = res.data.user;

            setUserData({
                email: user.email || '',
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                age: user.age || '',
                gender: user.gender || '',
                isActive: user.isActive || false,
                image: user.image || '',
                role: user.role || '',
                createdAt: user.createdAt || '',
                lastLogin: user.lastLogin || ''
            });

            setEditedUserData({
                email: user.email || '',
                username: user.username || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                age: user.age || '',
                gender: user.gender || ''
            });

            setPostCount(res.data.postsCount || 0);
            setCommentCount(res.data.commentCount || 0);
        } catch (err) {
            console.error('Error fetching user data:', err);
            toast.error('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    // Handle image change
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
        }
    };

    // Upload new image
    const handleImageUpload = async () => {
        if (!newImage) return;

        setImageUploading(true);
        const formData = new FormData();
        formData.append('image', newImage);
        formData.append('userId', id);

        try {
            const response = await api.post('/admin/user/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUserData(prev => ({
                ...prev,
                image: response.data.image
            }));

            toast.success('Profile image updated successfully');
            setNewImage(null);
        } catch (error) {
            console.error('Error uploading image', error);
            toast.error('Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    // Toggle user active status
    const handleToggleStatus = async () => {
        setOpenModal(false);
        setLoading(true);

        try {
            await api.put(`/admin/user/toggle-status/${id}`);

            fetchUserData();
            toast.success(`User ${userData.isActive ? 'deactivated' : 'activated'} successfully`);
        } catch (err) {
            console.error('Error toggling user status:', err);
            toast.error('Failed to update user status');
        } finally {
            setLoading(false);
        }
    };

    // Handle confirmation modal
    const handleConfirmModal = () => {
        setOpenModal(true);
    };

    // Toggle edit mode
    const handleToggleEdit = () => {
        if (isEditing) {
            // Cancel editing
            setEditedUserData({
                email: userData.email,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                age: userData.age,
                gender: userData.gender
            });
        }
        setIsEditing(!isEditing);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save user data
    const handleSaveUser = async () => {
        setLoading(true);

        try {
            await api.put(`/admin/user/update/${id}`, editedUserData);

            setUserData(prev => ({
                ...prev,
                ...editedUserData
            }));

            setIsEditing(false);
            toast.success('User information updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user information');
        } finally {
            setLoading(false);
        }
    };

    // Get gender icon
    const getGenderIcon = () => {
        if (userData.gender?.toLowerCase() === 'female') {
            return <FaFemale className="text-pink-500" />;
        } else if (userData.gender?.toLowerCase() === 'male') {
            return <FaMale className="text-blue-500" />;
        } else {
            return <FaTransgender className="text-purple-500" />;
        }
    };

    return (
        <AdminDrawer>
            <AdminNavbar />

            <div className="p-10 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <FaUserAlt className="text-3xl text-primary mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="btn btn-outline btn-sm gap-1"
                            onClick={() => navigate('/admin/user')}
                        >
                            <HiArrowLeft /> Back to Users
                        </button>

                        <button
                            className={`btn btn-sm gap-1 ${isEditing ? 'btn-warning' : 'btn-info'} text-white`}
                            onClick={handleToggleEdit}
                            disabled={loading || user.id !== id}
                        >
                            {isEditing ? (
                                <>
                                    <HiOutlineExclamationCircle /> Cancel Edit
                                </>
                            ) : (
                                <>
                                    <FaUserEdit /> Edit Profile
                                </>
                            )}
                        </button>

                        {isEditing && (
                            <button
                                className="btn btn-success btn-sm gap-1 text-white"
                                onClick={handleSaveUser}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        <HiSave /> Save Changes
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            className={`btn btn-sm gap-1 ${userData.isActive ? 'btn-error' : 'btn-success'} text-white`}
                            onClick={handleConfirmModal}
                            disabled={loading || user.id === id}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : userData.isActive ? (
                                <>
                                    <FaUserSlash /> Deactivate
                                </>
                            ) : (
                                <>
                                    <FaUserCheck /> Activate
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* User Profile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Profile Picture and Stats */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Status Badge */}
                            <div className="w-full flex justify-end p-2">
                                <div className={`badge ${userData.isActive ? 'badge-success' : 'badge-error'} gap-1`}>
                                    {userData.isActive ? (
                                        <>
                                            <FaUserCheck className="w-3 h-3" /> Active
                                        </>
                                    ) : (
                                        <>
                                            <FaUserSlash className="w-3 h-3" /> Inactive
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Profile Image */}
                            <div className="flex flex-col items-center p-6">
                                <div className="avatar">
                                    <div className="w-40 h-40 rounded-full shadow-lg ring-2 ring-primary ring-offset-2">
                                        <img
                                            src={userData.image ? userData.image : 'https://ui-avatars.com/api/?name=' + userData.username}
                                            alt={`${userData.username}'s avatar`}

                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <h2 className="text-2xl font-bold">{userData.username}</h2>
                                    <p className="text-sm text-gray-500">
                                        {userData.role === 'admin' ? 'Administrator' : 'User'}
                                    </p>
                                </div>

                                {/* Profile Image Upload */}
                                <div className="mt-4 w-full">
                                    <div className="flex flex-wrap gap-2">
                                        <input
                                            type="file"
                                            className="file-input file-input-bordered file-input-sm w-full"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <button
                                            className="btn btn-sm btn-primary w-full gap-1 mt-2"
                                            onClick={handleImageUpload}
                                            disabled={!newImage || imageUploading}
                                        >
                                            {imageUploading ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <>
                                                    <HiUpload className="w-4 h-4" /> Update Profile Image
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* User Stats */}
                            <div className="px-6 pb-6">
                                <div className="stats stats-vertical w-full shadow bg-base-200">
                                    <div className="stat">
                                        <div className="stat-figure text-primary">
                                            <BsFilePost size={24} />
                                        </div>
                                        <div className="stat-title">Posts</div>
                                        <div className="stat-value text-primary">{postsCount}</div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-figure text-secondary">
                                            <FaRegCommentDots size={24} />
                                        </div>
                                        <div className="stat-title">Comments</div>
                                        <div className="stat-value text-secondary">{commentCount}</div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-figure text-info">
                                            <SlLogin size={24} />
                                        </div>
                                        <div className="stat-title">Last Login</div>
                                        <div className="stat-desc text-info font-medium">
                                            {userData.lastLogin ? moment(userData.lastLogin).format("MMMM D, YYYY h:mm A") : 'Never logged in'}
                                        </div>
                                    </div>

                                    <div className="stat">
                                        <div className="stat-figure text-info">
                                            <MdDateRange size={24} />
                                        </div>
                                        <div className="stat-title">Member Since</div>
                                        <div className="stat-desc text-info font-medium">
                                            {userData.createdAt ? moment(userData.createdAt).format("MMMM D, YYYY") : 'Unknown'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - User Information */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <HiIdentification /> User Information
                            </h3>

                            <div className="divider"></div>

                            <div className="space-y-4">
                                {/* Username */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-2">
                                            <HiUser className="text-gray-500" /> Username
                                        </span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="username"
                                            className="input input-bordered bg-base-100"
                                            value={editedUserData.username || ''}
                                            disabled
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div className="bg-base-200 p-3 rounded-md">
                                            {userData.username || 'Not specified'}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-2">
                                            <HiMail className="text-gray-500" /> Email Address
                                        </span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            className="input input-bordered bg-base-100"
                                            value={editedUserData.email || ''}
                                            disabled
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div className="bg-base-200 p-3 rounded-md">
                                            {userData.email || 'Not specified'}
                                        </div>
                                    )}
                                </div>

                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-2">
                                                <HiOfficeBuilding className="text-gray-500" /> First Name
                                            </span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="firstName"
                                                className="input input-bordered bg-base-100"
                                                value={editedUserData.firstName || ''}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <div className="bg-base-200 p-3 rounded-md">
                                                {userData.firstName || 'Not specified'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-2">
                                                <HiOfficeBuilding className="text-gray-500" /> Last Name
                                            </span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="input input-bordered bg-base-100"
                                                value={editedUserData.lastName || ''}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <div className="bg-base-200 p-3 rounded-md">
                                                {userData.lastName || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Age & Gender */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-2">
                                                <HiOutlineCake className="text-gray-500" /> Age
                                            </span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="age"
                                                className="input input-bordered bg-base-100"
                                                value={editedUserData.age || ''}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <div className="bg-base-200 p-3 rounded-md">
                                                {userData.age || 'Not specified'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-2">
                                                {getGenderIcon()} Gender
                                            </span>
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="gender"
                                                className="select select-bordered bg-base-100"
                                                value={editedUserData.gender || ''}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        ) : (
                                            <div className="bg-base-200 p-3 rounded-md flex items-center gap-2">
                                                {getGenderIcon()} {userData.gender || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                                    <BsCalendarDate /> Account History
                                </h3>

                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <tbody>
                                            <tr>
                                                <td className="font-semibold w-1/3">Account Created</td>
                                                <td>
                                                    {userData.createdAt ?
                                                        moment(userData.createdAt).format("MMMM D, YYYY h:mm A") :
                                                        'Unknown'
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-semibold">Last Login</td>
                                                <td>
                                                    {userData.lastLogin ?
                                                        moment(userData.lastLogin).format("MMMM D, YYYY h:mm A") :
                                                        'Never logged in'
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-semibold">Account Status</td>
                                                <td>
                                                    <div className={`badge ${userData.isActive ? 'badge-success' : 'badge-error'} gap-1`}>
                                                        {userData.isActive ? 'Active' : 'Inactive'}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-semibold">User Role</td>
                                                <td>
                                                    <div className="badge badge-neutral">
                                                        {userData.role || 'User'}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to {userData.isActive ? 'deactivate' : 'activate'} this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color={userData.isActive ? "failure" : "success"}
                                onClick={handleToggleStatus}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    `Yes, ${userData.isActive ? 'deactivate' : 'activate'} user`
                                )}
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </AdminDrawer>
    );
};

export default UserDisplay;