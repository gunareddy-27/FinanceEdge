'use client';

import { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { getBudgetsForMonth } from '@/app/actions/budget';

interface HealthScoreProps {
    summary: { income: number; expenses: number };
}

export default function HealthScore({ summary }: HealthScoreProps) {
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [audit, setAudit] = useState<string[]>([]);

    useEffect(() => {
        calculateHealth();
    }, [summary]);

    const calculateHealth = async () => {
        setLoading(true);
        let calculatedScore = 50; // Base score
        const audits = [];

        // 1. Savings Rate Impact (Max 30 points)
        const net = summary.income - summary.expenses;
        const savingsRate = summary.income > 0 ? (net / summary.income) : 0;

        if (savingsRate > 0.2) {
            calculatedScore += 30;
            audits.push("Great savings rate (>20%)");
        } else if (savingsRate > 0.1) {
            calculatedScore += 15;
            audits.push("Good savings rate (>10%)");
        } else if (savingsRate > 0) {
            calculatedScore += 5;
            audits.push("Positive cash flow");
        } else {
            calculatedScore -= 10;
            audits.push("Spending exceeds income");
        }

        // 2. Budget Adherence (Max 20 points)
        // Fetch budgets to check adherence
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const budgets = await getBudgetsForMonth(currentMonth);

            if (budgets.length > 0) {
                const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;
                if (overBudgetCount === 0) {
                    calculatedScore += 20;
                    audits.push("Sticking to all budgets");
                } else {
                    calculatedScore -= (overBudgetCount * 5);
                    audits.push(`${overBudgetCount} budgets exceeded`);
                }
            } else {
                // Neutral if no budgets
                audits.push("No budgets set yet");
            }
        } catch (e) {
            console.error(e);
        }

        // 3. Income Checks (Max 10 points)
        if (summary.income > 2000) { // Arbitrary baseline
            calculatedScore += 10;
        }

        // Cap score
        calculatedScore = Math.min(Math.max(Math.round(calculatedScore), 0), 100);

        setScore(calculatedScore);
        setAudit(audits);
        setLoading(false);
    };

    let color = '#22c55e';
    let label = 'Excellent';
    if (score < 80) { color = '#3b82f6'; label = 'Good'; }
    if (score < 60) { color = '#f59e0b'; label = 'Fair'; }
    if (score < 40) { color = '#ef4444'; label = 'Poor'; }

    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck size={20} className="text-purple-600" />
                    Financial Health
                </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Score Circle */}
                <div style={{
                    position: 'relative',
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: `conic-gradient(${color} ${score}%, #f3f4f6 0)`
                }}>
                    <div style={{
                        position: 'absolute',
                        width: '85px',
                        height: '85px',
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{loading ? '-' : score}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 100</span>
                    </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: color, marginBottom: '4px' }}>
                        {loading ? 'Calculating...' : label}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>
                        {score >= 80 ? "You're doing great! Keep it up." : "There's room for improvement."}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {audit.map((text, i) => (
                            <span key={i} style={{
                                fontSize: '11px',
                                padding: '2px 8px',
                                background: '#f3f4f6',
                                borderRadius: '12px',
                                color: '#4b5563'
                            }}>
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
