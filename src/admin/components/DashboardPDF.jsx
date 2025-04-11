import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import moment from 'moment';

// Register fonts (optional, but makes the PDF look better)
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Roboto',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#035594',
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 18,
        marginTop: 15,
        marginBottom: 10,
        color: '#035594',
        fontWeight: 'bold',
    },
    infoContainer: {
        marginBottom: 20,
    },
    statRow: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottom: '1pt solid #EEEEEE',
        paddingBottom: 5,
    },
    statLabel: {
        width: '50%',
        fontWeight: 'bold',
    },
    statValue: {
        width: '50%',
    },
    demographicsContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    demographicsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        borderBottomStyle: 'solid',
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#F9F9F9',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 5,
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#888888',
        fontSize: 10,
    },
});

// Create a component for the PDF content
const DashboardPDFContent = ({ dashboardData, chartData, ageGroups }) => {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Text style={styles.header}>Dashboard Report</Text>
                <Text>Generated on: {currentDate}</Text>

                {/* Summary Stats */}
                <Text style={styles.subHeader}>Summary Statistics</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Total Users:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalUsers || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Active Users:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalActiveUsers || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Inactive Users:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalInactiveUsers || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Total Posts:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalPosts || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Visible Posts:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalActivePosts || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Hidden Posts:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalInactivePosts || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Total Events:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalEvents || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Done Events:</Text>
                        <Text style={styles.statValue}>{dashboardData.doneEvents || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Ongoing Events:</Text>
                        <Text style={styles.statValue}>{dashboardData.ongoingEvents || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Upcoming Events:</Text>
                        <Text style={styles.statValue}>{dashboardData.upcomingEvents || 0}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Total Contacts:</Text>
                        <Text style={styles.statValue}>{dashboardData.totalHotlines || 0}</Text>
                    </View>
                </View>

                {/* Demographics */}
                <Text style={styles.subHeader}>User Demographics</Text>

                {/* Gender Distribution Table */}
                <View style={styles.demographicsContainer}>
                    <Text style={styles.demographicsHeader}>Gender Distribution</Text>
                    {chartData && chartData.labels.length > 0 ? (
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Gender</Text>
                                <Text style={styles.tableCell}>Count</Text>
                            </View>
                            {chartData.labels.map((label, index) => (
                                <View key={index.toString()} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{label}</Text>
                                    <Text style={styles.tableCell}>{chartData.datasets[0].data[index]}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text>No gender data available</Text>
                    )}


                    <Text style={styles.demographicsHeader}>Age Distribution</Text>
                    {Object.keys(ageGroups).length > 0 ? (
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={styles.tableCell}>Age Group</Text>
                                <Text style={styles.tableCell}>Count</Text>
                            </View>
                            {Object.entries(ageGroups).map(([ageGroup, count], index) => (
                                <View key={index.toString()} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{ageGroup}</Text>
                                    <Text style={styles.tableCell}>{count}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text>No age data available</Text>
                    )}
                </View>
                {/* 
        <Text style={styles.footer}>
          This report contains confidential information. Please handle appropriately.
        </Text> */}
            </Page>
        </Document>
    );
};

// Component that provides the download link
const DashboardPDFDownloadButton = ({ dashboardData, chartData, ageGroups }) => {
    return (
        <PDFDownloadLink
            document={
                <DashboardPDFContent
                    dashboardData={dashboardData}
                    chartData={chartData}
                    ageGroups={ageGroups}
                />
            }
            fileName={`dashboard-report-${moment().format('YYYY-MM-DD')}.pdf`}
            style={{
                backgroundColor: "#035594",
                color: "white",
                padding: "10px 15px",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "0.875rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.3s"
            }}
            className="hover:bg-blue-700"
        >
            {({ blob, url, loading, error }) =>
                loading ? 'Generating PDF...' : 'Download PDF Report'
            }
        </PDFDownloadLink>
    );
};

export default DashboardPDFDownloadButton;