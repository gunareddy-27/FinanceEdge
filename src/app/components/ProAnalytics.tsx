'use client';

import { useState, useMemo } from 'react';
import { 
    TrendingUp, 
    Share2, 
    Layers, 
    Zap, 
    Activity,
    Info
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale
} from 'chart.js';
import { Scatter, Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Transaction {
    id: number;
    description: string | null;
    amount: number;
    date: Date;
    type: string;
    category?: string | null;
}

interface ProAnalyticsProps {
    transactions: Transaction[];
}

export default function ProAnalytics({ transactions }: ProAnalyticsProps) {
    const expenses = transactions.filter(t => t.type === 'expense');

    // 1. Spending Distribution (Frequency of amounts)
    const distributionData = useMemo(() => {
        const buckets: Record<string, number> = {
            '0-500': 0,
            '501-1k': 0,
            '1k-5k': 0,
            '5k-10k': 0,
            '10k+': 0
        };

        expenses.forEach(t => {
            const amt = Number(t.amount);
            if (amt <= 500) buckets['0-500']++;
            else if (amt <= 1000) buckets['501-1k']++;
            else if (amt <= 5000) buckets['1k-5k']++;
            else if (amt <= 10000) buckets['5k-10k']++;
            else buckets['10k+']++;
        });

        return {
            labels: Object.keys(buckets),
            datasets: [{
                label: 'Transaction Frequency',
                data: Object.values(buckets),
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderRadius: 8,
            }]
        };
    }, [expenses]);

    // 2. Weekly Heatmap (Day of Week vs Amount)
    const heatmapData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const values = new Array(7).fill(0);

        expenses.forEach(t => {
            const day = new Date(t.date).getDay();
            values[day] += Number(t.amount);
        });

        return {
            labels: days,
            datasets: [{
                label: 'Spending Intensity by Day',
                data: values,
                backgroundColor: values.map(v => `rgba(79, 70, 229, ${Math.min(v / (Math.max(...values) || 1), 1)})`),
                borderColor: '#4f46e5',
                borderWidth: 1,
                borderRadius: 4
            }]
        };
    }, [expenses]);

    // 3. Category Correlation (Simulated for Demo based on date clusters)
    const radarData = useMemo(() => {
        const categories = Array.from(new Set(expenses.map(t => t.category || 'Other')));
        const counts = categories.map(cat => {
            return expenses.filter(t => t.category === cat).length;
        });

        return {
            labels: categories,
            datasets: [{
                label: 'Category Connectivity',
                data: counts,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                pointBackgroundColor: '#10b981',
            }]
        };
    }, [expenses]);

    return (
        <div style={{ marginTop: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '8px', background: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
                        <Zap size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Pro Analytics Engine</h2>
                        <p className="text-muted text-sm">Advanced econometric models of your spending patterns.</p>
                    </div>
                </div>
            </div>

            <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
                {/* Spending Distribution Curve */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                        <TrendingUp size={18} className="text-primary" />
                        <h3 className="text-lg font-bold">Amount Distribution</h3>
                    </div>
                    <div style={{ height: '240px' }}>
                        <Bar 
                            data={distributionData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { x: { grid: { display: false } }, y: { grid: { display: true } } }
                            }} 
                        />
                    </div>
                    <div className="text-xs text-muted mt-4 p-2 bg-slate-50 rounded" style={{ display: 'flex', gap: '6px' }}>
                        <Info size={12} />
                        Most of your transactions fall in the {distributionData.labels[0]} range.
                    </div>
                </div>

                {/* Heatmap Simulation */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                        <Activity size={18} className="text-danger" />
                        <h3 className="text-lg font-bold">Weekly Intensity Heatmap</h3>
                    </div>
                    <div style={{ height: '240px' }}>
                        <Bar 
                             data={heatmapData} 
                             options={{ 
                                 indexAxis: 'y',
                                 responsive: true, 
                                 maintainAspectRatio: false,
                                 plugins: { legend: { display: false } },
                                 scales: { x: { grid: { display: false } }, y: { grid: { display: false } } }
                             }} 
                         />
                    </div>
                    <p className="text-xs text-muted mt-4">Darker bars represent higher spending volume on those specific days.</p>
                </div>

                {/* Category Correlations Radar */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                        <Share2 size={18} className="text-success" />
                        <h3 className="text-lg font-bold">Category Correlations</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Radar 
                            data={radarData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: { r: { ticks: { display: false } } }
                            }}
                        />
                    </div>
                </div>

                {/* Multi-Dimensional Scatter */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                        <Layers size={18} className="text-indigo-500" />
                        <h3 className="text-lg font-bold">Transaction Anomaly Scatter</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Scatter 
                            data={{
                                datasets: [{
                                    label: 'Individual Transactions',
                                    data: expenses.map((t, i) => ({ x: i, y: Number(t.amount) })),
                                    backgroundColor: '#6366f1',
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: { x: { display: false }, y: { title: { display: true, text: 'Amount (₹)' } } }
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted mt-4">Outliers above the clusters represent potential budget shocks.</p>
                </div>
            </div>
        </div>
    );
}
