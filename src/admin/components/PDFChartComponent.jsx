import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    // Basic container styles
    container: {
        marginTop: 10,
        marginBottom: 10,
    },

    // Bar chart styles
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    barLabel: {
        width: '25%',
        fontSize: 8,
        fontWeight: 'bold',
        color: '#4B5563',
    },
    barValue: {
        fontSize: 8,
        color: '#4B5563',
        width: '10%',
        textAlign: 'right',
        paddingRight: 5,
    },
    barPercent: {
        fontSize: 8,
        color: '#6B7280',
        width: '15%',
        textAlign: 'right',
    },
    barContainer: {
        width: '50%',
        height: 12,
        backgroundColor: '#E5E7EB',
    },
    bar: {
        height: 12,
        backgroundColor: '#3B82F6',
    },

    // Pie chart styles
    pieContainer: {
        marginVertical: 10,
    },
    pieRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    pieColorBox: {
        width: 10,
        height: 10,
        marginRight: 6,
    },
    pieLabel: {
        fontSize: 8,
        color: '#4B5563',
        width: '35%',
    },
    pieValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#4B5563',
        width: '15%',
    },
    pieBar: {
        height: 8,
        marginLeft: 5,
    },

    // Line chart styles
    lineChartContainer: {
        height: 120,
        marginBottom: 5,
        padding: 5,
    },
    lineAxis: {
        position: 'absolute',
        left: 30,
        bottom: 20,
        width: '90%',
        height: 1,
        backgroundColor: '#CBD5E0',
    },
    verticalAxis: {
        position: 'absolute',
        left: 30,
        bottom: 20,
        width: 1,
        height: 90,
        backgroundColor: '#CBD5E0',
    },
    dataPoint: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3B82F6',
        position: 'absolute',
    },
    dataLine: {
        height: 1,
        backgroundColor: '#3B82F6',
        position: 'absolute',
    },
    axisLabel: {
        position: 'absolute',
        fontSize: 6,
        color: '#6B7280',
    },

    noData: {
        fontSize: 8,
        color: '#6B7280',
        textAlign: 'center',
        marginVertical: 15,
    }
});

// Bar Chart Component for PDF
export const PDFBarChart = ({ data, colors }) => {
    if (!data || Object.keys(data).length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noData}>No data available</Text>
            </View>
        );
    }

    const defaultColors = {
        "18-25": "#3B82F6",
        "26-35": "#10B981",
        "36-45": "#F59E0B",
        "46+": "#EF4444",
    };

    // Calculate total for percentages
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    // Find max value for scaling
    const maxValue = Math.max(...Object.values(data));

    return (
        <View style={styles.container}>
            {Object.entries(data).map(([label, value], index) => {
                const percentage = total > 0 ? (value / total) * 100 : 0;
                const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const barColor = colors ? colors[label] : defaultColors[label] || '#3B82F6';

                return (
                    <View key={index} style={styles.barRow}>
                        <Text style={styles.barLabel}>{label}</Text>
                        <Text style={styles.barValue}>{value}</Text>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { width: `${width}%`, backgroundColor: barColor }]} />
                        </View>
                        <Text style={styles.barPercent}>{percentage.toFixed(1)}%</Text>
                    </View>
                );
            })}
        </View>
    );
};

// Pie Chart Legend Component (simplified to be visible in PDF)
export const PDFPieChartLegend = ({ data }) => {
    if (!data || !data.labels || !data.datasets) {
        return (
            <View style={styles.container}>
                <Text style={styles.noData}>No data available</Text>
            </View>
        );
    }

    const { labels, datasets } = data;
    const values = datasets[0].data;
    const colors = datasets[0].backgroundColor;

    // Calculate total for percentages
    const total = values.reduce((sum, value) => sum + value, 0);

    return (
        <View style={styles.pieContainer}>
            {labels.map((label, index) => {
                const value = values[index];
                const percentage = total > 0 ? (value / total) * 100 : 0;
                const width = percentage > 0 ? `${Math.min(percentage * 2, 100)}%` : '1%';

                return (
                    <View key={index} style={styles.pieRow}>
                        <View style={[styles.pieColorBox, { backgroundColor: colors[index] }]} />
                        <Text style={styles.pieLabel}>{label}</Text>
                        <Text style={styles.pieValue}>{value}</Text>
                        <View style={[styles.pieBar, { width, backgroundColor: colors[index] }]} />
                        <Text style={styles.barPercent}>{percentage.toFixed(1)}%</Text>
                    </View>
                );
            })}
        </View>
    );
};

// Rating Chart Component
export const PDFRatingChart = ({ ratingDistribution }) => {
    if (!ratingDistribution) {
        return (
            <View style={styles.container}>
                <Text style={styles.noData}>No rating data available</Text>
            </View>
        );
    }

    // Calculate total for percentages
    const total = Object.values(ratingDistribution).reduce((sum, value) => sum + value, 0);

    // Find max value for scaling
    const maxValue = Math.max(...Object.values(ratingDistribution));

    // Star ratings (5 to 1)
    const ratings = [5, 4, 3, 2, 1];

    // Colors for rating bars
    const ratingColors = {
        5: '#22C55E', // Green
        4: '#10B981', // Emerald
        3: '#FBBF24', // Amber
        2: '#F59E0B', // Orange
        1: '#EF4444', // Red
    };

    return (
        <View style={styles.container}>
            {ratings.map((rating) => {
                const value = ratingDistribution[rating] || 0;
                const percentage = total > 0 ? (value / total) * 100 : 0;
                const width = maxValue > 0 ? (value / maxValue) * 100 : 0;

                return (
                    <View key={rating} style={styles.barRow}>
                        <Text style={styles.barLabel}>{rating} {rating === 1 ? 'Star' : 'Stars'}</Text>
                        <Text style={styles.barValue}>{value}</Text>
                        <View style={styles.barContainer}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        width: `${width}%`,
                                        backgroundColor: ratingColors[rating] || '#3B82F6'
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.barPercent}>{percentage.toFixed(1)}%</Text>
                    </View>
                );
            })}
        </View>
    );
};

// Category Distribution Chart
export const PDFCategoryChart = ({ categoryDistribution }) => {
    if (!categoryDistribution || Object.keys(categoryDistribution).length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noData}>No category data available</Text>
            </View>
        );
    }

    // Calculate total for percentages
    const total = Object.values(categoryDistribution).reduce((sum, value) => sum + value, 0);

    // Find max value for scaling
    const maxValue = Math.max(...Object.values(categoryDistribution));

    // Category colors
    const categoryColors = {
        'Site Experience': '#3B82F6',
        'User Interface': '#10B981',
        'Content Quality': '#F59E0B',
        'Feature Request': '#8B5CF6',
        'Bug Report': '#EF4444',
        'Uncategorized': '#6B7280',
    };

    return (
        <View style={styles.container}>
            {Object.entries(categoryDistribution).map(([category, value], index) => {
                const percentage = total > 0 ? (value / total) * 100 : 0;
                const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const color = categoryColors[category] || '#6B7280';

                return (
                    <View key={index} style={styles.barRow}>
                        <Text style={styles.barLabel}>{category}</Text>
                        <Text style={styles.barValue}>{value}</Text>
                        <View style={styles.barContainer}>
                            <View
                                style={[
                                    styles.bar,
                                    { width: `${width}%`, backgroundColor: color }
                                ]}
                            />
                        </View>
                        <Text style={styles.barPercent}>{percentage.toFixed(1)}%</Text>
                    </View>
                );
            })}
        </View>
    );
};

// Rating By Category Chart
export const PDFRatingByCategoryChart = ({ ratingByCategory }) => {
    if (!ratingByCategory || Object.keys(ratingByCategory).length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noData}>No category rating data available</Text>
            </View>
        );
    }

    // Category colors
    const categoryColors = {
        'Site Experience': '#3B82F6',
        'User Interface': '#10B981',
        'Content Quality': '#F59E0B',
        'Feature Request': '#8B5CF6',
        'Bug Report': '#EF4444',
        'Uncategorized': '#6B7280',
    };

    return (
        <View style={styles.container}>
            {Object.entries(ratingByCategory).map(([category, rating], index) => {
                const width = (rating / 5) * 100; // Scale to percentage of 5 stars
                const color = categoryColors[category] || '#6B7280';

                return (
                    <View key={index} style={styles.barRow}>
                        <Text style={styles.barLabel}>{category}</Text>
                        <Text style={styles.barValue}>{rating.toFixed(1)}</Text>
                        <View style={styles.barContainer}>
                            <View
                                style={[
                                    styles.bar,
                                    { width: `${width}%`, backgroundColor: color }
                                ]}
                            />
                        </View>
                        <Text style={styles.barPercent}>{rating.toFixed(1)}/5</Text>
                    </View>
                );
            })}
        </View>
    );
};

// Simplified Line Chart for Rating Over Time
export const PDFLineChart = ({ data, timeKey = "period", valueKey = "average" }) => {
    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noData}>No timeline data available</Text>
            </View>
        );
    }

    // Simplify to max 6 points
    const maxPoints = 6;
    const simplifiedData = data.length > maxPoints
        ? data.slice(data.length - maxPoints)
        : data;

    // Find min/max values
    const values = simplifiedData.map(item => item[valueKey]);
    const minValue = Math.floor(Math.min(...values) * 0.9);
    const maxValue = Math.ceil(Math.max(...values) * 1.1);
    const valueRange = maxValue - minValue;

    // Calculate positions
    const chartWidth = 200;
    const chartHeight = 80;
    const pointWidth = chartWidth / (simplifiedData.length - 1 || 1);

    const positions = simplifiedData.map((item, index) => {
        const x = 30 + (index * pointWidth);
        const normalizedValue = valueRange > 0 ? (item[valueKey] - minValue) / valueRange : 0.5;
        const y = 100 - (normalizedValue * chartHeight);
        return { x, y, value: item[valueKey], label: item[timeKey] };
    });

    return (
        <View style={[styles.lineChartContainer, { width: chartWidth + 60 }]}>
            {/* Y-axis labels */}
            <Text style={[styles.axisLabel, { left: 5, bottom: 15 }]}>{minValue}</Text>
            <Text style={[styles.axisLabel, { left: 5, bottom: 58 }]}>{((maxValue + minValue) / 2).toFixed(1)}</Text>
            <Text style={[styles.axisLabel, { left: 5, bottom: 100 }]}>{maxValue}</Text>

            {/* Axes */}
            <View style={styles.verticalAxis} />
            <View style={styles.lineAxis} />

            {/* Data points and lines */}
            {positions.map((pos, index) => (
                <React.Fragment key={index}>
                    {/* Data point */}
                    <View
                        style={[
                            styles.dataPoint,
                            { left: pos.x - 2, bottom: pos.y - 2 }
                        ]}
                    />

                    {/* Line to next point */}
                    {index < positions.length - 1 && (
                        <View
                            style={[
                                styles.dataLine,
                                {
                                    left: pos.x,
                                    bottom: pos.y,
                                    width: pointWidth,
                                    transform: [
                                        {
                                            rotate: `${Math.atan2(
                                                positions[index + 1].y - pos.y,
                                                positions[index + 1].x - pos.x
                                            )}rad`
                                        }
                                    ],
                                    transformOrigin: 'left'
                                }
                            ]}
                        />
                    )}

                    {/* X-axis label */}
                    <Text style={[
                        styles.axisLabel,
                        {
                            left: pos.x - 15,
                            bottom: 2,
                            width: 30,
                            textAlign: 'center'
                        }
                    ]}>
                        {pos.label.split(' ')[0]}
                    </Text>
                </React.Fragment>
            ))}
        </View>
    );
};

export const PDFComparisonChart = ({ title, data, activeColor = '#22C55E', inactiveColor = '#EF4444' }) => {
    if (!data || !data.active || !data.inactive) {
        return null;
    }

    const total = data.active + data.inactive;
    const activePercentage = total > 0 ? (data.active / total) * 100 : 0;
    const inactivePercentage = total > 0 ? (data.inactive / total) * 100 : 0;

    return (
        <View style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#4B5563', marginBottom: 3 }}>{title}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                <View style={{ flex: activePercentage, height: 8, backgroundColor: activeColor }} />
                <View style={{ flex: inactivePercentage, height: 8, backgroundColor: inactiveColor }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                <Text style={{ fontSize: 7, color: '#4B5563' }}>
                    Active: {data.active} ({activePercentage.toFixed(1)}%)
                </Text>
                <Text style={{ fontSize: 7, color: '#4B5563' }}>
                    Inactive: {data.inactive} ({inactivePercentage.toFixed(1)}%)
                </Text>
            </View>
        </View>
    );
};