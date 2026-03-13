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

interface Transaction {
    amount: number;
    type: string;
    date: Date;
}

export default function CashFlowForecast({ transactions }: { transactions: Transaction[] }) {
    // 1. Calculate Current Balance and Historical Trend
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentBalance = 0;
    const historyData: number[] = [];
    const labels: string[] = [];

    // Simple Cumulative Balance Calculation
    sortedTx.forEach(tx => {
        const amt = tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount);
        currentBalance += amt;
        historyData.push(currentBalance);
        labels.push(new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    });

    // 2. Linear Regression / Average Daily Growth Calculation
    // We'll use a simple "Average Daily Net Change" over the last 30 days logic
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const recentTx = sortedTx.filter(t => new Date(t.date) >= thirtyDaysAgo);

    let netChangeLast30 = 0;
    if (recentTx.length > 0) {
        netChangeLast30 = recentTx.reduce((acc, tx) => {
            return acc + (tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount));
        }, 0);
    }

    // Average daily change (simple heuristic)
    const avgDailyChange = netChangeLast30 / 30;

    // 3. Generate Forecast Data (Next 3 Months - 12 weeks)
    const forecastData: (number | null)[] = new Array(historyData.length - 1).fill(null);
    // Connect the last historical point
    forecastData.push(currentBalance);

    const futureLabels: string[] = [];
    let projectedBalance = currentBalance;

    // Generate 4 points (roughly 1 per 2 weeks for smoothness) over 2 months
    for (let i = 1; i <= 4; i++) {
        const daysForward = i * 14; // 2 weeks
        projectedBalance += (avgDailyChange * 14);

        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysForward);

        futureLabels.push(`Forecast ${futureDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`);
        forecastData.push(projectedBalance);
    }

    // Combine Labels
    const allLabels = [...labels, ...futureLabels];

    const data = {
        labels: allLabels,
        datasets: [
            {
                label: 'Historical Balance',
                data: historyData,
                borderColor: '#6366f1', // Indigo
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
            },
            {
                label: 'Projected Forecast',
                data: forecastData, // Starts at last history point
                borderColor: '#10b981', // Emerald (Green for growth, technically forecasts can go down too)
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderDash: [5, 5], // Dashed line for prediction
                tension: 0.4,
                fill: true,
                pointRadius: 4,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
                text: 'Cash Flow Projection',
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: function (context: any) {
                        return `$${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Cash Flow Forecast</h3>
                    <p className="text-muted text-sm">AI prediction based on your last 30 days of activity.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="text-sm text-muted">Projected Trend</p>
                    <p style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: avgDailyChange >= 0 ? '#10b981' : '#ef4444'
                    }}>
                        {avgDailyChange >= 0 ? '+' : ''}${Math.round(avgDailyChange * 30)} / mo
                    </p>
                </div>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
                <Line options={options} data={data} />
            </div>
        </div>
    );
}
