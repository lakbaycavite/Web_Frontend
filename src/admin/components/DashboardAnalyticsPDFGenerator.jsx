import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HiDocumentText, HiCalendar, HiX, HiChartBar } from 'react-icons/hi';
import DashboardAnalyticsPDF from './DashboardAnalyticsPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';
import moment from 'moment';

const DashboardAnalyticsPDFGenerator = ({ dashboardData, chartData, ageGroups }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const [showDateModal, setShowDateModal] = useState(false);
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [dateError, setDateError] = useState('');

    // Generate insights based on dashboard data
    const generateInsights = (data) => {
        const insights = {
            summary: "",
            demographics: "",
            feedback: "",
            hotlines: "",
            posts: "",
            events: ""
        };

        // Generate summary insights
        if (data.totalUsers > 0) {
            const activePercent = Math.round((data.totalActiveUsers / data.totalUsers) * 100);
            insights.summary = `The platform shows a ${activePercent}% user activity rate. `;

            if (data.totalPosts > 0) {
                const postsPerUser = (data.totalPosts / data.totalUsers).toFixed(1);
                insights.summary += `On average, each user has created ${postsPerUser} posts. `;
            }

            if (data.upcomingEvents > 0) {
                insights.summary += `There are ${data.upcomingEvents} upcoming events that may drive further user engagement.`;
            }
        }

        // Generate demographic insights
        if (data.demographics?.gender) {
            const genders = data.demographics.gender;
            const primaryGender = Object.entries(genders).reduce((a, b) => a[1] > b[1] ? a : b, ['Unknown', 0])[0];

            if (data.totalUsers > 0 && primaryGender !== 'Unknown') {
                const primaryPercent = Math.round((genders[primaryGender] / data.totalUsers) * 100);
                insights.demographics = `The platform shows a ${primaryGender.toLowerCase()} majority (${primaryPercent}%). `;
            }

            if (data.demographics.ageGroups) {
                const ages = data.demographics.ageGroups;
                const primaryAge = Object.entries(ages).reduce((a, b) => a[1] > b[1] ? a : b, ['Unknown', 0])[0];

                if (data.totalUsers > 0 && primaryAge !== 'Unknown') {
                    const agePercent = Math.round((ages[primaryAge] / data.totalUsers) * 100);
                    insights.demographics += `The primary age group is ${primaryAge} (${agePercent}%), suggesting the platform appeals most to this demographic.`;
                }
            }
        }

        // Add feedback insights
        if (data.totalFeedbacks > 0 && data.feedbackAnalytics) {
            const avgRating = data.feedbackAnalytics.averageRating || 0;
            insights.feedback = `The platform has an overall satisfaction rating of ${avgRating.toFixed(1)} stars. `;

            if (data.feedbackAnalytics.ratingDistribution) {
                const fiveStarCount = data.feedbackAnalytics.ratingDistribution[5] || 0;
                const totalRatings = Object.values(data.feedbackAnalytics.ratingDistribution).reduce((sum, count) => sum + count, 0);

                if (totalRatings > 0) {
                    const fiveStarPercentage = Math.round((fiveStarCount / totalRatings) * 100);
                    insights.feedback += `${fiveStarPercentage}% of users gave a 5-star rating. `;
                }

                // Add trending insight if available
                if (data.feedbackAnalytics.ratingOverTime && data.feedbackAnalytics.ratingOverTime.length >= 2) {
                    const latest = data.feedbackAnalytics.ratingOverTime[data.feedbackAnalytics.ratingOverTime.length - 1];
                    const previous = data.feedbackAnalytics.ratingOverTime[data.feedbackAnalytics.ratingOverTime.length - 2];

                    if (latest && previous) {
                        const trend = latest.average > previous.average ? "improving" :
                            latest.average < previous.average ? "declining" : "stable";
                        insights.feedback += `User satisfaction is ${trend} over time.`;
                    }
                }
            }

            // Add category insight if available
            if (data.feedbackAnalytics.ratingByCategory) {
                const categories = Object.entries(data.feedbackAnalytics.ratingByCategory);
                if (categories.length > 0) {
                    const highestRated = categories.reduce((a, b) => a[1] > b[1] ? a : b);
                    const lowestRated = categories.reduce((a, b) => a[1] < b[1] ? a : b);

                    if (highestRated[0] !== lowestRated[0]) {
                        insights.feedback += ` The "${highestRated[0]}" category receives the highest ratings (${highestRated[1].toFixed(1)}), while "${lowestRated[0]}" receives the lowest (${lowestRated[1].toFixed(1)}).`;
                    }
                }
            }
        }

        // Add hotlines insights
        if (data.totalHotlines > 0) {
            insights.hotlines = `The emergency contact system includes ${data.totalHotlines} hotline numbers, providing essential emergency services to users.`;
        }

        // Add post insights
        if (data.totalPosts > 0) {
            const visiblePercent = Math.round((data.totalActivePosts / data.totalPosts) * 100);
            insights.posts = `${visiblePercent}% of all posts are currently visible to users. `;

            if (data.recentPosts && data.recentPosts.length > 0) {
                insights.posts += `The platform continues to see regular content creation with ${data.recentPosts.length} new posts recently added.`;
            }
        }

        // Add event insights
        if (data.totalEvents > 0) {
            const upcomingPercent = data.totalEvents > 0 ? Math.round((data.upcomingEvents / data.totalEvents) * 100) : 0;
            insights.events = `${upcomingPercent}% of all events are upcoming. `;

            if (data.ongoingEvents > 0) {
                insights.events += `There are currently ${data.ongoingEvents} ongoing events. `;
            }

            if (data.upcomingFiveEvents && data.upcomingFiveEvents.length > 0) {
                insights.events += `The next event is scheduled to start soon.`;
            }
        }

        return insights;
    };

    // Function to generate current dashboard PDF
    const generateCurrentDashboardPDF = async () => {
        setIsLoading(true);
        try {
            // Generate insights based on current dashboard data
            const insights = generateInsights(dashboardData);

            // Generate the PDF blob
            const blob = await pdf(
                <DashboardAnalyticsPDF
                    dashboardData={dashboardData}
                    chartData={chartData}
                    ageGroups={ageGroups}
                    reportTitle="Current Dashboard Analytics"
                    analysis={insights}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to generate monthly dashboard PDF
    const generateMonthlyDashboardPDF = async () => {
        setIsLoading(true);
        try {
            // Set date range to current month
            const startOfMonth = moment().startOf('month').toDate();
            const endOfMonth = moment().endOf('month').toDate();

            // Format dates for the API query
            const formattedStart = startOfMonth.toISOString();
            const formattedEnd = endOfMonth.toISOString();

            // Fetch dashboard data for current month
            const response = await api.get(
                `/admin/dashboard?startDate=${formattedStart}&endDate=${formattedEnd}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            const monthlyData = response.data;

            if (!monthlyData) {
                alert("No data found for the current month.");
                setIsLoading(false);
                return;
            }

            // Process gender data for pie chart
            let monthlyChartData = null;
            if (monthlyData.demographics?.gender) {
                const genders = monthlyData.demographics.gender;
                const genderLabels = Object.keys(genders);
                const genderCounts = Object.values(genders);

                monthlyChartData = {
                    labels: genderLabels,
                    datasets: [
                        {
                            data: genderCounts,
                            backgroundColor: ["#035594", "#32cc32", "#808080"],
                        },
                    ],
                };
            }

            // Get age groups data
            const monthlyAgeGroups = monthlyData.demographics?.ageGroups || {};

            // Generate insights based on monthly data
            const insights = generateInsights(monthlyData);

            // Generate the PDF blob
            const blob = await pdf(
                <DashboardAnalyticsPDF
                    dashboardData={monthlyData}
                    chartData={monthlyChartData}
                    ageGroups={monthlyAgeGroups}
                    reportTitle={`Monthly Dashboard Analytics: ${moment().format('MMMM YYYY')}`}
                    dateRange={{
                        start: moment(startOfMonth).format('YYYY-MM-DD'),
                        end: moment(endOfMonth).format('YYYY-MM-DD')
                    }}
                    analysis={insights}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Dashboard_${moment().format('MMMM_YYYY')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to generate quarterly dashboard PDF
    const generateQuarterlyDashboardPDF = async () => {
        setIsLoading(true);
        try {
            // Set date range to current quarter
            const startOfQuarter = moment().startOf('quarter').toDate();
            const endOfQuarter = moment().endOf('quarter').toDate();

            // Format dates for the API query
            const formattedStart = startOfQuarter.toISOString();
            const formattedEnd = endOfQuarter.toISOString();

            // Fetch dashboard data for current quarter
            const response = await api.get(
                `/admin/dashboard?startDate=${formattedStart}&endDate=${formattedEnd}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            const quarterlyData = response.data;

            if (!quarterlyData) {
                alert("No data found for the current quarter.");
                setIsLoading(false);
                return;
            }

            // Process gender data for pie chart
            let quarterlyChartData = null;
            if (quarterlyData.demographics?.gender) {
                const genders = quarterlyData.demographics.gender;
                const genderLabels = Object.keys(genders);
                const genderCounts = Object.values(genders);

                quarterlyChartData = {
                    labels: genderLabels,
                    datasets: [
                        {
                            data: genderCounts,
                            backgroundColor: ["#035594", "#32cc32", "#808080"],
                        },
                    ],
                };
            }

            // Get age groups data
            const quarterlyAgeGroups = quarterlyData.demographics?.ageGroups || {};

            // Generate insights based on quarterly data
            const insights = generateInsights(quarterlyData);

            // Generate the PDF blob
            const currentQuarter = Math.floor(moment().month() / 3) + 1;
            const blob = await pdf(
                <DashboardAnalyticsPDF
                    dashboardData={quarterlyData}
                    chartData={quarterlyChartData}
                    ageGroups={quarterlyAgeGroups}
                    reportTitle={`Q${currentQuarter} ${moment().format('YYYY')} Dashboard Analytics`}
                    dateRange={{
                        start: moment(startOfQuarter).format('YYYY-MM-DD'),
                        end: moment(endOfQuarter).format('YYYY-MM-DD')
                    }}
                    analysis={insights}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Dashboard_Q${currentQuarter}_${moment().format('YYYY')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch dashboard data by date range and generate PDF
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

            // Fetch dashboard data for date range
            const response = await api.get(
                `/admin/dashboard?startDate=${formattedStart}&endDate=${formattedEnd}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            const rangeData = response.data;

            if (!rangeData) {
                alert("No data found for the selected date range.");
                setIsLoading(false);
                return;
            }

            // Process gender data for pie chart
            let rangeChartData = null;
            if (rangeData.demographics?.gender) {
                const genders = rangeData.demographics.gender;
                const genderLabels = Object.keys(genders);
                const genderCounts = Object.values(genders);

                rangeChartData = {
                    labels: genderLabels,
                    datasets: [
                        {
                            data: genderCounts,
                            backgroundColor: ["#035594", "#32cc32", "#808080"],
                        },
                    ],
                };
            }

            // Get age groups data
            const rangeAgeGroups = rangeData.demographics?.ageGroups || {};

            // Generate insights based on range data
            const insights = generateInsights(rangeData);

            // Generate the PDF blob
            const blob = await pdf(
                <DashboardAnalyticsPDF
                    dashboardData={rangeData}
                    chartData={rangeChartData}
                    ageGroups={rangeAgeGroups}
                    reportTitle={`Dashboard Analytics: ${moment(start).format('MMM DD, YYYY')} to ${moment(end).format('MMM DD, YYYY')}`}
                    dateRange={{
                        start: moment(start).format('YYYY-MM-DD'),
                        end: moment(end).format('YYYY-MM-DD')
                    }}
                    analysis={insights}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Dashboard_${moment(start).format('YYYYMMDD')}_to_${moment(end).format('YYYYMMDD')}.pdf`);
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
                <label tabIndex={0} className="btn bg-primary text-white hover:bg-primary/80 btn-sm gap-1 transform transition hover:scale-105">
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <HiChartBar className="h-5 w-5" />
                    )}
                    Analytics PDF
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a onClick={generateCurrentDashboardPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Current Analytics
                        </a>
                    </li>
                    <li>
                        <a onClick={generateMonthlyDashboardPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Monthly Report
                        </a>
                    </li>
                    <li>
                        <a onClick={generateQuarterlyDashboardPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            Quarterly Report
                        </a>
                    </li>
                    <li className="divider"></li>
                    <li>
                        <a onClick={() => setShowDateModal(true)} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                            <HiCalendar className="h-4 w-4" /> Custom Date Range
                        </a>
                    </li>
                </ul>
            </div>

            {/* Date Range Modal */}
            {showDateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Select Date Range for Analytics</h3>
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

export default DashboardAnalyticsPDFGenerator;