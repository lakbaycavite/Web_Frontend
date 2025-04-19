import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    // Bar Chart Styles
    barChartContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    barLabel: {
        width: '20%',
        fontSize: 9,
        color: '#4B5563',
    },
    barBase: {
        width: '65%',
        height: 12,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        position: 'relative',
    },
    bar: {
        height: 12,
        backgroundColor: '#035594',
        borderRadius: 2,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    barValue: {
        width: '15%',
        fontSize: 9,
        color: '#4B5563',
        textAlign: 'right',
        marginLeft: 5,
    },

    // Pie Chart Styles
    pieChartContainer: {
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    pieChartLegend: {
        marginTop: 10,
        width: '100%',
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    legendColor: {
        width: 10,
        height: 10,
        marginRight: 5,
    },
    legendLabel: {
        fontSize: 9,
        color: '#4B5563',
        marginRight: 5,
    },
    legendValue: {
        fontSize: 9,
        color: '#4B5563',
        fontWeight: 'bold',
    },
    legendPercent: {
        fontSize: 9,
        color: '#6B7280',
        marginLeft: 3,
    },
    pieSegment: {
        position: 'absolute',
    }
});

// Bar Chart Component for PDF
export const PDFBarChart = ({ data, height = 150 }) => {
    if (!data || !Object.keys(data).length) {
        return (
            <View style={styles.barChartContainer}>
                <Text style={{ fontSize: 9, color: '#6B7280', textAlign: 'center' }}>
                    No data available
                </Text>
            </View>
        );
    }

    const maxValue = Math.max(...Object.values(data));

    return (
        <View style={styles.barChartContainer}>
            {Object.entries(data).map(([label, value], index) => {
                const percentage = (value / maxValue) * 100;

                return (
                    <View key={`bar-${index}`} style={styles.barRow}>
                        <Text style={styles.barLabel}>{label}</Text>
                        <View style={styles.barBase}>
                            <View style={[styles.bar, { width: `${percentage}%` }]} />
                        </View>
                        <Text style={styles.barValue}>{value}</Text>
                    </View>
                );
            })}
        </View>
    );
};

// Custom component to render visual representation of a pie chart's data
export const PDFPieChartLegend = ({ data }) => {
    if (!data || !data.labels || !data.datasets) {
        return (
            <View style={styles.pieChartContainer}>
                <Text style={{ fontSize: 9, color: '#6B7280', textAlign: 'center' }}>
                    No data available
                </Text>
            </View>
        );
    }

    const { labels, datasets } = data;
    const values = datasets[0].data;
    const colors = datasets[0].backgroundColor;
    const total = values.reduce((sum, value) => sum + value, 0);

    // Create color blocks with labels and values
    return (
        <View style={styles.pieChartContainer}>
            {/* Visual representation using color blocks instead of actual pie segments */}
            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                {values.map((value, index) => {
                    const percentage = total > 0 ? (value / total) * 100 : 0;
                    // Width proportional to the percentage
                    const width = percentage > 0 ? percentage : 0;

                    return (
                        <View
                            key={`segment-${index}`}
                            style={{
                                height: 40,
                                width: `${width}%`,
                                backgroundColor: colors[index],
                                marginRight: index < values.length - 1 ? 1 : 0,
                            }}
                        />
                    );
                })}
            </View>

            {/* Legend with exact values */}
            <View style={styles.pieChartLegend}>
                {labels.map((label, index) => {
                    const value = values[index];
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

                    return (
                        <View key={`legend-${index}`} style={styles.legendRow}>
                            <View
                                style={[
                                    styles.legendColor,
                                    { backgroundColor: colors[index] }
                                ]}
                            />
                            <Text style={styles.legendLabel}>{label}</Text>
                            <Text style={styles.legendValue}>{value}</Text>
                            <Text style={styles.legendPercent}>({percentage}%)</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// Create a simple horizontal data comparison chart
export const PDFComparisonChart = ({ title, data, activeColor = '#32cc32', inactiveColor = '#DC2626' }) => {
    if (!data || !data.active || !data.inactive) {
        return null;
    }

    const total = data.active + data.inactive;
    const activePercentage = total > 0 ? (data.active / total) * 100 : 0;
    const inactivePercentage = total > 0 ? (data.inactive / total) * 100 : 0;

    return (
        <View style={{ marginVertical: 5 }}>
            <Text style={{ fontSize: 9, color: '#4B5563', marginBottom: 3 }}>{title}</Text>
            <View style={{ flexDirection: 'row', height: 15, marginBottom: 2 }}>
                <View
                    style={{
                        width: `${activePercentage}%`,
                        backgroundColor: activeColor,
                        borderTopLeftRadius: 2,
                        borderBottomLeftRadius: 2,
                    }}
                />
                <View
                    style={{
                        width: `${inactivePercentage}%`,
                        backgroundColor: inactiveColor,
                        borderTopRightRadius: 2,
                        borderBottomRightRadius: 2,
                    }}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 8, color: '#4B5563' }}>
                    Active: {data.active} ({activePercentage.toFixed(1)}%)
                </Text>
                <Text style={{ fontSize: 8, color: '#4B5563' }}>
                    Inactive: {data.inactive} ({inactivePercentage.toFixed(1)}%)
                </Text>
            </View>
        </View>
    );
};