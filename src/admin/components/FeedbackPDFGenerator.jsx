import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HiDocumentText, HiFilter, HiX } from 'react-icons/hi';
import { FaStar, FaFilter } from 'react-icons/fa';
import FeedbackListPDF from './FeedbackListPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';
import moment from 'moment';
import { useToast } from '../../hooks/useToast';

const FeedbackPDFGenerator = ({ currentFeedbacks, ratingCounts, categoryCounts, adminUser }) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Categories from the Feedbacks component
    const categories = ['UI/UX', 'Performance', 'Features', 'Bug', 'Content', 'All/Other'];

    // Function to generate PDF with current feedbacks
    const generateCurrentFeedbacksPDF = async () => {
        setIsLoading(true);
        try {
            // Generate the PDF blob
            const blob = await pdf(
                <FeedbackListPDF
                    feedbacks={currentFeedbacks}
                    ratingCounts={ratingCounts}
                    categoryCounts={categoryCounts}
                    reportTitle="Current Feedback Report"
                    adminUser={adminUser}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Feedback_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast("Failed to generate PDF. Please try again.", "error");
            // alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch all feedbacks and generate PDF
    const generateAllFeedbacksPDF = async () => {
        setIsLoading(true);
        try {
            // Fetch all feedbacks
            const response = await api.get('/admin/feedback?limit=1000', {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            let allFeedbacks = [];
            if (Array.isArray(response.data)) {
                allFeedbacks = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                allFeedbacks = response.data.data;
            }

            // Calculate rating counts
            const allRatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            const allCategoryCounts = {
                'UI/UX': 0,
                'Performance': 0,
                'Features': 0,
                'Bug': 0,
                'Content': 0,
                'All/Other': 0
            };

            allFeedbacks.forEach(feedback => {
                // Count ratings
                const rating = Number(feedback.rating);
                if (allRatingCounts[rating] !== undefined) {
                    allRatingCounts[rating]++;
                }

                // Count categories
                if (allCategoryCounts[feedback.category] !== undefined) {
                    allCategoryCounts[feedback.category]++;
                } else {
                    allCategoryCounts['All/Other']++;
                }
            });

            // Generate the PDF blob
            const blob = await pdf(
                <FeedbackListPDF
                    feedbacks={allFeedbacks}
                    ratingCounts={allRatingCounts}
                    categoryCounts={allCategoryCounts}
                    reportTitle="All User Feedback"
                    adminUser={adminUser}

                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_All_Feedback_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast("Failed to generate PDF. Please try again.", "error");
            // alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to generate PDF with filters
    const generateFilteredFeedbacksPDF = async () => {
        if (!selectedRating && !selectedCategory) {
            generateAllFeedbacksPDF();
            return;
        }

        setIsLoading(true);
        setShowFilterModal(false);

        try {
            // Build query parameters
            let query = 'limit=1000';
            if (selectedRating) query += `&rating=${selectedRating}`;
            if (selectedCategory && selectedCategory !== 'All/Other') query += `&category=${selectedCategory}`;

            // Fetch filtered feedbacks
            const response = await api.get(
                `/admin/feedback?${query}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            let filteredFeedbacks = [];
            if (Array.isArray(response.data)) {
                filteredFeedbacks = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                filteredFeedbacks = response.data.data;
            }

            if (filteredFeedbacks.length === 0) {
                toast("No feedback found with the selected filters.", "error");
                // alert("No feedback found with the selected filters.");
                setIsLoading(false);
                return;
            }

            // Calculate rating counts for filtered data
            const filteredRatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            const filteredCategoryCounts = {
                'UI/UX': 0,
                'Performance': 0,
                'Features': 0,
                'Bug': 0,
                'Content': 0,
                'All/Other': 0
            };

            filteredFeedbacks.forEach(feedback => {
                // Count ratings
                const rating = Number(feedback.rating);
                if (filteredRatingCounts[rating] !== undefined) {
                    filteredRatingCounts[rating]++;
                }

                // Count categories
                if (filteredCategoryCounts[feedback.category] !== undefined) {
                    filteredCategoryCounts[feedback.category]++;
                } else {
                    filteredCategoryCounts['All/Other']++;
                }
            });

            // Create report title based on filters
            let reportTitle = "Filtered Feedback Report";
            if (selectedRating && selectedCategory) {
                reportTitle = `${selectedRating}-Star ${selectedCategory} Feedback`;
            } else if (selectedRating) {
                reportTitle = `${selectedRating}-Star Feedback`;
            } else if (selectedCategory) {
                reportTitle = `${selectedCategory} Feedback`;
            }

            // Generate the PDF blob
            const blob = await pdf(
                <FeedbackListPDF
                    feedbacks={filteredFeedbacks}
                    ratingCounts={filteredRatingCounts}
                    categoryCounts={filteredCategoryCounts}
                    reportTitle={reportTitle}
                    filters={{
                        rating: selectedRating,
                        category: selectedCategory
                    }}
                    adminUser={adminUser}
                />
            ).toBlob();

            // Create filename based on filters
            let filename = `Lakbay_Cavite_Feedback_`;
            if (selectedRating) filename += `${selectedRating}Star_`;
            if (selectedCategory) filename += `${selectedCategory.replace('/', '_')}_`;
            filename += `${new Date().toISOString().split('T')[0]}.pdf`;

            // Save the blob as a file
            saveAs(blob, filename);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast("Failed to generate PDF. Please try again.", "error");
            // alert("Failed to generate PDF. Please try again.");
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
                        <a onClick={generateCurrentFeedbacksPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Current Feedback
                        </a>
                    </li>
                    <li>
                        <a onClick={generateAllFeedbacksPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            All Feedback
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setShowFilterModal(true)} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            <FaFilter className="h-4 w-4" /> Filter Feedback
                        </a>
                    </li>
                </ul>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Filter Feedback Report</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-1">
                                        <FaStar className="text-yellow-400" /> Rating
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={selectedRating}
                                    onChange={(e) => setSelectedRating(e.target.value)}
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-1">
                                        <HiFilter /> Category
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setSelectedRating('');
                                        setSelectedCategory('');
                                    }}
                                >
                                    Clear Filters
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowFilterModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={generateFilteredFeedbacksPDF}
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

export default FeedbackPDFGenerator;