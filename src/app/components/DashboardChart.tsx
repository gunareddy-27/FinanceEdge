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

interface Transaction {
    id: number;
    description: string | null;
    amount: number;
    date: Date;
    type: string;
    category?: string | null;
}

interface DashboardChartProps {
    transactions: Transaction[];
}

export default function DashboardChart({ transactions }: DashboardChartProps) {
    // Process last 6 months
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return d.toLocaleString('default', { month: 'short' });
    });

    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    last6Months.forEach(m => { incomeMap.set(m, 0); expenseMap.set(m, 0); });

    transactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short' });
        if (incomeMap.has(month)) {
            const current = t.type === 'income' ? incomeMap.get(month)! : expenseMap.get(month)!;
            if (t.type === 'income') incomeMap.set(month, current + Number(t.amount));
            else expenseMap.set(month, current + Number(t.amount));
        }
    });

    const data = {
        labels: last6Months,
        datasets: [
            {
                label: 'Income',
                data: last6Months.map(m => incomeMap.get(m)),
                backgroundColor: '#6366f1',
                borderRadius: 4,
            },
            {
                label: 'Expenses',
                data: last6Months.map(m => expenseMap.get(m)),
                backgroundColor: '#ef4444',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
        }
    };

    return <Bar options={options} data={data} />;
}
