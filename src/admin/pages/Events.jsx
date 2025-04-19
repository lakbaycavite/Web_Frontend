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
    HiClock,
    HiViewList,
    HiChevronLeft,
    HiChevronRight,
    HiFilter,
    HiSortAscending,
    HiSortDescending,
    HiAdjustments
} from "react-icons/hi"
import {
    FaCalendarAlt,
    FaCalendarPlus,
    FaCalendarCheck,
    FaMapMarkerAlt,
    FaImage,
    FaTable,
    FaCalendarWeek,
    FaArrowRight
} from "react-icons/fa"
import { MdDescription, MdTitle, MdEvent, MdEventAvailable, MdDateRange } from "react-icons/md"
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

    // New states for tabular view
    const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'table'
    const [startMonth, setStartMonth] = useState(moment().startOf('month'))
    const [endMonth, setEndMonth] = useState(moment().endOf('month'))
    const [sortField, setSortField] = useState('start') // 'title', 'start', 'end'
    const [sortDirection, setSortDirection] = useState('asc') // 'asc' or 'desc'

    // New states for custom range selection
    const [isCustomRange, setIsCustomRange] = useState(false)
    const [startMonthInput, setStartMonthInput] = useState(moment().format('YYYY-MM'))
    const [endMonthInput, setEndMonthInput] = useState(moment().format('YYYY-MM'))
    const [showRangeSelector, setShowRangeSelector] = useState(false)

    const [createError, setCreateError] = useState(null)
    const [updateError, setUpdateError] = useState(null)

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

                setCreateError(null)
                document.getElementById('create_event_modal').close()
            })
            .catch((err) => {
                console.error("Error creating event:", err)
                setCreateError(err.response?.data?.error || "An unexpected error occurred")
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
            setCreateError(null)
            setIsEditable(false)
            setCreateError(null)
            setUpdateError(null)
        } catch (error) {
            console.error("Error updating event:", error)
            toast("Failed to update event", "error")
            setUpdateError(error.response?.data?.error || "An unexpected error occurred")
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
                setCreateError(null)
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

    // New functions for tabular view
    const handleViewModeToggle = () => {
        setViewMode(viewMode === 'calendar' ? 'table' : 'calendar')

        // Reset custom range when toggling back to calendar
        if (viewMode === 'table') {
            setIsCustomRange(false)
        }
    }

    const handlePreviousMonth = () => {
        setStartMonth(moment(startMonth).subtract(1, 'month'))
        setEndMonth(moment(endMonth).subtract(1, 'month'))
        setIsCustomRange(false)
    }

    const handleNextMonth = () => {
        setStartMonth(moment(startMonth).add(1, 'month'))
        setEndMonth(moment(endMonth).add(1, 'month'))
        setIsCustomRange(false)
    }

    // Apply custom date range
    const applyCustomRange = () => {
        // Format inputs to moment objects
        const newStartMonth = moment(startMonthInput + '-01')
        const newEndMonth = moment(endMonthInput + '-01').endOf('month')

        // Validate range
        if (newEndMonth.isBefore(newStartMonth)) {
            toast("End month cannot be before start month", "error")
            return
        }

        setStartMonth(newStartMonth)
        setEndMonth(newEndMonth)
        setIsCustomRange(true)
        setShowRangeSelector(false)

        toast(`Date range set: ${newStartMonth.format('MMM YYYY')} - ${newEndMonth.format('MMM YYYY')}`, "success")
    }

    const resetToCurrentMonth = () => {
        setStartMonth(moment().startOf('month'))
        setEndMonth(moment().endOf('month'))
        setStartMonthInput(moment().format('YYYY-MM'))
        setEndMonthInput(moment().format('YYYY-MM'))
        setIsCustomRange(false)
        setShowRangeSelector(false)
    }

    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle sort direction if clicking on the same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            // Set new sort field and default to ascending
            setSortField(field)
            setSortDirection('asc')
        }
    }

    // Filter events by date range for tabular view
    const getFilteredEvents = () => {
        if (!events) return []

        let filteredEvents = [...events]

        // Filter by date range
        if (viewMode === 'table') {
            const start = startMonth.startOf('day').toDate()
            const end = endMonth.endOf('day').toDate()

            filteredEvents = filteredEvents.filter(event => {
                const eventStart = new Date(event.start)
                return eventStart >= start && eventStart <= end
            })
        }

        // Sort events
        filteredEvents.sort((a, b) => {
            let valueA, valueB

            switch (sortField) {
                case 'title':
                    valueA = a.title.toLowerCase()
                    valueB = b.title.toLowerCase()
                    break
                case 'start':
                    valueA = new Date(a.start).getTime()
                    valueB = new Date(b.start).getTime()
                    break
                case 'end':
                    valueA = new Date(a.end).getTime()
                    valueB = new Date(b.end).getTime()
                    break
                default:
                    valueA = new Date(a.start).getTime()
                    valueB = new Date(b.start).getTime()
            }

            if (sortDirection === 'asc') {
                return valueA > valueB ? 1 : -1
            } else {
                return valueA < valueB ? 1 : -1
            }
        })

        return filteredEvents
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
                                className={`btn btn-sm ${filterStatus === 'all' ? 'bg-primary text-white hover:bg-primary/80' : 'btn-outline'}`}
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

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-400 rounded-full"></span>
                                <span className="text-sm text-gray-600">Done/ Inactive</span>
                            </div>

                            {/* View Toggle Button */}
                            <button
                                className={`btn btn-sm ${viewMode === 'table' ? 'bg-info text-white' : 'btn-outline btn-info'}`}
                                onClick={handleViewModeToggle}
                            >
                                {viewMode === 'calendar' ? (
                                    <>
                                        <FaTable className="mr-1" /> Table View
                                    </>
                                ) : (
                                    <>
                                        <HiCalendar className="mr-1" /> Calendar View
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => document.getElementById('create_event_modal').showModal()}
                                className="btn bg-secondary text-white hover:bg-secondary/80 btn-sm font-normal gap-1 transform transition hover:scale-105"
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

                {/* Month Range Selector - ENHANCED */}
                {viewMode === 'table' && (
                    <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <MdDateRange className="text-primary" />
                                {isCustomRange ? (
                                    <span>
                                        Events for: {startMonth.format('MMMM YYYY')} - {endMonth.format('MMMM YYYY')}
                                    </span>
                                ) : (
                                    <span>
                                        Events for: {startMonth.format('MMMM YYYY')}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                                {!showRangeSelector ? (
                                    <>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            disabled={isCustomRange}
                                            onClick={handlePreviousMonth}
                                        >
                                            <HiChevronLeft /> Previous Month
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => resetToCurrentMonth()}
                                        >
                                            Current Month
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={handleNextMonth}
                                            disabled={isCustomRange}
                                        >
                                            Next Month <HiChevronRight />
                                        </button>


                                        {!isCustomRange ? (
                                            <button
                                                className="btn btn-sm bg-primary hover:bg-primary/80 text-white"
                                                onClick={() => setShowRangeSelector(true)}
                                            >
                                                <FaCalendarWeek className="mr-1" /> Custom Range
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-outline bg-primary hover:bg-primary/80 text-white"
                                                onClick={() => resetToCurrentMonth()}
                                            >
                                                <FaCalendarWeek className="mr-1" /> Cancel
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="join">
                                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium mr-2">From:</span>
                                                    <input
                                                        type="month"
                                                        className="input input-bordered input-sm"
                                                        value={startMonthInput}
                                                        onChange={(e) => setStartMonthInput(e.target.value)}
                                                    />
                                                </div>

                                                <FaArrowRight className="hidden sm:block text-gray-400" />

                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium mr-2">To:</span>
                                                    <input
                                                        type="month"
                                                        className="input input-bordered input-sm"
                                                        value={endMonthInput}
                                                        onChange={(e) => setEndMonthInput(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-sm btn-success text-white"
                                                onClick={applyCustomRange}
                                            >
                                                <HiCheck className="w-4 h-4" /> Apply
                                            </button>

                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => setShowRangeSelector(false)}
                                            >
                                                <HiX className="w-4 h-4" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar Container */}
                <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                    {loading && !events?.length ? (
                        <div className="w-full p-8 h-[600px] flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                                <p className="mt-4 text-gray-600">Loading events calendar...</p>
                            </div>
                        </div>
                    ) : viewMode === 'calendar' ? (
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
                    ) : (
                        <div className="p-4">
                            {/* Tabular View */}
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="w-10">#</th>
                                            <th className="cursor-pointer" onClick={() => handleSort('title')}>
                                                <div className="flex items-center gap-1">
                                                    Title
                                                    {sortField === 'title' && (
                                                        sortDirection === 'asc' ?
                                                            <HiSortAscending className="text-primary" /> :
                                                            <HiSortDescending className="text-primary" />
                                                    )}
                                                </div>
                                            </th>
                                            <th>Location</th>
                                            <th className="cursor-pointer" onClick={() => handleSort('start')}>
                                                <div className="flex items-center gap-1">
                                                    Start Date
                                                    {sortField === 'start' && (
                                                        sortDirection === 'asc' ?
                                                            <HiSortAscending className="text-primary" /> :
                                                            <HiSortDescending className="text-primary" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="cursor-pointer" onClick={() => handleSort('end')}>
                                                <div className="flex items-center gap-1">
                                                    End Date
                                                    {sortField === 'end' && (
                                                        sortDirection === 'asc' ?
                                                            <HiSortAscending className="text-primary" /> :
                                                            <HiSortDescending className="text-primary" />
                                                    )}
                                                </div>
                                            </th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getFilteredEvents().map((event, index) => (
                                            <tr key={event._id} className={!event.isActive ? 'opacity-60' : ''}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color || '#333' }}></div>
                                                        <div>
                                                            <div className="font-bold">{event.title}</div>
                                                            <div className="text-sm opacity-50">
                                                                {event.description?.length > 50 ?
                                                                    `${event.description.substring(0, 50)}...` :
                                                                    event.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {event.place || event.barangay ? (
                                                        <div className="text-sm">
                                                            {[event.place, event.barangay].filter(Boolean).join(", ")}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs opacity-50">No location</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="text-sm">
                                                        {moment(event.start).format('MMM D, YYYY')}
                                                    </div>
                                                    <div className="text-xs opacity-50">
                                                        {moment(event.start).format('h:mm A')}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-sm">
                                                        {moment(event.end).format('MMM D, YYYY')}
                                                    </div>
                                                    <div className="text-xs opacity-50">
                                                        {moment(event.end).format('h:mm A')}
                                                    </div>
                                                </td>
                                                <td>
                                                    {event.isActive ? (
                                                        <div className="badge badge-success badge-sm gap-1">
                                                            <MdEventAvailable className="w-3 h-3" /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="badge badge-error badge-sm gap-1">
                                                            <HiEyeOff className="w-3 h-3" /> Hidden
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-ghost btn-xs"
                                                        onClick={() => handleClick(event._id)}
                                                    >
                                                        details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {getFilteredEvents().length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <HiCalendar className="text-3xl text-gray-400 mb-2" />
                                                        <p className="text-gray-500">No events found in this date range</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
                                    className={`input input-bordered w-full ${createError ? 'input-error' : ''}`}
                                    value={title || ""}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {createError && (
                                <p className="text-red-500 text-sm mb-2">
                                    {createError}
                                </p>
                            )}

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
                                onClick={() => {
                                    document.getElementById('create_event_modal').close()
                                    setCreateError(null)
                                }}
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
                        <button onClick={() => setCreateError(null)}>close</button>
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
                                    className={`input input-bordered w-full ${updateError ? 'input-error' : ''}`}
                                    value={viewTitle}
                                    onChange={(e) => setViewTitle(e.target.value)}
                                />

                                {updateError && (
                                    <p className='text-red-500 text-sm mt-2'>
                                        {updateError}
                                    </p>
                                )}
                            </div>
                        )}

                        {createError && (
                            <p className='text-red-500 text-sm mb-2'>
                                {createError}
                            </p>
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
                                        onClick={() => {
                                            document.getElementById('view_event_modal').close()
                                            setCreateError(null)
                                        }}
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
                        <button onClick={() => {
                            setIsEditable(false)
                            setUpdateError(null)
                        }}>close</button>
                    </form>
                </dialog>
            </div>
        </AdminDrawer>
    )
}

export default Events