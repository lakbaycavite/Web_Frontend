import { FaImage } from "react-icons/fa6";
import { CgAttachment } from "react-icons/cg";
import { MdEmojiEmotions } from "react-icons/md";
import { useEventsContext } from "../../hooks/useEventsContext";

import axios from 'axios'
import { useState, useEffect, useRef } from "react"

const CreateEvent = ({ visible, onClose, onSuccess, handleEventAdded }) => {

    const { dispatch } = useEventsContext()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [attachments, setAttachments] = useState('')

    const [imagePreview, setImagePreview] = useState('')
    //validators
    const [errorMessageTitle, setErrorMessageTitle] = useState('')
    const [errorMessageDesc, setErrorMessageDesc] = useState('')
    const modalRef = useRef(null);

    //file upload

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setAttachments(file)

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        if (file) {
            reader.readAsDataURL(file); // Convert image to base64 URL
        }
    };
WQ

    useEffect(() => {
        if (!modalRef.current) {
            return;
        }
        visible ? modalRef.current.showModal() : modalRef.current.close();
    }, [visible]);

    const handleClose = () => {
        setTitle('')
        setDescription('')
        setErrorMessageTitle(false)
        setErrorMessageDesc(false)

        if (onClose) {
            onClose();
        }
    }

    const handleESC = (event) => {
        event.preventDefault();
        handleClose();
    }

    const handleSuccess = () => {
        onSuccess(true)
    }

    const handlePost = async () => {
        // e.preventDefault()

        const event = {
            title,
            description,
            attachments,
        }

        await axios.post("http://localhost:4000/admin/event", event, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                console.log(response.data);
                handleClose()
                handleSuccess()
                handleEventAdded()
                dispatch({ type: 'CREATE_EVENT', payload: response.data })
                setTitle('')
                setDescription('')
                setAttachments('')
            })
            .catch((err) => {
                console.log(post);
                console.log(err)
            })

    }

    // input validations
    const validateInputTitle = (value) => {
        if (!value) {
            setErrorMessageTitle('Input invalid.');
            return false;
        } else if (value.length == 40) {
            setErrorMessageTitle('Input invalid.');
            return false;
        } else {
            setErrorMessageTitle('');
            return true;
        }
    };
    const validateInputDesc = (value) => {
        if (!value) {
            setErrorMessageDesc('Input invalid.');
            return false;
        } else if (value.length == 20) {
            setErrorMessageDesc('Input invalid.');
            return false;
        } else {
            setErrorMessageDesc('');
            return true;
        }
    };


    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 40) {
            setTitle(value);
            validateInputTitle(value);
        }
    };

    const handleDescChange = (e) => {
        const value = e.target.value;
        if (value.length <= 1000) {
            setDescription(value)
            validateInputDesc(value);
        }
    };




    return (
        <>

            <dialog ref={modalRef} id="my_modal_1" className="modal " onCancel={handleESC} >


                <div className="modal-box relative max-w-none w-[50rem] flex justify-center items-center bg-base-300">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    {/* <p className="">Press ESC key or click on ✕ button to close</p> */}
                    <div className="w-full h-full">
                        {/* Header */}
                        <div className="w-full h-12 flex justify-center items-center">
                            <h3 className="font-bold text-lg">Create Event</h3>
                        </div>
                        {/* text input */}
                        <div className="w-full h-16 rounded-md flex justify-center items-center mt-5">
                            <label className={`input w-full input-bordered flex hover:shadow items-center gap-2 ${errorMessageTitle && 'input-error'}`}>
                                <input type='text' className='input grow input-md' value={title} placeholder="Type your title here..." onChange={handleTitleChange} />
                                {errorMessageTitle && <p className='text-error text-sm'>{errorMessageTitle}</p>}
                            </label>

                        </div>
                        <div className="w-full h-48 rounded-lg flex flex-col bg-white">
                            <div className="w-full h-5/6 rounded-xl">
                                <textarea className={`textarea w-full h-full ${errorMessageDesc && 'textarea-error'}`} placeholder="Event description..." value={description} onChange={handleDescChange}></textarea>
                            </div>
                            <div className="w-full h-1/6 rounded-lg flex flex-row justify-between">
                                <div className="w-full h-full flex items-center justify-center rounded-lg">

                                </div>
                                <div className="w-16 h-full flex items-center justify-center rounded-lg">

                                </div>
                            </div>
                        </div>
                        {/* attachments */}
                        <div className="w-full h-40 bg-white mt-5 rounded-md flex justify-center items-center ">
                            <div className="w-1/2 h-full flex flex-col justify-start items-start">
                                {/* <input type="file" className="w-64 h-12" accept="image/*" onChange={handleFileChange} /> */}
                                <div className="max-w-xs ">
                                    <input id="example1" type="file" accept="image/*" onChange={handleFileChange} className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" />
                                </div>
                                <div className="max-w-xs ">
                                    <label>Start Date: </label> <input id="example1" type="date" className="mt-5 bg-base-300" />
                                </div>
                                <div className="max-w-xs ">
                                    <label>End Date: </label><input id="example1" type="date" className="mt-5 bg-base-300" />
                                </div>
                            </div>
                            <div className="w-1/2 h-full flex justify-center items-center">
                                {imagePreview && (
                                    <button className="btn btn-ghost h-full w-1/2" onClick={() => document.getElementById('my_modal_4').showModal()}>
                                        <div className="avatar">
                                            <div className="rounded-xl h-40 w-40">
                                                <img className="h-full w-full rounded-xl" src={imagePreview} alt="Preview" />
                                            </div>
                                        </div>
                                    </button>
                                )}

                            </div>
                        </div>
                        {/* buttons */}
                        <div className="w-full h-8 mt-5 rounded-md flex justify-end">
                            <div className="w-[16rem] h-full flex justify-between">
                                <button onClick={handleClose} className="btn btn-sm w-28"> Cancel </button>
                                <button className={`btn btn-sm btn-success text-white w-28 ${!title || !description || errorMessageTitle || errorMessageDesc ? 'btn-disabled' : ''}`} onClick={() => { handlePost() }}> Post </button>
                            </div>
                        </div>
                    </div>
                </div>


                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-[42rem] max-w-5xl">
                        <div className="h-full w-full">
                            <h3 className="font-bold text-lg mb-10">Image Preview</h3>
                            <div className="avatar flex justify-center items-center">
                                <div className="rounded-xl h-[30rem]">
                                    <img className="h-full w-full rounded-xl" src={imagePreview} alt={`avatar`} />
                                </div>
                            </div>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </dialog>

                <form method="dialog" className="modal-backdrop" onClick={handleClose}>
                    <button>close</button>
                </form>
            </dialog>

        </>
    )
}

export default CreateEvent