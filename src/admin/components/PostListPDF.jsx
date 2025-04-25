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
    dateRange: {
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
        justifyContent: 'space-between',
        backgroundColor: '#F5F8FF',
        padding: 10,
        borderRadius: 5,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        backgroundColor: '#3366CC',
        minHeight: 30,
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        minHeight: 30,
        alignItems: 'center',
    },
    tableCol1: {
        width: '8%',
        textAlign: 'center',
        paddingVertical: 5,
    },
    tableCol2: {
        width: '37%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol3: {
        width: '20%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol4: {
        width: '20%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol5: {
        width: '15%',
        textAlign: 'center',
        paddingVertical: 5,
    },
    headerCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    cell: {
        fontSize: 9,
    },
    contentCell: {
        fontSize: 9,
        maxLines: 3,
    },
    activeStatus: {
        fontSize: 9,
        color: '#27AE60',
        fontWeight: 'bold',
    },
    inactiveStatus: {
        fontSize: 9,
        color: '#E74C3C',
        fontWeight: 'bold',
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
    noPosts: {
        textAlign: 'center',
        fontSize: 12,
        color: '#555555',
        marginTop: 40,
        marginBottom: 40,
        fontStyle: 'italic',
    },
});

// Create Document Component
const PostListPDF = ({ posts, totalVisible, totalHidden, reportTitle = "Posts Report", dateRange = null, adminUser }) => {
    const currentDate = moment().format('MMMM Do, YYYY [at] h:mm A');

    // Function to truncate content to a reasonable length
    const truncateContent = (content, maxLength = 100) => {
        if (!content) return 'No content';
        return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    };

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

                    {dateRange && (
                        <Text style={styles.dateRange}>
                            Date Range: {dateRange.start} to {dateRange.end}
                        </Text>
                    )}
                </View>

                {/* Statistics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Posts Statistics</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Total Posts</Text>
                            <Text style={styles.statValue}>{posts.length}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Visible Posts</Text>
                            <Text style={[styles.statValue, { color: '#27AE60' }]}>{totalVisible}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Hidden Posts</Text>
                            <Text style={[styles.statValue, { color: '#E74C3C' }]}>{totalHidden}</Text>
                        </View>
                    </View>
                </View>

                {/* Posts Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Post List</Text>

                    {posts.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <View style={styles.tableHeaderRow}>
                                <View style={styles.tableCol1}><Text style={styles.headerCell}>No.</Text></View>
                                <View style={styles.tableCol2}><Text style={styles.headerCell}>Content</Text></View>
                                <View style={styles.tableCol3}><Text style={styles.headerCell}>Author</Text></View>
                                <View style={styles.tableCol4}><Text style={styles.headerCell}>Date Created</Text></View>
                                <View style={styles.tableCol5}><Text style={styles.headerCell}>Status</Text></View>
                            </View>

                            {/* Table Rows */}
                            {posts.map((post, index) => (
                                <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.alternateRow : {}]}>
                                    <View style={styles.tableCol1}><Text style={styles.cell}>{index + 1}</Text></View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.contentCell}>{truncateContent(post.content)}</Text>
                                    </View>
                                    <View style={styles.tableCol3}>
                                        <Text style={styles.cell}>
                                            {post.user?.username || "Unknown User"}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCol4}>
                                        <Text style={styles.cell}>
                                            {moment(post.createdAt).format("MMM DD, YYYY")}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCol5}>
                                        <Text style={post.is_hidden ? styles.inactiveStatus : styles.activeStatus}>
                                            {post.is_hidden ? "Hidden" : "Visible"}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View>
                            <Text style={styles.noPosts}>No posts found for the selected criteria</Text>
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

export default PostListPDF;