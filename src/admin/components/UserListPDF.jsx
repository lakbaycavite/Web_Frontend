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
        width: '30%',
        alignItems: 'center',
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
        width: '20%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol3: {
        width: '22%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol4: {
        width: '25%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol5: {
        width: '15%',
        textAlign: 'center',
        paddingVertical: 5,
    },
    tableCol6: {
        width: '10%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        textAlign: 'center',
    },
    headerCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    cell: {
        fontSize: 9,
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
    noUsers: {
        textAlign: 'center',
        fontSize: 12,
        color: '#555555',
        marginTop: 40,
        marginBottom: 40,
        fontStyle: 'italic',
    },
});

// Create Document Component
const UserListPDF = ({ users, totalActiveUsers, totalInactiveUsers, reportTitle = "User Management Report", dateRange = null }) => {
    const currentDate = moment().format('MMMM Do, YYYY [at] h:mm A');

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
                            Registration Date Range: {dateRange.start} to {dateRange.end}
                        </Text>
                    )}
                </View>

                {/* Statistics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Statistics</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Total Users</Text>
                            <Text style={styles.statValue}>{users.length}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Active Users</Text>
                            <Text style={[styles.statValue, { color: '#27AE60' }]}>{totalActiveUsers}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Inactive Users</Text>
                            <Text style={[styles.statValue, { color: '#E74C3C' }]}>{totalInactiveUsers}</Text>
                        </View>
                    </View>
                </View>

                {/* Users Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User List</Text>

                    {users.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <View style={styles.tableHeaderRow}>
                                <View style={styles.tableCol1}><Text style={styles.headerCell}>No.</Text></View>
                                <View style={styles.tableCol2}><Text style={styles.headerCell}>Username</Text></View>
                                <View style={styles.tableCol3}><Text style={styles.headerCell}>Full Name</Text></View>
                                <View style={styles.tableCol4}><Text style={styles.headerCell}>Email</Text></View>
                                <View style={styles.tableCol5}><Text style={styles.headerCell}>Status</Text></View>
                                <View style={styles.tableCol6}><Text style={styles.headerCell}>Joined</Text></View>
                            </View>

                            {/* Table Rows */}
                            {users.map((user, index) => (
                                <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.alternateRow : {}]}>
                                    <View style={styles.tableCol1}><Text style={styles.cell}>{index + 1}</Text></View>
                                    <View style={styles.tableCol2}><Text style={styles.cell}>{user.username || "N/A"}</Text></View>
                                    <View style={styles.tableCol3}>
                                        <Text style={styles.cell}>
                                            {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCol4}><Text style={styles.cell}>{user.email || "N/A"}</Text></View>
                                    <View style={styles.tableCol5}>
                                        <Text style={user.isActive ? styles.activeStatus : styles.inactiveStatus}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </Text>
                                    </View>
                                    <View style={styles.tableCol6}>
                                        <Text style={styles.cell}>{moment(user.createdAt).format("MM/DD/YY")}</Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View>
                            <Text style={styles.noUsers}>No users found for the selected criteria</Text>
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

export default UserListPDF;