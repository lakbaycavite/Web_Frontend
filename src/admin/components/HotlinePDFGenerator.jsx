import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HiDocumentText, HiPhone, HiX } from 'react-icons/hi';
import HotlineListPDF from './HotlineListPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';
import moment from 'moment';

const HotlinePDFGenerator = ({ currentHotlines, categoryCounts }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const categories = ['Fire', 'Police', 'Ambulance/ Medical', 'Disaster Response', 'Others', 'All Categories'];

    // Function to generate PDF with current hotlines
    const generateCurrentHotlinesPDF = async () => {
        setIsLoading(true);
        try {
            // Generate the PDF blob
            const blob = await pdf(
                <HotlineListPDF
                    hotlines={currentHotlines}
                    categoryCounts={categoryCounts}
                    reportTitle="Current Emergency Hotlines"
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Hotlines_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch all hotlines and generate PDF
    const generateAllHotlinesPDF = async () => {
        setIsLoading(true);
        try {
            // Fetch all hotlines
            const response = await api.get('/admin/hotline?limit=1000', {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const allHotlines = response.data.hotlines || [];

            // Calculate category counts
            const counts = {
                'Fire': 0,
                'Police': 0,
                'Ambulance/ Medical': 0,
                'Disaster Response': 0,
                'Others': 0
            };

            allHotlines.forEach(hotline => {
                if (counts[hotline.category] !== undefined) {
                    counts[hotline.category]++;
                } else {
                    counts['Others']++;
                }
            });

            // Generate the PDF blob
            const blob = await pdf(
                <HotlineListPDF
                    hotlines={allHotlines}
                    categoryCounts={counts}
                    reportTitle="All Emergency Hotlines"
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_All_Hotlines_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to generate PDF with category filter
    const generateCategoryFilteredPDF = async () => {
        if (!selectedCategory || selectedCategory === 'All Categories') {
            generateAllHotlinesPDF();
            return;
        }

        setIsLoading(true);
        setShowCategoryModal(false);

        try {
            // Fetch hotlines by category
            const response = await api.get(
                `/admin/hotline?limit=1000&category=${selectedCategory}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            const filteredHotlines = response.data.hotlines || [];

            if (filteredHotlines.length === 0) {
                alert(`No hotlines found in the "${selectedCategory}" category.`);
                setIsLoading(false);
                return;
            }

            // Calculate category counts
            const counts = {
                'Fire': 0,
                'Police': 0,
                'Ambulance/ Medical': 0,
                'Disaster Response': 0,
                'Others': 0
            };

            filteredHotlines.forEach(hotline => {
                if (counts[hotline.category] !== undefined) {
                    counts[hotline.category]++;
                } else {
                    counts['Others']++;
                }
            });

            // Generate the PDF blob
            const blob = await pdf(
                <HotlineListPDF
                    hotlines={filteredHotlines}
                    categoryCounts={counts}
                    reportTitle={`${selectedCategory} Emergency Hotlines`}
                    categoryFilter={selectedCategory}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_${selectedCategory.replace('/', '_')}_Hotlines_${new Date().toISOString().split('T')[0]}.pdf`);
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
                <label tabIndex={0} className="btn btn-primary btn-sm gap-1 transform transition hover:scale-105">
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <HiDocumentText className="h-5 w-5" />
                    )}
                    Export PDF
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={generateCurrentHotlinesPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Current Hotlines
                        </a>
                    </li>
                    <li>
                        <a onClick={generateAllHotlinesPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            All Hotlines
                        </a>
                    </li>
                    <li>
                        <a onClick={() => setShowCategoryModal(true)} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            <HiPhone className="h-4 w-4" /> Filter by Category
                        </a>
                    </li>
                </ul>
            </div>

            {/* Category Filter Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Select Category</h3>
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowCategoryModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={generateCategoryFilteredPDF}
                                    disabled={!selectedCategory}
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

export default HotlinePDFGenerator;