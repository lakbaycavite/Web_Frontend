import { usePostsContext } from "../../hooks/usePostsContext";

import axios from 'axios'
import { useState, useEffect, useRef } from "react"
import { useAuthContext } from "../../hooks/useAuthContext";

const CreatePostModal = ({ Pvisible, onClose, onSuccess, handleEventAdded }) => {

    const { dispatch } = usePostsContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageURL, setImageURL] = useState('')

    //validators
    const [errorMessageTitle, setErrorMessageTitle] = useState('')
    const [errorMessageContent, setErrorMessageContent] = useState('')

    const modalRef = useRef(null);

    useEffect(() => {
        if (!modalRef.current) {
            return;
        }
        Pvisible ? modalRef.current.showModal() : modalRef.current.close();
    }, [Pvisible]);

    const handleClose = () => {
        setTitle('')
        setContent('')
        setErrorMessageTitle(false)
        setErrorMessageContent(false)

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

    const handlePost = async (e) => {

        const post = {
            title,
            content,
            user,
            imageURL,
        }

        await axios.post("http://localhost:4000/admin/post", post, {
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then((response) => {
                console.log(response.data);
                handleClose()
                handleSuccess()
                handleEventAdded()
                setTitle('')
                setContent('')
                setImageURL('')

                dispatch({ type: 'CREATE_POST', payload: response.data })
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
        } else if (value.length == 100) {
            setErrorMessageTitle('Input invalid.');
            return false;
        } else {
            setErrorMessageTitle('');
            return true;
        }
    };
    const validateInputContent = (value) => {
        if (!value) {
            setErrorMessageContent('Input invalid.');
            return false;
        } else if (value.length == 20) {
            setErrorMessageContent('Input invalid.');
            return false;
        } else {
            setErrorMessageContent('');
            return true;
        }
    };


    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 100) {
            setTitle(value);
            validateInputTitle(value);
        }
    };

    const handleContentChange = (e) => {
        const value = e.target.value;
        if (value.length <= 1000) {
            setContent(value)
            validateInputContent(value);
        }
    };

    return (
        <>
            <dialog ref={modalRef} id="my_modal_1" className="modal" onCancel={handleESC}>
                <div className="modal-box relative max-w-none w-[50rem] flex justify-center items-center bg-base-300">
                    <form method="dialog">
                        <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <div className="w-full h-full">
                        {/* Header */}
                        <div className="w-full h-12 flex justify-center items-center">
                            <h3 className="font-bold text-lg">Create Post</h3>
                        </div>
                        {/* text input */}
                        <div className="w-full h-16 rounded-md flex justify-center items-center mt-5">
                            <label className={`input w-full input-bordered flex hover:shadow items-center gap-2 ${errorMessageTitle && 'input-error'}`}>
                                <input type='text' className='input grow input-md' value={title} placeholder="Type your title here..." onChange={handleTitleChange} />
                                {errorMessageTitle && <p className='text-error text-sm'>{errorMessageTitle}</p>}
                            </label>
                        </div>
                        <div className="w-full h-72 rounded-lg flex flex-col bg-white">
                            <div className="w-full h-5/6 rounded-xl">
                                <textarea className={`textarea w-full h-full ${errorMessageContent && 'textarea-error'}`} placeholder="Ask your inquiries here..." value={content} onChange={handleContentChange}></textarea>
                            </div>

                        </div>

                        <div className="w-full h-1/6 rounded-lg flex flex-row justify-between mt-5">
                            <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={(e) => setImageURL(e.target.files[0])} />
                        </div>
                        {/* buttons */}
                        <div className="w-full h-8 mt-5 rounded-md flex justify-end">
                            <div className="w-[16rem] h-full flex justify-between">
                                <button onClick={handleClose} className="btn btn-sm w-28"> Cancel </button>
                                <button className={`btn btn-sm btn-success text-white w-28 ${!title || !content || errorMessageTitle || errorMessageContent ? 'btn-disabled' : ''}`} onClick={handlePost}> Post </button>
                            </div>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop" onClick={handleClose}>
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default CreatePostModal