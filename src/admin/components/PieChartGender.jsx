import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartGender = ({ data }) => {
    // Create options object with legend position set to 'left'
    const options = {
        plugins: {
            legend: {
                position: 'left',
                labels: {
                    // Optional: Customize legend labels
                    font: {
                        size: 14
                    },
                    padding: 20,
                    usePointStyle: true, // Uses circular point style instead of rectangle
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                callbacks: {
                    // Optional: Customize tooltip to show percentages
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: false, // Allows the chart to be responsive
        responsive: true,
    };

    return <Pie data={data} options={options} />;
};

export default PieChartGender;