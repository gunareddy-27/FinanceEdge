'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
    id: number;
    amount: any;
    type: string;
    category?: string | null;
}

interface ExpenseBreakdownProps {
    transactions: Transaction[];
}

export default function ExpenseBreakdownChart({ transactions }: ExpenseBreakdownProps) {
    const data = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const categoryMap: Record<string, number> = {};

        if (expenses.length === 0) {
            // Default data for demo if no expenses
            return {
                labels: ['Business', 'Meals', 'Office', 'Software', 'Travel'],
                datasets: [
                    {
                        data: [35, 20, 15, 20, 10],
                        backgroundColor: [
                            '#6366F1', // Indigo
                            '#EC4899', // Pink
                            '#F59E0B', // Amber
                            '#10B981', // Emerald
                            '#8B5CF6', // Violet
                        ],
                        borderWidth: 0,
                    },
                ],
            };
        }

        expenses.forEach(tx => {
            const cat = tx.category || 'Uncategorized';
            categoryMap[cat] = (categoryMap[cat] || 0) + Number(tx.amount);
        });

        const labels = Object.keys(categoryMap);
        const values = Object.values(categoryMap);

        // Generate colors (basic palette)
        const colors = [
            '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6',
            '#EF4444', '#3B82F6', '#64748B'
        ];

        return {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                },
            ],
        };
    }, [transactions]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: 'Inter',
                        size: 12
                    }
                }
            }
        },
        cutout: '70%',
    };

    return (
        <div style={{ height: '240px', position: 'relative' }}>
            <Doughnut data={data} options={options} />

            {/* Center Text Overlay */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                // Adjust left position based on legend width/position (approximate center of donut)
                // Since legend is right, the donut is pushed left. 
                // In a responsive container, centering absolutely is tricky without calc.
                // Simplified approach: center in the chart area if possible or just rely on donut.
                // For this implementation, I'll rely on the pure chart visual.
                width: '100%',
                textAlign: 'center',
                pointerEvents: 'none',
                transform: 'translateY(-50%)',
                // Hacky center adjustment for right legend
                paddingRight: '100px'
            }}>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>Total</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    ${transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}
                </div>
            </div>
        </div>
    );
}
