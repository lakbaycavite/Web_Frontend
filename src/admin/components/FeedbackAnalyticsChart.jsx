import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler
);

export const FeedbackAnalyticsChart = ({ feedbackAnalyticsm }) => {
    // Early return if data isn't loaded yet
    if (!feedbackAnalytics) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading analytics...</div>
            </div>
        );
    }

    const {
        ratingDistribution,
        ratingOverTime,
        categoryDistribution,
        averageRating,
        ratingByCategory
    } = feedbackAnalytics;

    // Rating Distribution Chart Data
    const ratingDistributionData = {
        labels: Object.keys(ratingDistribution || {}).map(key => `${key} Star${key !== '1' ? 's' : ''}`),
        datasets: [
            {
                label: 'Number of Ratings',
                data: Object.values(ratingDistribution || {}),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Rating Over Time Chart Data
    const ratingOverTimeData = {
        labels: ratingOverTime?.map(item => item.period) || [],
        datasets: [
            {
                label: 'Average Rating',
                data: ratingOverTime?.map(item => item.average) || [],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointBackgroundColor: 'rgb(75, 192, 192)',
            },
        ],
    };

    // Category Distribution Chart Data
    const categoryDistributionData = {
        labels: Object.keys(categoryDistribution || {}),
        datasets: [
            {
                label: 'Feedback by Category',
                data: Object.values(categoryDistribution || {}),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Rating by Category Chart Data
    const ratingByCategoryData = {
        labels: Object.keys(ratingByCategory || {}),
        datasets: [
            {
                label: 'Average Rating',
                data: Object.values(ratingByCategory || {}),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
            },
        ],
    };

    return (
        <div className="space-y-8">
            {/* Overall Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Average Rating</h3>
                    <div className="flex items-end">
                        <div className="text-3xl font-bold text-blue-700">{averageRating?.toFixed(2) || 'N/A'}</div>
                        <div className="ml-2 text-sm text-blue-600 mb-1">/ 5.00</div>
                    </div>
                    <div className="flex mt-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-5 h-5 ${star <= Math.round(averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Total Feedbacks</h3>
                    <div className="text-3xl font-bold text-green-700">
                        {Object.values(ratingDistribution || {}).reduce((a, b) => a + b, 0)}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow">
                    <h3 className="text-lg font-medium text-purple-800 mb-2">Top Category</h3>
                    <div className="text-3xl font-bold text-purple-700">
                        {Object.entries(categoryDistribution || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Rating Distribution */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Distribution</h3>
                    <div className="h-80">
                        <Bar
                            data={ratingDistributionData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return `Count: ${context.raw}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Number of Feedbacks'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Rating Over Time */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Trends</h3>
                    <div className="h-80">
                        <Line
                            data={ratingOverTimeData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 5,
                                        title: {
                                            display: true,
                                            text: 'Average Rating'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Feedback by Category</h3>
                    <div className="h-80 flex justify-center">
                        <div className="w-80">
                            <Doughnut
                                data={categoryDistributionData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Rating by Category */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Rating by Category</h3>
                    <div className="h-80 flex justify-center">
                        <div className="w-80">
                            <Radar
                                data={ratingByCategoryData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        r: {
                                            min: 0,
                                            max: 5,
                                            ticks: {
                                                stepSize: 1
                                            }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackAnalyticsChart;