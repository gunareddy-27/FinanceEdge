'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            mode: 'index' as const,
            intersect: false,
        },
    },
    scales: {
        y: {
            display: false, // Hide Y axis for cleaner look
            beginAtZero: true,
        },
        x: {
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    family: 'Inter',
                    size: 11
                },
                color: '#64748B'
            }
        }
    },
    interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
    }
};

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Net Balance',
            data: [1200, 1900, 1600, 2400, 2100, 3200, 3800],
            fill: true,
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)'); // Primary color with opacity
                gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
                return gradient;
            },
            borderColor: '#6366F1',
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
        },
    ],
};

export default function CashFlowTrendChart() {
    return (
        <div style={{ height: '100%', width: '100%', minHeight: '120px' }}>
            <Line options={options} data={data} />
        </div>
    );
}
