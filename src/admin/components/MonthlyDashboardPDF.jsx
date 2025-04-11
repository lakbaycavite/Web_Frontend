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

// Helper function to filter data for the current month
const filterDataForCurrentMonth = (dashboardData) => {
  const now = moment();
  const firstDayOfMonth = moment().startOf('month');
  
  // This assumes your dashboardData has date information for each item
  // You may need to adjust this logic based on your actual data structure
  return {
    totalUsersThisMonth: dashboardData.recentUsers?.filter(user => 
      moment(user.created_at).isSameOrAfter(firstDayOfMonth)
    ).length || 0,
    
    totalPostsThisMonth: dashboardData.recentPosts?.filter(post => 
      moment(post.created_at).isSameOrAfter(firstDayOfMonth)
    ).length || 0,
    
    totalEventsThisMonth: dashboardData.upcomingFiveEvents?.filter(event => 
      moment(event.date).isSameOrAfter(firstDayOfMonth) && 
      moment(event.date).isSameOrBefore(now)
    ).length || 0,
  };
};

// Create a component for the monthly PDF content
const MonthlyDashboardPDFContent = ({ dashboardData, chartData, ageGroups }) => {
  const currentMonth = moment().format('MMMM YYYY');
  const generatedDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const monthlyData = filterDataForCurrentMonth(dashboardData);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Monthly Dashboard Report</Text>
        <Text>Month: {currentMonth}</Text>
        <Text>Generated on: {generatedDate}</Text>
        
        {/* Monthly Stats */}
        <Text style={styles.subHeader}>This Month's Statistics</Text>
        <View style={styles.infoContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>New Users This Month:</Text>
            <Text style={styles.statValue}>{monthlyData.totalUsersThisMonth}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>New Posts This Month:</Text>
            <Text style={styles.statValue}>{monthlyData.totalPostsThisMonth}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Events This Month:</Text>
            <Text style={styles.statValue}>{monthlyData.totalEventsThisMonth}</Text>
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

          {/* Age Distribution Table */}
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

        {/* Footer */}
        <Text style={styles.footer}>
          Monthly report for {currentMonth}. This report contains confidential information.
        </Text>
      </Page>
    </Document>
  );
};

// Component that provides the download link for monthly report
const MonthlyDashboardPDFButton = ({ dashboardData, chartData, ageGroups }) => {
  return (
    <PDFDownloadLink
      document={
        <MonthlyDashboardPDFContent 
          dashboardData={dashboardData} 
          chartData={chartData} 
          ageGroups={ageGroups}
        />
      }
      fileName={`monthly-dashboard-report-${moment().format('YYYY-MM')}.pdf`}
      style={{
        backgroundColor: "#32cc32",
        color: "white",
        padding: "10px 15px",
        borderRadius: "5px",
        textDecoration: "none",
        fontSize: "0.875rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        marginLeft: "10px",
        transition: "background-color 0.3s"
      }}
      className="hover:bg-green-700"
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating Monthly Report...' : 'Monthly Report'
      }
    </PDFDownloadLink>
  );
};

export default MonthlyDashboardPDFButton;