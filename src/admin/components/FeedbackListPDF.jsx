import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        backgroundColor: '#3366CC',
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
    filterInfo: {
        fontSize: 11,
        marginTop: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 4,
        borderRadius: 4,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3366CC',
        paddingBottom: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#F5F8FF',
        padding: 10,
        borderRadius: 5,
    },
    statColumns: {
        flex: 1,
        marginRight: 10,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    statValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    starRating: {
        flexDirection: 'row',
        width: 50,
    },
    ratingStat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    starSymbol: {
        fontSize: 10,
        marginRight: 2,
        color: '#F59E0B',
    },
    starEmpty: {
        fontSize: 10,
        marginRight: 2,
        color: '#D1D5DB',
    },
    categoryStat: {
        marginBottom: 3,
    },
    uiuxCategory: {
        color: '#8B5CF6',
    },
    performanceCategory: {
        color: '#3B82F6',
    },
    featuresCategory: {
        color: '#10B981',
    },
    bugCategory: {
        color: '#EF4444',
    },
    contentCategory: {
        color: '#F59E0B',
    },
    otherCategory: {
        color: '#6B7280',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        backgroundColor: '#3366CC',
        minHeight: 30,
        alignItems: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        minHeight: 40,
    },
    tableCol1: {
        width: '20%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol2: {
        width: '35%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol3: {
        width: '15%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol4: {
        width: '15%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol5: {
        width: '15%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    headerCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    cell: {
        fontSize: 9,
        paddingTop: 3,
    },
    cellSmall: {
        fontSize: 8,
        color: '#6B7280',
    },
    feedbackText: {
        fontSize: 9,
        marginTop: 3,
    },
    alternateRow: {
        backgroundColor: '#F9FAFC',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        fontSize: 8,
        color: '#999999',
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
        paddingTop: 5,
    },
    noFeedback: {
        textAlign: 'center',
        fontSize: 12,
        color: '#555555',
        marginTop: 40,
        marginBottom: 40,
        fontStyle: 'italic',
    },
    statusBadge: {
        fontSize: 8,
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 2,
        alignSelf: 'flex-start',
    },
    publicBadge: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
    },
    hiddenBadge: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
    },
    categoryBadge: {
        fontSize: 8,
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 2,
        alignSelf: 'flex-start',
    },
});

// Create Document Component
const FeedbackListPDF = ({
    feedbacks,
    ratingCounts,
    categoryCounts,
    reportTitle = "User Feedback Report",
    filters = {},
    adminUser = { adminUser }
}) => {
    const currentDate = moment().format('MMMM Do, YYYY [at] h:mm A');

    // Function to truncate text
    const truncateText = (text, maxLength = 120) => {
        if (!text) return 'No comment';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Function to get category style
    const getCategoryStyle = (category) => {
        switch (category) {
            case 'UI/UX': return styles.uiuxCategory;
            case 'Performance': return styles.performanceCategory;
            case 'Features': return styles.featuresCategory;
            case 'Bug': return styles.bugCategory;
            case 'Content': return styles.contentCategory;
            default: return styles.otherCategory;
        }
    };

    // Function to get category badge background
    const getCategoryBadgeStyle = (category) => {
        const bgColors = {
            'UI/UX': '#F3E8FF',
            'Performance': '#DBEAFE',
            'Features': '#D1FAE5',
            'Bug': '#FEE2E2',
            'Content': '#FEF3C7',
            'All/Other': '#F3F4F6',
        };

        return {
            backgroundColor: bgColors[category] || bgColors['All/Other'],
        };
    };

    // Render stars for rating
    const renderStars = (rating) => {
        let stars = [];

        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<Text key={i} style={styles.starSymbol}>★</Text>);
            } else {
                stars.push(<Text key={i} style={styles.starEmpty}>★</Text>);
            }
        }

        return <View style={styles.starRating}>{stars}</View>;
    };

    // Total feedback count
    const totalFeedbacks = feedbacks.length;

    // Calculate average rating
    const totalRatingScore = Object.entries(ratingCounts).reduce(
        (sum, [rating, count]) => sum + (Number(rating) * count), 0
    );
    const avgRating = totalFeedbacks > 0 ?
        (totalRatingScore / totalFeedbacks).toFixed(1) :
        "N/A";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Lakbay Cavite</Text>
                    <Text style={styles.subtitle}>{reportTitle}</Text>
                    <Text style={styles.date}>Generated on: {currentDate}</Text>
                    {adminUser.firstName || adminUser.lastName ? (
                        <Text style={styles.date}>Prepared By: {adminUser?.firstName} {adminUser?.lastName} (Admin)</Text>
                    ) : (
                        <>
                            <Text style={styles.date}>Prepared By: Admin</Text>
                        </>
                    )}

                    {(filters.rating || filters.category) && (
                        <Text style={styles.filterInfo}>
                            {filters.rating && filters.category ?
                                `Filters: ${filters.rating} Stars, Category: ${filters.category}` :
                                filters.rating ?
                                    `Filter: ${filters.rating} Stars` :
                                    `Filter: Category: ${filters.category}`
                            }
                        </Text>
                    )}
                </View>

                {/* Statistics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feedback Statistics</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statColumns}>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Total Feedback:</Text>
                                <Text style={styles.statValue}>{totalFeedbacks}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Average Rating:</Text>
                                <Text style={styles.statValue}>{avgRating} / 5</Text>
                            </View>
                            <Text style={[styles.statLabel, { marginTop: 5, marginBottom: 3 }]}>Ratings Distribution:</Text>
                            {[5, 4, 3, 2, 1].map(rating => (
                                <View key={`rating-${rating}`} style={styles.ratingStat}>
                                    <Text style={styles.statLabel}>{rating} ★: </Text>
                                    <Text style={styles.statValue}>{ratingCounts[rating] || 0}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.statColumns}>
                            <Text style={[styles.statLabel, { marginBottom: 3 }]}>Category Distribution:</Text>
                            {Object.entries(categoryCounts).map(([category, count]) => (
                                <View key={`category-${category}`} style={styles.categoryStat}>
                                    <Text style={[styles.statLabel, getCategoryStyle(category)]}>
                                        {category}: <Text style={styles.statValue}>{count}</Text>
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Feedback Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feedback List</Text>

                    {feedbacks.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <View style={styles.tableHeaderRow}>
                                <View style={styles.tableCol1}><Text style={styles.headerCell}>User</Text></View>
                                <View style={styles.tableCol2}><Text style={styles.headerCell}>Feedback</Text></View>
                                <View style={styles.tableCol3}><Text style={styles.headerCell}>Category</Text></View>
                                <View style={styles.tableCol4}><Text style={styles.headerCell}>Rating</Text></View>
                                <View style={styles.tableCol5}><Text style={styles.headerCell}>Info</Text></View>
                            </View>

                            {/* Table Rows */}
                            {feedbacks.map((feedback, index) => (
                                <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.alternateRow : {}]}>
                                    <View style={styles.tableCol1}>
                                        <Text style={styles.cell}>
                                            {feedback.user?.firstName
                                                ? `${feedback.user.firstName} ${feedback.user.lastName || ''}`
                                                : feedback.user?.username || 'Unknown User'}
                                        </Text>
                                        <Text style={styles.cellSmall}>{feedback.user?.email || 'No email'}</Text>
                                    </View>

                                    <View style={styles.tableCol2}>
                                        <Text style={styles.feedbackText}>{truncateText(feedback.comment)}</Text>
                                    </View>

                                    <View style={styles.tableCol3}>
                                        <View style={[styles.categoryBadge, getCategoryBadgeStyle(feedback.category)]}>
                                            <Text style={[styles.cell, getCategoryStyle(feedback.category)]}>{feedback.category}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.tableCol4}>
                                        {renderStars(feedback.rating)}
                                    </View>

                                    <View style={styles.tableCol5}>
                                        <Text style={styles.cell}>
                                            {feedback.createdAt
                                                ? moment(feedback.createdAt).format('MMM D, YYYY')
                                                : 'Unknown date'}
                                        </Text>
                                        <View style={[
                                            styles.statusBadge,
                                            feedback.isPublic ? styles.publicBadge : styles.hiddenBadge
                                        ]}>
                                            <Text>{feedback.isPublic ? 'Public' : 'Hidden'}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View>
                            <Text style={styles.noFeedback}>No feedback found for the selected criteria</Text>
                        </View>
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

export default FeedbackListPDF;