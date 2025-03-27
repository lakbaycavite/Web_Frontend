import { useEffect, useState } from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { HexColorPicker } from "react-colorful"
import { useNavigate } from 'react-router-dom'
import { useEventsContext } from '../../hooks/useEventsContext'
import { useToast } from '../../hooks/useToast'
import { useAuthContext } from '../../hooks/useAuthContext'

// Components
import AdminDrawer from "../components/AdminDrawer"
import AdminNavbar from "../components/AdminNavbar"

// Icons
import {
    HiCalendar,
    HiPlus,
    HiRefresh,
    HiColorSwatch,
    HiEye,
    HiEyeOff,
    HiPencil,
    HiX,
    HiCheck,
    HiUpload,
    HiTrash,
    HiLocationMarker,
    HiClock
} from "react-icons/hi"
import {
    FaCalendarAlt,
    FaCalendarPlus,
    FaCalendarCheck,
    FaMapMarkerAlt,
    FaImage
} from "react-icons/fa"
import { MdDescription, MdTitle, MdEvent, MdEventAvailable } from "react-icons/md"
import api from '../../lib/axios'

const localizer = momentLocalizer(moment)

const Events = () => {
    const toast = useToast()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const { events, dispatch } = useEventsContext()

    // States for creating a new event
    const [image, setImage] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [view, setView] = useState("month")
    const [color, setColor] = useState("#004aad")
    const [place, setPlace] = useState('')
    const [barangay, setBarangay] = useState('')

    // States for viewing/editing an event
    const [currentId, setCurrentId] = useState(null)
    const [viewTitle, setViewTitle] = useState('')
    const [viewDescription, setViewDescription] = useState('')
    const [viewImage, setViewImage] = useState(null)
    const [viewStart, setViewStart] = useState(null)
    const [viewEnd, setViewEnd] = useState(null)
    const [viewStatus, setViewStatus] = useState(null)
    const [imageToUpdate, setImageToUpdate] = useState(null)
    const [viewColor, setViewColor] = useState(null)
    const [viewPlace, setViewPlace] = useState(null)
    const [viewBarangay, setViewBarangay] = useState(null)

    // UI states
    const [isEditable, setIsEditable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [activeEvents, setActiveEvents] = useState(0)
    const [inactiveEvents, setInactiveEvents] = useState(0)
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'active', 'inactive'

    useEffect(() => {
        fetchEvents()
    }, [refreshKey, filterStatus])

    // Calculate event statistics
    useEffect(() => {
        if (events) {
            const active = events.filter(event => event.isActive).length
            const inactive = events.filter(event => !event.isActive).length
            setActiveEvents(active)
            setInactiveEvents(inactive)
        }
    }, [events])

    // Fetch all events
    const fetchEvents = () => {
        setLoading(true)

        api.get(`/admin/event`)
            .then((response) => {
                let filteredEvents = response.data

                // Apply filter if needed
                if (filterStatus === 'active') {
                    filteredEvents = filteredEvents.filter(event => event.isActive)
                } else if (filterStatus === 'inactive') {
                    filteredEvents = filteredEvents.filter(event => !event.isActive)
                }

                dispatch({ type: 'SET_EVENTS', payload: filteredEvents })
            })
            .catch((error) => {
                console.error("Error fetching events:", error)
                toast("Failed to fetch events", "error")
            })
            .finally(() => setLoading(false))
    }

    // Get random color for events
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF"
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    // Style events in calendar
    const eventStyleGetter = (event) => {
        let backgroundColor = event.isActive ? event.color || "#3174ad" : "gray"
        let style = {
            backgroundColor,
            opacity: event.isActive ? 1 : 0.5,
            color: "white",
            borderRadius: "5px",
            padding: "5px",
            border: "none",
        }
        return { style }
    }

    // Submit new event
    const handleSubmit = () => {
        setLoading(true)
        const newEvent = {
            title,
            description,
            image,
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
            color: color ?? getRandomColor(),
            place,
            barangay
        }

        const formData = new FormData()
        Object.keys(newEvent).forEach(key => {
            formData.append(key, newEvent[key])
        })

        api.post("/admin/event/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then((res) => {
                toast("Event created successfully", "success")
                setRefreshKey(prev => prev + 1)

                // Reset form
                setTitle('')
                setDescription('')
                setImage(null)
                setStart(null)
                setEnd(null)
                setColor("#004aad")
                setPlace('')
                setBarangay('')

                document.getElementById('create_event_modal').close()
            })
            .catch((err) => {
                console.error("Error creating event:", err)
                toast("Failed to create event", "error")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    // Get minimum end time based on start time
    const getMinEndTime = (startTime) => {
        if (!startTime) return ""

        const date = new Date(startTime)
        if (isNaN(date.getTime())) return ""

        date.setMinutes(date.getMinutes() + 1)
        return date.toISOString().slice(0, 16)
    }

    // Get minimum date-time (current time)
    const getMinDateTime = () => {
        const now = new Date()
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        return now.toISOString().slice(0, 16)
    }

    // Fetch a single event
    const fetchOneEvent = async (id) => {
        setLoading(true)
        try {
            const response = await api.get(`/admin/event/${id}`)
            const eventData = response.data

            setCurrentId(eventData._id)
            setViewTitle(eventData.title)
            setViewDescription(eventData.description)
            setViewImage(eventData.image)
            setViewStart(eventData.start)
            setViewEnd(eventData.end)
            setViewColor(eventData.color)
            setViewStatus(eventData.isActive)
            setViewPlace(eventData.place || '')
            setViewBarangay(eventData.barangay || '')
        } catch (error) {
            console.error("Error fetching single event:", error)
            toast("Failed to load event details", "error")
        } finally {
            setLoading(false)
        }
    }

    // Handle click on an event
    const handleClick = async (id) => {
        document.getElementById('view_event_modal').showModal()
        await fetchOneEvent(id)
    }

    // Toggle edit mode
    const handleEditable = () => {
        setIsEditable(!isEditable)
    }

    // Update event
    const handleUpdate = async (id) => {
        setLoading(true)

        try {
            const updatedEvent = {
                title: viewTitle,
                description: viewDescription,
                start: new Date(viewStart).toISOString(),
                end: new Date(viewEnd).toISOString(),
                color: viewColor,
                place: viewPlace,
                barangay: viewBarangay
            }

            const formData = new FormData()
            Object.keys(updatedEvent).forEach(key => {
                formData.append(key, updatedEvent[key])
            })

            await api.put(`/admin/event/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toast("Event updated successfully", "success")
            setRefreshKey(prev => prev + 1)
            document.getElementById('view_event_modal').close()
            setIsEditable(false)
        } catch (error) {
            console.error("Error updating event:", error)
            toast("Failed to update event", "error")
        } finally {
            setLoading(false)
        }
    }

    // Toggle event visibility
    const handleToggleVisibility = (id) => {
        setLoading(true)

        api.post(`/admin/event/toggle-status/${id}`)
            .then(() => {
                setRefreshKey(prev => prev + 1)
                toast(`Event ${viewStatus ? 'hidden' : 'unhidden'} successfully`, "success")
                document.getElementById('view_event_modal').close()
            })
            .catch((err) => {
                console.error("Error toggling event status:", err)
                toast("Failed to update event status", "error")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    // Update event image
    const handleUpdateImage = async (id) => {
        if (!imageToUpdate) return

        setLoading(true)

        const formData = new FormData()
        formData.append('image', imageToUpdate)

        try {
            await api.post(`/admin/event/upload/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            await fetchOneEvent(id)
            toast("Event image updated successfully", "success")
            setImageToUpdate(null)
        } catch (error) {
            console.error("Error updating event image:", error)
            toast("Failed to update event image", "error")
        } finally {
            setLoading(false)
        }
    }

    // Delete event image
    const handleDeleteImage = async (id) => {
        setLoading(true)

        try {
            await api.delete(`/admin/event/delete-image/${id}`)

            await fetchOneEvent(id)
            toast("Event image deleted successfully", "success")
        } catch (error) {
            console.error("Error deleting event image:", error)
            toast("Failed to delete event image", "error")
        } finally {
            setLoading(false)
        }
    }

    // Available barangays
    const barangays = [
        'Alapan I-A', 'Alapan I-B', 'Alapan I-C', 'Alapan II-A', 'Alapan II-B',
        'Anabu I-A', 'Anabu I-B', 'Anabu I-C', 'Anabu I-D', 'Anabu I-E',
        'Anabu I-F', 'Anabu I-G', 'Anabu II-A', 'Anabu II-B', 'Anabu II-C',
        'Anabu II-D', 'Anabu II-E', 'Anabu II-F', 'Bagong Silang (Bahayang Pag-Asa)',
        'Bayan Luma I', 'Bayan Luma II', 'Bayan Luma III', 'Bayan Luma IV',
        'Bayan Luma V', 'Bayan Luma VI', 'Bayan Luma VII', 'Bayan Luma VIII',
        'Bayan Luma IX', 'Bucandala I', 'Bucandala II', 'Bucandala III',
        'Bucandala IV', 'Bucandala V', 'Buhay na Tubig', 'Carsadang Bago I',
        'Carsadang Bago II', 'Magdalo', 'Maharlika', 'Malagasang I-A',
        'Malagasang I-B', 'Malagasang I-C', 'Malagasang I-D', 'Malagasang I-E',
        'Malagasang I-F', 'Malagasang I-G', 'Malagasang II-A', 'Malagasang II-B',
        'Malagasang II-C', 'Malagasang II-D', 'Malagasang II-E', 'Malagasang II-F',
        'Malagasang II-G', 'Mariano Espeleta I', 'Mariano Espeleta II',
        'Mariano Espeleta III', 'Medicion I-A', 'Medicion I-B', 'Medicion I-C',
        'Medicion I-D', 'Medicion II-A', 'Medicion II-B', 'Medicion II-C',
        'Medicion II-D', 'Medicion II-E', 'Medicion II-F', 'Pag-Asa I',
        'Pag-Asa II', 'Pag-Asa III', 'Palico I', 'Palico II', 'Palico III',
        'Palico IV', 'Pasong Buaya I', 'Pasong Buaya II', 'Pinagbuklod',
        'Poblacion I-A', 'Poblacion I-B', 'Poblacion I-C', 'Poblacion II-A',
        'Poblacion II-B', 'Poblacion III-A', 'Poblacion III-B', 'Poblacion IV-A',
        'Poblacion IV-B', 'Poblacion IV-C', 'Poblacion IV-D', 'Tanzang Luma I',
        'Tanzang Luma II', 'Tanzang Luma III', 'Tanzang Luma IV (Southern City)',
        'Tanzang Luma V', 'Tanzang Luma VI', 'Toclong I-A', 'Toclong I-B',
        'Toclong I-C', 'Toclong II-A', 'Toclong II-B'
    ]

    return (
        <AdminDrawer>
            <AdminNavbar />

            <div className="p-10 max-w-8xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <FaCalendarAlt className="text-3xl text-primary mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">Events Calendar</h1>
                    </div>

                    <div className="stats shadow bg-base-100">
                        <div className="stat place-items-center">
                            <div className="stat-title">Total Events</div>
                            <div className="stat-value text-primary">{events?.length || 0}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title flex items-center gap-1">
                                <MdEventAvailable className="text-success" /> Active
                            </div>
                            <div className="stat-value text-success">{activeEvents}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title flex items-center gap-1">
                                <HiEyeOff className="text-error" /> Hidden
                            </div>
                            <div className="stat-value text-error">{inactiveEvents}</div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setFilterStatus('all')}
                            >
                                <FaCalendarAlt className="mr-1" /> All Events
                            </button>
                            <button
                                className={`btn btn-sm ${filterStatus === 'active' ? 'btn-success text-white' : 'btn-outline'}`}
                                onClick={() => setFilterStatus('active')}
                            >
                                <MdEventAvailable className="mr-1" /> Active Events
                            </button>
                            <button
                                className={`btn btn-sm ${filterStatus === 'inactive' ? 'btn-error text-white' : 'btn-outline'}`}
                                onClick={() => setFilterStatus('inactive')}
                            >
                                <HiEyeOff className="mr-1" /> Hidden Events
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => document.getElementById('create_event_modal').showModal()}
                                className="btn btn-primary btn-sm font-normal gap-1 transform transition hover:scale-105"
                            >
                                <FaCalendarPlus className="w-4 h-4" /> Create Event
                            </button>
                            <button
                                onClick={() => setRefreshKey(prev => prev + 1)}
                                className="btn btn-info btn-sm text-white font-normal gap-1 transform transition hover:scale-105"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        <HiRefresh className="w-4 h-4" /> Refresh
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Container */}
                <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                    {loading && !events?.length ? (
                        <div className="w-full p-8 h-[600px] flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <p className="mt-4 text-gray-600">Loading events calendar...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            <Calendar
                                localizer={localizer}
                                events={events || []}
                                startAccessor={(event) => new Date(event.start)}
                                endAccessor={(event) => new Date(event.end)}
                                selectable={true}
                                onSelectEvent={(event) => handleClick(event._id)}
                                onSelectSlot={() => document.getElementById('create_event_modal').showModal()}
                                eventPropGetter={eventStyleGetter}
                                onView={(newView) => setView(newView)}
                                style={{ height: 600 }}
                                className="bg-white rounded-lg shadow-inner"
                                toolbar={true}
                                views={['month', 'week', 'day', 'agenda']}
                                messages={{
                                    agenda: 'List',
                                    day: 'Day',
                                    month: 'Month',
                                    next: 'Next',
                                    previous: 'Back',
                                    today: 'Today',
                                    week: 'Week'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Create Event Modal */}
                <dialog id="create_event_modal" className="modal">
                    <div className="modal-box w-11/12 max-w-4xl">
                        <div className="flex items-center gap-2 mb-4">
                            <FaCalendarPlus className="text-2xl text-primary" />
                            <h3 className="font-bold text-lg">Create New Event</h3>
                        </div>

                        <div className="divider"></div>

                        <div className="space-y-4">
                            {/* Title */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-1">
                                        <MdTitle className="text-gray-500" /> Title
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter event title"
                                    className="input input-bordered w-full"
                                    value={title || ""}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-1">
                                        <MdDescription className="text-gray-500" /> Description
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <textarea
                                    placeholder="Enter event details"
                                    className="textarea textarea-bordered h-24 text-sm w-full"
                                    value={description || ""}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Image */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-1">
                                        <FaImage className="text-gray-500" /> Event Image
                                    </span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        onChange={e => setImage(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-1">
                                        <HiColorSwatch className="text-gray-500" /> Event Color
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <div className="flex flex-col items-center gap-2  w-full">
                                    <HexColorPicker
                                        color={color}
                                        onChange={setColor}
                                        className="w-full h-24"
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <div
                                            className="w-8 h-8 rounded-md shadow-md"
                                            style={{ backgroundColor: color }}
                                        ></div>
                                        <span className="font-mono text-sm">{color}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-1">
                                            <HiLocationMarker className="text-gray-500" /> Place (optional)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter event location"
                                        className="input input-bordered w-full"
                                        value={place}
                                        onChange={(e) => setPlace(e.target.value)}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-gray-500" /> Barangay (optional)
                                        </span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={barangay}
                                        onChange={(e) => setBarangay(e.target.value)}
                                    >
                                        <option value=''>Select a barangay</option>
                                        {barangays.map((brgy, index) => (
                                            <option key={index} value={brgy}>{brgy}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-1">
                                            <HiClock className="text-gray-500" /> Start Date & Time
                                            <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="input input-bordered w-full"
                                        value={start || ""}
                                        onChange={(e) => setStart(e.target.value)}
                                        min={getMinDateTime()}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center gap-1">
                                            <HiClock className="text-gray-500" /> End Date & Time
                                            <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="input input-bordered w-full"
                                        value={end || ""}
                                        onChange={(e) => setEnd(e.target.value)}
                                        min={getMinEndTime(start)}
                                    />
                                </div>
                            </div>

                            {/* Validation Errors */}
                            {start && end && new Date(end) <= new Date(start) && (
                                <div className="alert alert-error shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>End time must be after start time.</span>
                                    </div>
                                </div>
                            )}

                            {start && new Date(start) < new Date() && (
                                <div className="alert alert-warning shadow-lg">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>Start time cannot be in the past.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-action mt-6">
                            <button
                                className="btn btn-ghost gap-1"
                                onClick={() => document.getElementById('create_event_modal').close()}
                            >
                                <HiX className="w-4 h-4" /> Cancel
                            </button>
                            <button
                                className="btn btn-primary gap-1"
                                onClick={handleSubmit}
                                disabled={
                                    loading ||
                                    !start ||
                                    !end ||
                                    !title ||
                                    !description ||
                                    !color ||
                                    new Date(end) <= new Date(start) ||
                                    new Date(start) < new Date()
                                }
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        <FaCalendarPlus className="w-4 h-4" /> Create Event
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                {/* View/Edit Event Modal */}
                <dialog id="view_event_modal" className="modal">
                    <div className="modal-box w-11/12 max-w-3xl">
                        {/* Event Status Badge */}
                        <div className="absolute bottom-4 left-4">
                            {viewStatus !== null && !isEditable && (
                                <div className={`badge ${viewStatus ? 'badge-success' : 'badge-error'} gap-1 text0`}>
                                    {viewStatus ? (
                                        <>
                                            <MdEventAvailable className="w-3 h-3" /> Active
                                        </>
                                    ) : (
                                        <>
                                            <HiEyeOff className="w-3 h-3" /> Hidden
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Event Image */}
                        {viewImage && (
                            <div className='w-full mb-5 overflow-hidden rounded-lg'>
                                <div className="relative">
                                    <img
                                        src={viewImage}
                                        alt="Event"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Image Upload/Delete Controls */}
                        {isEditable && (
                            <div className='bg-base-200 p-3 rounded-lg mb-4'>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium flex items-center gap-1">
                                        <FaImage /> Event Image:
                                    </span>
                                    <input
                                        type="file"
                                        className="file-input file-input-sm file-input-bordered flex-grow"
                                        onChange={e => setImageToUpdate(e.target.files[0])}
                                    />

                                    <div className="flex gap-2 ml-auto">
                                        <button
                                            className='btn btn-sm btn-error gap-1'
                                            onClick={() => handleDeleteImage(currentId)}
                                            disabled={!viewImage || loading}
                                        >
                                            <HiTrash className="w-4 h-4" /> Delete
                                        </button>
                                        <button
                                            className='btn btn-sm btn-success gap-1'
                                            onClick={() => handleUpdateImage(currentId)}
                                            disabled={!imageToUpdate || loading}
                                        >
                                            <HiUpload className="w-4 h-4" /> Upload
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Event Title */}
                        {!isEditable ? (
                            <h3
                                className="text-xl font-bold"
                                style={{ color: viewColor || "#333" }}
                            >
                                {viewTitle}
                            </h3>
                        ) : (
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-1">
                                        <MdTitle /> Title
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={viewTitle}
                                    onChange={(e) => setViewTitle(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Event Description */}
                        {!isEditable ? (
                            <div className="mt-3 text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                {viewDescription}
                            </div>
                        ) : (
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-1">
                                        <MdDescription /> Description
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24 w-full"
                                    value={viewDescription}
                                    onChange={(e) => setViewDescription(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Event Color */}
                        {isEditable && (
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-1">
                                        <HiColorSwatch /> Event Color
                                    </span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <HexColorPicker
                                        color={viewColor}
                                        onChange={setViewColor}
                                        className="w-48 h-24"
                                    />
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-12 h-12 rounded-md shadow-md mb-2"
                                            style={{ backgroundColor: viewColor }}
                                        ></div>
                                        <span className="font-mono text-sm">{viewColor}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div className="mt-4">
                            {isEditable ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-1">
                                                <HiLocationMarker /> Place
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter location"
                                            className="input input-bordered w-full"
                                            value={viewPlace}
                                            onChange={(e) => setViewPlace(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-1">
                                                <FaMapMarkerAlt /> Barangay
                                            </span>
                                        </label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={viewBarangay}
                                            onChange={(e) => setViewBarangay(e.target.value)}
                                        >
                                            <option value=''>Select a barangay</option>
                                            {barangays.map((brgy, index) => (
                                                <option key={index} value={brgy}>{brgy}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                viewPlace || viewBarangay ? (
                                    <div className="flex items-start gap-1 text-gray-600 mt-2">
                                        <FaMapMarkerAlt className="text-error mt-1 flex-shrink-0" />
                                        <span>
                                            {[viewPlace, viewBarangay]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </span>
                                    </div>
                                    
                                ) : null
                            )}
                        </div>

                        {/* Date and Time */}
                        <div className="mt-4">
                            {isEditable ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-1">
                                                <HiClock /> Start
                                            </span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="input input-bordered w-full"
                                            value={viewStart ? moment(viewStart).format("YYYY-MM-DDTHH:mm") : ""}
                                            onChange={(e) => setViewStart(e.target.value)}
                                            min={getMinDateTime()}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-1">
                                                <HiClock /> End
                                            </span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="input input-bordered w-full"
                                            value={viewEnd ? moment(viewEnd).format("YYYY-MM-DDTHH:mm") : ""}
                                            onChange={(e) => setViewEnd(e.target.value)}
                                            min={getMinEndTime(viewStart)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="badge badge-outline p-3 gap-1">
                                            <HiClock /> Start
                                        </div>
                                        <span>{moment(viewStart).format("MMMM D, YYYY h:mm A")}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="badge badge-outline p-3 gap-1">
                                            <HiClock /> End
                                        </div>
                                        <span>{moment(viewEnd).format("MMMM D, YYYY h:mm A")}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="modal-action mt-6">
                            {!isEditable ? (
                                <>
                                    <button
                                        className="btn btn-ghost gap-1"
                                        onClick={() => document.getElementById('view_event_modal').close()}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className={`btn gap-1 ${viewStatus ? 'btn-error' : 'btn-success'} text-white`}
                                        disabled={loading}
                                        onClick={() => handleToggleVisibility(currentId)}
                                    >
                                        {loading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : viewStatus ? (
                                            <>
                                                <HiEyeOff className="w-4 h-4" /> Hide Event
                                            </>
                                        ) : (
                                            <>
                                                <HiEye className="w-4 h-4" /> Unhide Event
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-primary gap-1"
                                        disabled={loading}
                                        onClick={handleEditable}
                                    >
                                        <HiPencil className="w-4 h-4" /> Edit Event
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-ghost gap-1"
                                        onClick={() => {
                                            setIsEditable(false);
                                            fetchOneEvent(currentId);
                                        }}
                                        disabled={loading}
                                    >
                                        <HiX className="w-4 h-4" /> Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary gap-1"
                                        onClick={() => handleUpdate(currentId)}
                                        disabled={
                                            loading ||
                                            !viewTitle ||
                                            !viewDescription ||
                                            !viewStart ||
                                            !viewEnd ||
                                            new Date(viewEnd) <= new Date(viewStart)
                                        }
                                    >
                                        {loading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            <>
                                                <HiCheck className="w-4 h-4" /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsEditable(false)}>close</button>
                    </form>
                </dialog>
            </div>
        </AdminDrawer>
    )
}

export default Events