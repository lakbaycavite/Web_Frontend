import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HiDocumentText, HiCalendar, HiX } from 'react-icons/hi';
import PostListPDF from './PostListPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';
import moment from 'moment';

const PostPDFGenerator = ({ currentPosts, adminUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const [showDateModal, setShowDateModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateError, setDateError] = useState('');

    // Calculate visible and hidden posts from current posts
    const totalVisible = currentPosts.filter(post => !post.is_hidden).length;
    const totalHidden = currentPosts.filter(post => post.is_hidden).length;

    // Function to generate PDF with current posts
    const generateCurrentPostsPDF = async () => {
        setIsLoading(true);
        try {
            // Generate the PDF blob
            const blob = await pdf(
                <PostListPDF
                    posts={currentPosts}
                    totalVisible={totalVisible}
                    totalHidden={totalHidden}
                    reportTitle="Current Page Posts"
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Posts_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch all posts and generate PDF
    const generateAllPostsPDF = async () => {
        setIsLoading(true);
        try {
            // Fetch all posts
            const response = await api.get('/admin/post?limit=1000', {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const allPosts = response.data.posts || [];
            const allVisible = allPosts.filter(post => !post.is_hidden).length;
            const allHidden = allPosts.filter(post => post.is_hidden).length;

            // Generate the PDF blob
            const blob = await pdf(
                <PostListPDF
                    posts={allPosts}
                    totalVisible={allVisible}
                    totalHidden={allHidden}
                    reportTitle="All Posts"
                    adminUser={adminUser}

                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_All_Posts_${new Date().toISOString().split('T')[0]}.pdf`);
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

            // Fetch posts within date range
            const response = await api.get(
                `/admin/post?limit=1000&startDate=${formattedStart}&endDate=${formattedEnd}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            const filteredPosts = response.data.posts || [];

            if (filteredPosts.length === 0) {
                alert("No posts found in the selected date range.");
                setIsLoading(false);
                return;
            }

            const rangeVisible = filteredPosts.filter(post => !post.is_hidden).length;
            const rangeHidden = filteredPosts.filter(post => post.is_hidden).length;

            // Generate the PDF blob
            const blob = await pdf(
                <PostListPDF
                    posts={filteredPosts}
                    totalVisible={rangeVisible}
                    totalHidden={rangeHidden}
                    reportTitle={`Posts from ${moment(start).format('MMM DD, YYYY')} to ${moment(end).format('MMM DD, YYYY')}`}
                    dateRange={{
                        start: moment(start).format('YYYY-MM-DD'),
                        end: moment(end).format('YYYY-MM-DD')
                    }}
                    adminUser={adminUser}

                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Posts_${moment(start).format('YYYYMMDD')}_to_${moment(end).format('YYYYMMDD')}.pdf`);
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
                    <li>
                        <a onClick={generateCurrentPostsPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Current Page Posts
                        </a>
                    </li>
                    <li>
                        <a onClick={generateAllPostsPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            All Posts
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
                            <h3 className="text-lg font-medium text-gray-900">Select Date Range</h3>
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

export default PostPDFGenerator;