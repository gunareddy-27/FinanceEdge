'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
            }
        },
        x: {
            grid: {
                display: false,
            }
        }
    }
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Income',
            data: [5000, 6500, 5000, 7200, 9000, 8500],
            backgroundColor: '#4F46E5', // Primary
            borderRadius: 4,
        },
        {
            label: 'Expenses',
            data: [3200, 4100, 3000, 5200, 4800, 3900],
            backgroundColor: '#EF4444', // Danger
            borderRadius: 4,
        },
    ],
};

export default function DashboardChart() {
    return <Bar options={options} data={data} />;
}
