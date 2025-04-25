import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HiDocumentText, HiCalendar, HiX } from 'react-icons/hi';
import UserListPDF from './UserListPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';
import moment from 'moment';

const UserPDFGenerator = ({ currentUsers, totalActiveUsers, totalInactiveUsers, currentActiveUsers, currentInactiveUsers, adminUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const [showDateModal, setShowDateModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateError, setDateError] = useState('');

    // Function to generate PDF with current users
    const generateCurrentUsersPDF = async () => {
        setIsLoading(true);
        try {
            // Generate the PDF blob
            const blob = await pdf(
                <UserListPDF
                    users={currentUsers}
                    totalActiveUsers={currentActiveUsers}
                    totalInactiveUsers={currentInactiveUsers}
                    reportTitle="Current Page Users"
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Users_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch all users and generate PDF
    const generateAllUsersPDF = async () => {
        setIsLoading(true);
        try {
            // Fetch all users
            const response = await api.get('/admin/user?limit=1000', {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const allUsers = response.data.users || [];
            const allTotalActive = response.data.totalActiveUsers;
            const allTotalInactive = response.data.totalInactiveUsers;

            // Generate the PDF blob
            const blob = await pdf(
                <UserListPDF
                    users={allUsers}
                    totalActiveUsers={allTotalActive}
                    totalInactiveUsers={allTotalInactive}
                    reportTitle="All Users"
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_All_Users_${new Date().toISOString().split('T')[0]}.pdf`);
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

            // Fetch users within date range
            const response = await api.get(
                `/admin/user?limit=1000&startDate=${formattedStart}&endDate=${formattedEnd}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            const filteredUsers = response.data.users || [];

            if (filteredUsers.length === 0) {
                alert("No users found in the selected date range.");
                setIsLoading(false);
                return;
            }

            // Generate the PDF blob
            const blob = await pdf(
                <UserListPDF
                    users={filteredUsers}
                    totalActiveUsers={response.data.totalActiveUsers || 0}
                    totalInactiveUsers={response.data.totalInactiveUsers || 0}
                    reportTitle={`Users Registered from ${moment(start).format('MMM DD, YYYY')} to ${moment(end).format('MMM DD, YYYY')}`}
                    dateRange={{
                        start: moment(start).format('YYYY-MM-DD'),
                        end: moment(end).format('YYYY-MM-DD')
                    }}
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Users_${moment(start).format('YYYYMMDD')}_to_${moment(end).format('YYYYMMDD')}.pdf`);
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )}
                    Export PDF
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={generateCurrentUsersPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Current Page Users
                        </a>
                    </li>
                    <li>
                        <a onClick={generateAllUsersPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            All Users
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
                            <h3 className="text-lg font-medium text-gray-900">Select Registration Date Range</h3>
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

export default UserPDFGenerator;