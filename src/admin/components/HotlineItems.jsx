import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useHotlineContext } from "../../hooks/useHotlineContext";
import { useToast } from "../../hooks/useToast";

// Icons
import {
    HiOutlineExclamationCircle,
    HiOutlinePencil,
    HiPhone,
    HiTrash,
    HiCheck,
    HiX
} from "react-icons/hi";
import { FaFire, FaAmbulance, FaShieldAlt, FaExclamationTriangle, FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const HotlineItems = (props) => {
    const { user } = useAuthContext();
    const { dispatch } = useHotlineContext();
    const toast = useToast();
    const { setRefreshTrigger } = props;

    // States
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: props.name,
        number: props.number,
        location: props.location || "",
        category: props.category
    });
    const [error, setError] = useState("");

    // Categories
    const categories = ['Fire', 'Police', 'Ambulance/ Medical', 'Disaster Response', 'Others'];

    // Get category icon
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Fire': return <FaFire className="text-red-500" />;
            case 'Police': return <FaShieldAlt className="text-blue-500" />;
            case 'Ambulance/ Medical': return <FaAmbulance className="text-green-500" />;
            case 'Disaster Response': return <FaExclamationTriangle className="text-yellow-500" />;
            default: return <FaPhoneAlt className="text-gray-500" />;
        }
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'number') {
            if (value === '' || (/^[0-9()-]+$/.test(value) && value.length <= 15)) {
                setFormData({ ...formData, [name]: value });
                setError("");
            } else if (value.length > 15) {
                setError("Maximum 15 characters allowed");
            } else {
                setError("Please enter only numbers, hyphens, and parentheses");
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Toggle edit mode
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Save edited hotline
    const handleSave = async (id) => {
        if (error) return;

        setLoading(true);
        try {
            await axios.put(`http://localhost:4000/admin/hotline/update/${id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            dispatch({ type: "UPDATE_HOTLINE", payload: { _id: id, ...formData } });
            toast("Contact updated successfully", "success");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating hotline:", error);
            toast("Failed to update contact", "error");
        } finally {
            setLoading(false);
        }
    };

    // Delete hotline
    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:4000/admin/hotline/delete/${id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            dispatch({ type: "DELETE_HOTLINE", payload: { _id: id } });
            setRefreshTrigger(prev => prev + 1);
            toast("Contact deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting hotline:", error);
            toast("Failed to delete contact", "error");
        } finally {
            setLoading(false);
            setOpenModal(false);
        }
    };

    return (
        <tr key={props.index} className="hover:bg-base-200 transition-colors duration-150">
            <td className="pl-2">
                <div className="flex justify-center">
                    {getCategoryIcon(props.category)}
                </div>
            </td>

            <td>
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-full bg-base-100"
                    />
                ) : (
                    <div className="font-medium">{formData.name}</div>
                )}
            </td>

            <td>
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            name="number"
                            placeholder="Enter number"
                            value={formData.number}
                            onChange={handleChange}
                            className={`input input-bordered input-sm w-full bg-base-100 ${error ? 'input-error' : ''}`}
                        />
                        {error && <p className="text-error text-xs mt-1">{error}</p>}
                    </div>
                ) : (
                    <div className="font-mono">{formData.number}</div>
                )}
            </td>

            <td>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <MdLocationOn className="text-gray-400" />
                        <input
                            type="text"
                            name="location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={handleChange}
                            className="input input-bordered input-sm w-full bg-base-100"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        {formData.location ? (
                            <>
                                <MdLocationOn className="text-gray-500" />
                                <span>{formData.location}</span>
                            </>
                        ) : (
                            <span className="text-gray-400 italic">No location</span>
                        )}
                    </div>
                )}
            </td>

            <td>
                {isEditing ? (
                    <select
                        name="category"
                        value={formData.category}
                        defaultValue={formData.category}
                        onChange={handleChange}
                        className="select select-bordered select-sm w-full bg-base-100"
                    >
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className={`badge ${formData.category === 'Fire' ? 'badge-error' :
                            formData.category === 'Police' ? 'badge-info' :
                                formData.category === 'Ambulance/ Medical' ? 'badge-success' :
                                    formData.category === 'Disaster Response' ? 'badge-warning' :
                                        'badge-ghost'
                            } gap-1`}>
                            {getCategoryIcon(formData.category)}
                            {formData.category}
                        </div>
                    </div>
                )}
            </td>

            <td>
                <div className="flex justify-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                className="btn btn-sm btn-success text-white gap-1"
                                onClick={() => handleSave(props.id)}
                                disabled={loading || !formData.name || !formData.number || !formData.category || !!error}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <>
                                        <HiCheck className="w-4 h-4" /> Save
                                    </>
                                )}
                            </button>
                            <button
                                className="btn btn-sm btn-ghost gap-1"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        name: props.name,
                                        number: props.number,
                                        location: props.location || "",
                                        category: props.category
                                    });
                                    setError("");
                                }}
                            >
                                <HiX className="w-4 h-4" /> Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn btn-sm btn-info text-white gap-1"
                                onClick={handleEdit}
                            >
                                <HiOutlinePencil className="w-4 h-4" /> Edit
                            </button>
                            <button
                                className="btn btn-sm btn-error text-white gap-1"
                                onClick={() => setOpenModal(true)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <>
                                        <HiTrash className="w-4 h-4" /> Delete
                                    </>
                                )}
                            </button>
                        </>
                    )}
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
                            Are you sure you want to delete <span className="font-semibold">{props.name}</span>?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => handleDelete(props.id)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    "Yes, delete it"
                                )}
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
        </tr>
    );
};

export default HotlineItems;