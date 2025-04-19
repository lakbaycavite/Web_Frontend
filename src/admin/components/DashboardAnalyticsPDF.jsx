import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import { PDFBarChart, PDFPieChartLegend, PDFComparisonChart } from './PDFChartComponent';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        backgroundColor: '#035594',
        padding: 20,
        marginBottom: 20,
        marginHorizontal: -30,
        marginTop: -30,
        textAlign: 'center',
        color: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 10,
    },
    date: {
        fontSize: 10,
        marginTop: 5,
    },
    dateRange: {
        fontSize: 11,
        marginTop: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 4,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#035594',
        paddingBottom: 5,
        color: '#035594',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    column: {
        flex: 1,
        marginRight: 10,
    },
    lastColumn: {
        flex: 1,
        marginRight: 0,
    },
    card: {
        backgroundColor: '#F8FAFC',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#035594',
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: 'medium',
        marginBottom: 5,
        color: '#374151',
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    cardSubtitle: {
        fontSize: 9,
        color: '#6B7280',
        marginTop: 2,
    },
    highlight: {
        color: '#32cc32',
        fontWeight: 'bold',
    },
    warning: {
        color: '#F59E0B',
        fontWeight: 'bold',
    },
    danger: {
        color: '#DC2626',
        fontWeight: 'bold',
    },
    tableHeader: {
        backgroundColor: '#E5E7EB',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
        paddingVertical: 8,
        paddingHorizontal: 5,
    },
    tableHeaderCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 6,
        paddingHorizontal: 5,
    },
    tableCell: {
        fontSize: 9,
        color: '#4B5563',
    },
    col10: { width: '10%' },
    col15: { width: '15%' },
    col20: { width: '20%' },
    col25: { width: '25%' },
    col30: { width: '30%' },
    col40: { width: '40%' },
    col50: { width: '50%' },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        fontSize: 8,
        color: '#9CA3AF',
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 5,
    },
    summaryBox: {
        backgroundColor: '#F0F9FF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    summaryTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#035594',
        marginBottom: 5,
    },
    summaryText: {
        fontSize: 9,
        color: '#4B5563',
        lineHeight: 1.5,
    },
    noData: {
        fontSize: 9,
        color: '#6B7280',
        textAlign: 'center',
        padding: 20,
    }
});

// Create Document Component
const DashboardAnalyticsPDF = ({
    dashboardData,
    chartData,
    ageGroups,
    reportTitle = "Dashboard Analytics Report",
    dateRange = null,
    analysis = {} // Optional analysis/insights text
}) => {
    const currentDate = moment().format('MMMM Do, YYYY [at] h:mm A');

    // Format name from user object
    const formatUserName = (user) => {
        if (!user) return 'N/A';
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
        if (user.firstName) return user.firstName;
        if (user.username) return user.username;
        return 'N/A';
    };

    // Truncate text
    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Lakbay Cavite</Text>
                    <Text style={styles.subtitle}>{reportTitle}</Text>
                    <Text style={styles.date}>Generated on: {currentDate}</Text>

                    {dateRange && (
                        <Text style={styles.dateRange}>
                            Period: {dateRange.start} to {dateRange.end}
                        </Text>
                    )}
                </View>

                {/* Executive Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Executive Summary</Text>

                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryTitle}>System Health Overview</Text>
                        <Text style={styles.summaryText}>
                            The Lakbay Cavite platform currently has {dashboardData.totalUsers || 0} registered users, with {dashboardData.totalActiveUsers || 0} active users.
                            There are {dashboardData.totalPosts || 0} posts, {dashboardData.totalEvents || 0} events, and {dashboardData.totalHotlines || 0} emergency contacts in the system.
                            {analysis.summary && `\n\n${analysis.summary}`}
                        </Text>
                    </View>

                    {/* User Demographics Summary */}
                    {chartData && chartData.labels && (
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>User Demographics Insights</Text>
                            <Text style={styles.summaryText}>
                                The platform's user base consists primarily of {chartData.labels[0]} users ({chartData.datasets[0].data[0]}),
                                followed by {chartData.labels[1]} users ({chartData.datasets[0].data[1]}).
                                {analysis.demographics && `\n\n${analysis.demographics}`}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Summary Statistics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>System Statistics</Text>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Total Users</Text>
                                <Text style={styles.cardValue}>{dashboardData.totalUsers || 0}</Text>
                                <Text style={styles.cardSubtitle}>
                                    <Text style={styles.highlight}>{dashboardData.totalActiveUsers || 0}</Text> Active | {' '}
                                    <Text style={styles.danger}>{dashboardData.totalInactiveUsers || 0}</Text> Inactive
                                </Text>
                            </View>
                        </View>

                        <View style={styles.lastColumn}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Total Posts</Text>
                                <Text style={styles.cardValue}>{dashboardData.totalPosts || 0}</Text>
                                <Text style={styles.cardSubtitle}>
                                    <Text style={styles.highlight}>{dashboardData.totalActivePosts || 0}</Text> Visible | {' '}
                                    <Text style={styles.danger}>{dashboardData.totalInactivePosts || 0}</Text> Hidden
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Total Events</Text>
                                <Text style={styles.cardValue}>{dashboardData.totalEvents || 0}</Text>
                                <Text style={styles.cardSubtitle}>
                                    <Text style={styles.danger}>{dashboardData.doneEvents || 0}</Text> Done | {' '}
                                    <Text style={styles.warning}>{dashboardData.ongoingEvents || 0}</Text> Ongoing | {' '}
                                    <Text style={styles.highlight}>{dashboardData.upcomingEvents || 0}</Text> Upcoming
                                </Text>
                            </View>
                        </View>

                        <View style={styles.lastColumn}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Total Contacts</Text>
                                <Text style={styles.cardValue}>{dashboardData.totalHotlines || 0}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Status Comparison Charts */}
                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.cardTitle}>Content Status Analysis</Text>
                        <PDFComparisonChart
                            title="User Status"
                            data={{
                                active: dashboardData.totalActiveUsers || 0,
                                inactive: dashboardData.totalInactiveUsers || 0
                            }}
                        />

                        <PDFComparisonChart
                            title="Post Visibility"
                            data={{
                                active: dashboardData.totalActivePosts || 0,
                                inactive: dashboardData.totalInactivePosts || 0
                            }}
                        />

                        <PDFComparisonChart
                            title="Event Timeline"
                            data={{
                                active: dashboardData.upcomingEvents || 0,
                                inactive: dashboardData.doneEvents || 0
                            }}
                            activeColor="#32cc32"
                            inactiveColor="#6B7280"
                        />
                    </View>
                </View>

                {/* User Demographics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Demographics</Text>

                    <View style={styles.row}>
                        {/* Gender Distribution */}
                        <View style={styles.column}>
                            <Text style={styles.cardTitle}>Gender Distribution</Text>
                            {chartData ? (
                                <PDFPieChartLegend data={chartData} />
                            ) : (
                                <Text style={styles.noData}>No gender data available</Text>
                            )}
                        </View>

                        {/* Age Distribution */}
                        <View style={styles.lastColumn}>
                            <Text style={styles.cardTitle}>Age Distribution</Text>
                            {ageGroups && Object.keys(ageGroups).length > 0 ? (
                                <PDFBarChart data={ageGroups} />
                            ) : (
                                <Text style={styles.noData}>No age data available</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Recent Users */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Users</Text>

                    {dashboardData.recentUsers && dashboardData.recentUsers.length > 0 ? (
                        <>
                            <View style={styles.tableHeader}>
                                <View style={styles.col10}><Text style={styles.tableHeaderCell}>#</Text></View>
                                <View style={styles.col30}><Text style={styles.tableHeaderCell}>Name</Text></View>
                                <View style={styles.col30}><Text style={styles.tableHeaderCell}>Email</Text></View>
                                <View style={styles.col15}><Text style={styles.tableHeaderCell}>Gender</Text></View>
                                <View style={styles.col15}><Text style={styles.tableHeaderCell}>Joined</Text></View>
                            </View>

                            {dashboardData.recentUsers.map((user, index) => (
                                <View key={`user-${index}`} style={styles.tableRow}>
                                    <View style={styles.col10}><Text style={styles.tableCell}>{index + 1}</Text></View>
                                    <View style={styles.col30}>
                                        <Text style={styles.tableCell}>
                                            {formatUserName(user)}
                                        </Text>
                                    </View>
                                    <View style={styles.col30}><Text style={styles.tableCell}>{user.email || 'N/A'}</Text></View>
                                    <View style={styles.col15}>
                                        <Text style={styles.tableCell}>
                                            {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase() : 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.col15}>
                                        <Text style={styles.tableCell}>
                                            {user.createdAt ? moment(user.createdAt).format('MM/DD/YY') : 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={styles.noData}>No recent users available</Text>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text>© {moment().year()} Lakbay Cavite Administration - All rights reserved</Text>
                </View>
            </Page>
        </Document>
    );
};

export default DashboardAnalyticsPDF;