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
        flexWrap: 'wrap',
        marginBottom: 15,
        backgroundColor: '#F5F8FF',
        padding: 10,
        borderRadius: 5,
    },
    statItem: {
        width: '20%',
        alignItems: 'center',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 9,
        color: '#666',
        marginBottom: 2,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
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
        width: '24%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol3: {
        width: '18%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol4: {
        width: '25%',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    tableCol5: {
        width: '25%',
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
    },
    categoryCell: {
        fontSize: 9,
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
    noHotlines: {
        textAlign: 'center',
        fontSize: 12,
        color: '#555555',
        marginTop: 40,
        marginBottom: 40,
        fontStyle: 'italic',
    },
    fireCategory: {
        color: '#E74C3C',
    },
    policeCategory: {
        color: '#3498DB',
    },
    ambulanceCategory: {
        color: '#27AE60',
    },
    disasterCategory: {
        color: '#F39C12',
    },
    otherCategory: {
        color: '#7F8C8D',
    },
});

// Create Document Component
const HotlineListPDF = ({ hotlines, categoryCounts, reportTitle = "Emergency Hotlines Report", categoryFilter = null }) => {
    const currentDate = moment().format('MMMM Do, YYYY [at] h:mm A');

    // Function to get color style based on category
    const getCategoryStyle = (category) => {
        switch (category) {
            case 'Fire': return styles.fireCategory;
            case 'Police': return styles.policeCategory;
            case 'Ambulance/ Medical': return styles.ambulanceCategory;
            case 'Disaster Response': return styles.disasterCategory;
            default: return styles.otherCategory;
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Lakbay Cavite</Text>
                    <Text style={styles.subtitle}>{reportTitle}</Text>
                    <Text style={styles.date}>Generated on: {currentDate}</Text>

                    {categoryFilter && (
                        <Text style={styles.dateRange}>
                            Category: {categoryFilter}
                        </Text>
                    )}
                </View>

                {/* Statistics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hotline Statistics</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Total Contacts</Text>
                            <Text style={styles.statValue}>{hotlines.length}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Fire</Text>
                            <Text style={[styles.statValue, { color: '#E74C3C' }]}>{categoryCounts.Fire}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Police</Text>
                            <Text style={[styles.statValue, { color: '#3498DB' }]}>{categoryCounts.Police}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Ambulance/ Medical</Text>
                            <Text style={[styles.statValue, { color: '#27AE60' }]}>{categoryCounts["Ambulance/ Medical"]}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Disaster Response</Text>
                            <Text style={[styles.statValue, { color: '#F39C12' }]}>{categoryCounts["Disaster Response"]}</Text>
                        </View>
                    </View>
                </View>

                {/* Hotlines Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Emergency Contacts List</Text>

                    {hotlines.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <View style={styles.tableHeaderRow}>
                                <View style={styles.tableCol1}><Text style={styles.headerCell}>No.</Text></View>
                                <View style={styles.tableCol2}><Text style={styles.headerCell}>Name</Text></View>
                                <View style={styles.tableCol3}><Text style={styles.headerCell}>Number</Text></View>
                                <View style={styles.tableCol4}><Text style={styles.headerCell}>Location</Text></View>
                                <View style={styles.tableCol5}><Text style={styles.headerCell}>Category</Text></View>
                            </View>

                            {/* Table Rows */}
                            {hotlines.map((hotline, index) => (
                                <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.alternateRow : {}]}>
                                    <View style={styles.tableCol1}><Text style={styles.cell}>{index + 1}</Text></View>
                                    <View style={styles.tableCol2}><Text style={styles.cell}>{hotline.name}</Text></View>
                                    <View style={styles.tableCol3}><Text style={styles.cell}>{hotline.number}</Text></View>
                                    <View style={styles.tableCol4}>
                                        <Text style={styles.cell}>{hotline.location || "N/A"}</Text>
                                    </View>
                                    <View style={styles.tableCol5}>
                                        <Text style={[styles.categoryCell, getCategoryStyle(hotline.category)]}>
                                            {hotline.category}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View>
                            <Text style={styles.noHotlines}>No emergency contacts found for the selected criteria</Text>
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

export default HotlineListPDF;