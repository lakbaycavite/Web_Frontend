import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import {
    PDFBarChart,
    PDFPieChartLegend,
    PDFComparisonChart,
    PDFRatingChart,
    PDFCategoryChart,
    PDFRatingByCategoryChart,
    PDFLineChart
} from './PDFChartComponent';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        paddingBottom: 60, // Increased bottom padding to prevent overlap with footer
        fontFamily: 'Helvetica',
        fontSize: 12,
    },
    header: {
        backgroundColor: '#035594',
        padding: 15,
        marginBottom: 15,
        marginHorizontal: -30,
        marginTop: -30,
        textAlign: 'center',
        color: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 5,
    },
    date: {
        fontSize: 9,
        marginTop: 5,
    },
    dateRange: {
        fontSize: 10,
        marginTop: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 4,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#035594',
        paddingBottom: 2,
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
        borderRadius: 4,
        padding: 8,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#035594',
    },
    cardTitle: {
        fontSize: 10,
        fontWeight: 'medium',
        marginBottom: 3,
        color: '#374151',
    },
    cardValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    cardSubtitle: {
        fontSize: 8,
        color: '#6B7280',
        marginTop: 2,
    },
    highlight: {
        color: '#10B981',
        fontWeight: 'bold',
    },
    warning: {
        color: '#F59E0B',
        fontWeight: 'bold',
    },
    danger: {
        color: '#EF4444',
        fontWeight: 'bold',
    },
    tableHeader: {
        backgroundColor: '#E5E7EB',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    tableHeaderCell: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    tableCell: {
        fontSize: 7,
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
        backgroundColor: 'white', // Add background to prevent content showing through
    },
    summaryBox: {
        backgroundColor: '#F0F9FF',
        padding: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    summaryTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#035594',
        marginBottom: 4,
    },
    summaryText: {
        fontSize: 8,
        color: '#4B5563',
        lineHeight: 1.4,
    },
    noData: {
        fontSize: 9,
        color: '#6B7280',
        textAlign: 'center',
        padding: 15,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    ratingValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 5,
        color: '#22C55E',
    },
    starIcon: {
        color: '#F59E0B',
        fontSize: 16,
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

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return moment(dateString).format('MM/DD/YY');
    };

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap>
                {/* Header */}
                <View style={styles.header} fixed>
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
                <View style={styles.section} break={false}>
                    <Text style={styles.sectionTitle}>Executive Summary</Text>

                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryTitle}>System Health Overview</Text>
                        <Text style={styles.summaryText}>
                            The Lakbay Cavite platform currently has {dashboardData.totalUsers || 0} registered users, with {dashboardData.totalActiveUsers || 0} active users.
                            There are {dashboardData.totalPosts || 0} posts, {dashboardData.totalEvents || 0} events, and {dashboardData.totalHotlines || 0} emergency contacts in the system.
                            {analysis.summary && `\n\n${analysis.summary}`}
                        </Text>
                    </View>

                    {/* Feedback Summary */}
                    {dashboardData.feedbackAnalytics && (
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Feedback Analysis</Text>
                            <Text style={styles.summaryText}>
                                The platform has received {dashboardData.totalFeedbacks || 0} feedback submissions with an average rating of {dashboardData.feedbackAnalytics.averageRating?.toFixed(1) || 'N/A'} stars.
                                {analysis.feedback && `\n\n${analysis.feedback}`}
                            </Text>
                        </View>
                    )}

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
                <View style={styles.section} break={false}>
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
                                <Text style={styles.cardTitle}>Total Feedbacks</Text>
                                <Text style={styles.cardValue}>{dashboardData.totalFeedbacks || 0}</Text>
                                <View style={styles.ratingBox}>
                                    <Text style={styles.cardSubtitle}>
                                        Avg. Rating: <Text style={styles.highlight}>{dashboardData.feedbackAnalytics?.averageRating?.toFixed(1) || 'N/A'}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Status Comparison Charts */}
                    <View style={{ marginVertical: 8 }}>
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
                            activeColor="#10B981"
                            inactiveColor="#6B7280"
                        />
                    </View>
                </View>

                {/* User Demographics - This will break to a new page if needed */}
                <View style={styles.section} break>
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

                {/* Feedback Analysis */}
                <View style={styles.section} break={false}>
                    <Text style={styles.sectionTitle}>Feedback Analysis</Text>

                    <View style={styles.row}>
                        {/* Rating Distribution */}
                        <View style={styles.column}>
                            <Text style={styles.cardTitle}>Rating Distribution</Text>
                            {dashboardData.feedbackAnalytics && dashboardData.feedbackAnalytics.ratingDistribution ? (
                                <PDFRatingChart ratingDistribution={dashboardData.feedbackAnalytics.ratingDistribution} />
                            ) : (
                                <Text style={styles.noData}>No rating distribution available</Text>
                            )}
                        </View>

                        {/* Category Distribution */}
                        <View style={styles.lastColumn}>
                            <Text style={styles.cardTitle}>Feedback by Category</Text>
                            {dashboardData.feedbackAnalytics && dashboardData.feedbackAnalytics.categoryDistribution ? (
                                <PDFCategoryChart categoryDistribution={dashboardData.feedbackAnalytics.categoryDistribution} />
                            ) : (
                                <Text style={styles.noData}>No category distribution available</Text>
                            )}
                        </View>
                    </View>

                    {/* RESTORED SECTION: Rating Over Time and Rating By Category */}
                    <View style={styles.row}>
                        {/* Rating Over Time */}
                        <View style={styles.column}>
                            <Text style={styles.cardTitle}>Rating Trend Over Time</Text>
                            {dashboardData.feedbackAnalytics && dashboardData.feedbackAnalytics.ratingOverTime
                                && dashboardData.feedbackAnalytics.ratingOverTime.length > 0 ? (
                                <PDFLineChart data={dashboardData.feedbackAnalytics.ratingOverTime} />
                            ) : (
                                <Text style={styles.noData}>No rating trend data available</Text>
                            )}
                        </View>

                        {/* Rating By Category */}
                        <View style={styles.lastColumn}>
                            <Text style={styles.cardTitle}>Rating by Category</Text>
                            {dashboardData.feedbackAnalytics && dashboardData.feedbackAnalytics.ratingByCategory ? (
                                <PDFRatingByCategoryChart ratingByCategory={dashboardData.feedbackAnalytics.ratingByCategory} />
                            ) : (
                                <Text style={styles.noData}>No category rating data available</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* RESTORED SECTION: Recent Feedbacks */}
                <View style={styles.section} break={false}>
                    <Text style={styles.sectionTitle}>Recent Feedbacks</Text>

                    {dashboardData.tenRecentFeedbacks && dashboardData.tenRecentFeedbacks.length > 0 ? (
                        <>
                            <View style={styles.tableHeader}>
                                <View style={styles.col10}><Text style={styles.tableHeaderCell}>#</Text></View>
                                <View style={styles.col20}><Text style={styles.tableHeaderCell}>User</Text></View>
                                <View style={styles.col10}><Text style={styles.tableHeaderCell}>Rating</Text></View>
                                <View style={styles.col15}><Text style={styles.tableHeaderCell}>Category</Text></View>
                                <View style={styles.col30}><Text style={styles.tableHeaderCell}>Comment</Text></View>
                                <View style={styles.col15}><Text style={styles.tableHeaderCell}>Date</Text></View>
                            </View>

                            {dashboardData.tenRecentFeedbacks.slice(0, 5).map((feedback, index) => (
                                <View key={`feedback-${index}`} style={styles.tableRow}>
                                    <View style={styles.col10}><Text style={styles.tableCell}>{index + 1}</Text></View>
                                    <View style={styles.col20}>
                                        <Text style={styles.tableCell}>
                                            {formatUserName(feedback.user)}
                                        </Text>
                                    </View>
                                    <View style={styles.col10}>
                                        <Text style={styles.tableCell}>
                                            {feedback.rating || 'N/A'} {feedback.rating ? '★' : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.col15}>
                                        <Text style={styles.tableCell}>
                                            {feedback.category || 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.col30}>
                                        <Text style={styles.tableCell}>
                                            {truncateText(feedback.comment, 40)}
                                        </Text>
                                    </View>
                                    <View style={styles.col15}>
                                        <Text style={styles.tableCell}>
                                            {formatDate(feedback.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={styles.noData}>No recent feedbacks available</Text>
                    )}
                </View>

                {/* Recent Users */}
                <View style={styles.section} break={false}>
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
                                            {formatDate(user.createdAt)}
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