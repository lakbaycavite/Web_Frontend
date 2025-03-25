import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarchartAge = ({ ageGroups }) => {

    const options = {
        scales: {
            y: {
                ticks: {
                    display: false
                },
                grid: {
                    drawTicks: false
                },
            },
        },
    };

    const data = {
        labels: Object.keys(ageGroups),
        datasets: [
            {
                label: "Age Groups",
                data: Object.values(ageGroups),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
        ],
    };

    return <Bar data={data} options={options} />;
};

export default BarchartAge;