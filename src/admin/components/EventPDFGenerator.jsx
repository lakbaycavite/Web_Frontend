import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HiDocumentText, HiCalendar, HiX } from 'react-icons/hi';
import EventListPDF from './EventListPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';
import moment from 'moment';

const EventPDFGenerator = ({ currentEvents, activeEvents, inactiveEvents, adminUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const [showDateModal, setShowDateModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'

    // Function to generate PDF with current events
    const generateCurrentEventsPDF = async () => {
        setIsLoading(true);
        try {
            // Generate the PDF blob
            const blob = await pdf(
                <EventListPDF
                    events={currentEvents}
                    activeEvents={activeEvents}
                    inactiveEvents={inactiveEvents}
                    reportTitle="Current Events Report"
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Events_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch all events and generate PDF
    const generateAllEventsPDF = async () => {
        setIsLoading(true);
        try {
            // Fetch all events
            const response = await api.get('/admin/event', {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const allEvents = response.data.events || [];
            const active = allEvents.filter(event => event.isActive).length;
            const inactive = allEvents.filter(event => !event.isActive).length;

            // Generate the PDF blob
            const blob = await pdf(
                <EventListPDF
                    events={allEvents}
                    activeEvents={active}
                    inactiveEvents={inactive}
                    reportTitle="All Events Report"
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_All_Events_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to generate PDF with date range
    const generateDateRangePDF = async () => {
        if (!startDate || !endDate) {
            setDateError('Please select both start and end dates');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to end of day

        if (start > end) {
            setDateError('Start date must be before end date');
            return;
        }

        setDateError('');
        setIsLoading(true);
        setShowDateModal(false);

        try {
            // Format dates for the API query
            const formattedStart = start.toISOString();
            const formattedEnd = end.toISOString();

            // Fetch events within date range
            const response = await api.get(
                `/admin/event?startDate=${formattedStart}&endDate=${formattedEnd}&status=${filterStatus}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            const filteredEvents = response.data.events || [];

            if (filteredEvents.length === 0) {
                alert("No events found in the selected date range.");
                setIsLoading(false);
                return;
            }

            const active = filteredEvents.filter(event => event.isActive).length;
            const inactive = filteredEvents.filter(event => !event.isActive).length;

            // Generate the PDF blob
            const blob = await pdf(
                <EventListPDF
                    events={filteredEvents}
                    activeEvents={active}
                    inactiveEvents={inactive}
                    reportTitle={`Events from ${moment(start).format('MMM DD, YYYY')} to ${moment(end).format('MMM DD, YYYY')}`}
                    dateRange={{
                        start: moment(start).format('YYYY-MM-DD'),
                        end: moment(end).format('YYYY-MM-DD')
                    }}
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Events_${moment(start).format('YYYYMMDD')}_to_${moment(end).format('YYYYMMDD')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className={`btn bg-primary text-white hover:bg-primary/80 btn-sm gap-1 transform transition hover:scale-105 ${isLoading ? "btn-disabled" : ""}`}>
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <HiDocumentText className="h-5 w-5" />
                    )}
                    Export PDF
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    {/* <li>
                        <a onClick={generateCurrentEventsPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Current Events
                        </a>
                    </li> */}
                    <li>
                        <a onClick={generateAllEventsPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            All Events
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setShowDateModal(true)} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            <HiCalendar className="h-4 w-4" /> Custom Date
                        </a>
                    </li>
                </ul>
            </div>

            {/* Date Range Modal */}
            {showDateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Select Event Date Range</h3>
                            <button
                                onClick={() => setShowDateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Start Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    max={endDate || undefined}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">End Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || undefined}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Event Status</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Events</option>
                                    <option value="active">Active Events Only</option>
                                    <option value="inactive">Hidden Events Only</option>
                                </select>
                            </div>

                            {dateError && (
                                <div className="alert alert-error text-sm py-2">
                                    {dateError}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowDateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={generateDateRangePDF}
                                >
                                    Generate PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventPDFGenerator;