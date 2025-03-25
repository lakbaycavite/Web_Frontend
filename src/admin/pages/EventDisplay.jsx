// import { FaImage } from "react-icons/fa6";
// import { CgAttachment } from "react-icons/cg";
// import { MdEmojiEmotions } from "react-icons/md";
// import { FaRegCheckCircle } from "react-icons/fa";

// import axios from 'axios'
// import { useState, useEffect, useRef } from "react"
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { usePostsContext } from "../../hooks/usePostsContext";

// import { Button, Modal } from "flowbite-react";
// import { HiOutlineExclamationCircle } from "react-icons/hi";
// import moment from "moment";

// const EventDisplay = () => {

//     const { id } = useParams()
//     const { dispatch } = usePostsContext()


//     const navigate = useNavigate()

//     const [title, setTitle] = useState('')
//     const [description, setDescription] = useState('')
//     const [user, setUser] = useState('')
//     const [attachments, setAttachments] = useState('')
//     const [userId, setUserId] = useState('')

//     const [success, setSuccess] = useState(false)
//     const [deleted, setDeleted] = useState(false)
//     const [openModal, setOpenModal] = useState(false)
//     const [createdAt, setCreatedAt] = useState('')

//     const [loading, setLoading] = useState(false)

//     const [isNotEditable, setIsNotEditable] = useState(true)

//     // file

//     // const handleFileChange = (e) => {
//     //     const file = e.target.files[0]
//     //     setAttachments(file)

//     //     const reader = new FileReader()
//     //     reader.onloadend = () => {
//     //         setImagePreview(reader.result)
//     //     }
//     //     if (file) {
//     //         reader.readAsDataURL(file); // Convert image to base64 URL
//     //     }
//     // };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0]
//         setAttachments(file)

//         const reader = new FileReader()
//         reader.onloadend = () => {
//             setImagePreview(reader.result)
//         }
//         if (file) {
//             reader.readAsDataURL(file); // Convert image to base64 URL
//         }
//     };


//     const handleBack = () => {
//         navigate('/admin/event')
//     }

//     const handleEdit = () => {
//         setIsNotEditable(false)
//     }

//     const handleCancel = () => {
//         setIsNotEditable(true)
//     }

//     const handleSuccess = () => {
//         setSuccess(true)
//         setTimeout(() => {
//             setSuccess(false)
//         }, 3000)
//     }

//     const handleDeletePopup = () => {
//         setDeleted(true)
//         setLoading(true)
//         setTimeout(() => {
//             setDeleted(false)
//             navigate('/admin/event')
//         }, 1000)
//     }

//     useEffect(() => {
//         axios.get('http://localhost:4000/admin/event/' + id)
//             .then((res) => {
//                 console.log(res.data)
//                 setTitle(res.data.title)
//                 setDescription(res.data.description)
//                 setUser(res.data.user)
//                 setAttachments(res.data.attachments)
//                 setUserId(res.data._id)
//                 setCreatedAt(res.data.createdAt)

//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//     }, [])

//     const handleUpdate = async (id) => {
//         setLoading(true)
//         // e.preventDefault()
//         const event = {
//             title,
//             description,
//             user,
//             attachments,
//         }

//         await axios.put("http://localhost:4000/admin/event/update/" + id, event)

//             .then((response) => {
//                 console.log(response.data)
//                 handleSuccess()
//                 dispatch({ type: 'UPDATE_EVENT', payload: response.data })
//             })
//             .catch((err) => {
//                 console.log(post)
//                 console.log(err)
//             })
//     }

//     const handleDelete = (id) => {
//         setOpenModal(false)
//         axios.delete("http://localhost:4000/admin/event/delete/" + id)
//             .then((response) => {
//                 console.log(response);
//                 dispatch({ type: 'DELETE_EVENT', payload: response.data })
//                 handleDeletePopup()
//             })
//             .catch((err) => {
//                 console.log(err);
//             })
//     }

//     const handleConfirmModal = () => {
//         setOpenModal(true)
//     }

//     return (
//         <>
//             {/* success */}
//             <div className={`toast toast-top toast-end transition duration-300 ${success ? 'opacity-100' : 'opacity-0'}`}>
//                 <div className="alert alert-info">
//                     <FaRegCheckCircle style={{ color: 'white' }} />
//                     <span className='text-white'> Post updated successfully.</span>
//                 </div>
//             </div>
//             {/* delete */}
//             <div className={`toast toast-top toast-end transition duration-300 ${deleted ? 'opacity-100' : 'opacity-0'}`}>
//                 <div className="alert alert-error">
//                     <FaRegCheckCircle style={{ color: 'white' }} />
//                     <span className='text-white'> Event deleted successfully.</span>
//                 </div>
//             </div>

//             <div className="hero min-h-screen flex justify-center items-center">
//                 <div className="w-[50rem] h-[45rem] bg-base-300 p-10 flex flex-col justify-between rounded-xl">
//                     {/* avatar */}
//                     <div className="w-full h-1/5 flex flex-row">
//                         <div className="w-[10rem] h-full flex justify-center items-center">
//                             <div className="avatar">
//                                 <div className="w-24 rounded-full">
//                                     <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//                                 </div>
//                             </div>
//                         </div>
//                         {/* profile deets */}
//                         <div className="w-full h-full flex justify-center items-center">
//                             {/* deets */}
//                             <div className="w-3/5 h-24 flex flex-col justify-center items-start">
//                                 <div>
//                                     <p className="text-gray-500">User: <label className="text-primary">Alex Gonzaga</label></p>
//                                 </div>
//                                 <div>
//                                     <p className="text-gray-500">Created: <label className="text-primary">{moment(createdAt).format("MMMM D, YYYY")}</label></p>
//                                 </div>
//                             </div>

//                             {/* button */}
//                             <div className="w-2/5 h-24 flex justify-center items-center">
//                                 <button className={`btn btn-error text-white w-32 ${loading ? 'btn-disabled' : ''}`} onClick={() => { handleConfirmModal() }}>
//                                     {loading ? (<span className="loading loading-spinner loading-md"></span>) : 'Delete'}
//                                 </button>
//                             </div>
//                             {isNotEditable ? (
//                                 <div className="w-2/5 h-24 flex justify-center items-center">
//                                     <button className={`btn btn-info text-white w-32 ${loading ? 'btn-disabled' : ''}`} onClick={() => { handleEdit() }}> Edit </button>
//                                 </div>
//                             ) : (
//                                 <div className="w-2/5 h-24 flex justify-center items-center">
//                                     <button className={`btn ${!isNotEditable ? 'btn-outline' : ''} text-white w-32 btn-info`} onClick={() => { handleCancel() }}> Cancel </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* post */}
//                     <div className="w-full h-4/5">

//                         {/* text input */}
//                         <div className="w-full h-16 rounded-md flex justify-center items-center mt-5">
//                             <input type="text" placeholder="Type your title here..." className={`input w-full input-md ${isNotEditable ? 'btn-disabled' : ''}`} value={title || ''} onChange={(e) => setTitle(e.target.value)} />
//                         </div>
//                         <div className="w-full h-48 rounded-lg flex flex-col bg-white">
//                             <div className="w-full h-5/6 rounded-xl">
//                                 <textarea className={`textarea w-full h-full ${isNotEditable ? 'btn-disabled' : ''}`} placeholder="Ask your inquiries here..." value={description || ''} onChange={(e) => setDescription(e.target.value)} ></textarea>
//                             </div>
//                             <div className="w-full h-1/6 rounded-lg flex flex-row justify-between">
//                                 <div className="w-28 h-full flex items-center justify-evenly rounded-lg">
//                                     <button className="btn btn-ghost btn-sm">
//                                         <FaImage size={20} />
//                                     </button>
//                                     <button className="btn btn-ghost btn-sm">
//                                         <CgAttachment size={20} />
//                                     </button>
//                                 </div>
//                                 <div className="w-16 h-full flex items-center justify-center rounded-lg">
//                                     <button className="btn btn-ghost btn-sm">
//                                         <MdEmojiEmotions size={25} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* attachments */}
//                         <div className="w-full h-40 bg-white mt-5 rounded-md flex justify-center items-center">
//                             {isNotEditable ? (
//                                 <div className="w-full h-full flex justify-center items-center">
//                                     {/* <div className="max-w-xs ">
//                                         <input id="example1" type="file" accept="image/*" onChange={handleFileChange} className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" />
//                                     </div> */}
//                                     {attachments && (
//                                         <button className="btn btn-ghost h-40 w-40" onClick={() => document.getElementById('my_modal_4').showModal()}>
//                                             <div className="avatar">
//                                                 <div className="rounded-xl h-40 w-40">
//                                                     <img className="h-full w-full rounded-xl" src={`http://localhost:4000/uploads/${attachments}`} alt="Preview" />
//                                                 </div>
//                                             </div>
//                                         </button>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="w-full h-full flex flex-col justify-start items-center">
//                                         <div className="max-w-xs">
//                                             <input id="example1" type="file" onClick={handleFileChange} className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" />
//                                         </div>
//                                         <div className="max-w-xs ">
//                                             <label>Start Date: </label> <input id="example1" type="date" className="mt-5 bg-base-300" />
//                                         </div>
//                                         <div className="max-w-xs ">
//                                             <label>End Date: </label><input id="example1" type="date" className="mt-5 bg-base-300" />
//                                         </div>

//                                     </div>
//                                     <div className="w-full h-full flex justify-center items-center">
//                                         {attachments && (
//                                             <button className="btn btn-ghost h-40 w-40" onClick={() => document.getElementById('my_modal_4').showModal()}>
//                                                 <div className="avatar">
//                                                     <div className="rounded-xl h-40 w-40">
//                                                         <img className="h-full w-full rounded-xl" src={`http://localhost:4000/uploads/${attachments}`} alt="Preview" />
//                                                     </div>
//                                                 </div>
//                                             </button>
//                                         )}
//                                     </div>
//                                 </>
//                             )}

//                         </div>
//                         {/* buttons */}
//                         <div className="w-full h-8 mt-5 rounded-md flex justify-end">
//                             <div className="w-[16rem] h-full flex justify-between">
//                                 <button className={`btn btn-sm w-28`} onClick={() => { handleBack() }}> Back </button>
//                                 <button className={`btn btn-sm btn-success text-white w-28 ${isNotEditable ? `btn-disabled` : ``}`} onClick={() => { handleUpdate(userId) }}> Update </button>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//             <dialog id="my_modal_4" className="modal">
//                 <div className="modal-box w-[42rem] max-w-5xl">
//                     <div className="h-full w-full">
//                         <h3 className="font-bold text-lg mb-10">Image Preview</h3>
//                         <div className="avatar flex justify-center items-center">
//                             <div className="rounded-xl h-[30rem]">
//                                 <img className="h-full w-full rounded-xl" src={`http://localhost:4000/uploads/${attachments}`} alt={`avatar`} />
//                             </div>
//                         </div>
//                         <div className="modal-action">
//                             <form method="dialog">
//                                 <button className="btn">Close</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </dialog>
//             <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
//                 <Modal.Header />
//                 <Modal.Body>
//                     <div className="text-center">
//                         <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
//                         <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//                             Are you sure you want to delete this post?
//                         </h3>
//                         <div className="flex justify-center gap-4">
//                             <Button color="failure" onClick={() => handleDelete(id)}>
//                                 {"Yes, I'm sure"}
//                             </Button>
//                             <Button color="gray" onClick={() => setOpenModal(false)}>
//                                 No, cancel
//                             </Button>
//                         </div>
//                     </div>
//                 </Modal.Body>
//             </Modal>
//         </>
//     )
// }

// export default EventDisplay