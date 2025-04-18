import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import UserListPDF from './UserListPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';

const UserPDFGenerator = ({ currentUsers, totalActiveUsers, totalInactiveUsers }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();

    // Function to generate PDF with current users
    const generateCurrentUsersPDF = async () => {
        setIsLoading(true);
        try {
            // Generate the PDF blob
            const blob = await pdf(
                <UserListPDF
                    users={currentUsers}
                    totalActiveUsers={totalActiveUsers}
                    totalInactiveUsers={totalInactiveUsers}
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

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-sm gap-1">
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
            </ul>
        </div>
    );
};

export default UserPDFGenerator;