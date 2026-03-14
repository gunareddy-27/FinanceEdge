'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { getBudgetsForMonth } from '@/app/actions/budget';

interface HealthScoreProps {
    summary: { income: number; expenses: number };
}

export default function HealthScore({ summary }: HealthScoreProps) {
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [factors, setFactors] = useState<{ label: string; score: number; color: string }[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        calculateHealth();
    }, [summary]);

    const calculateHealth = async () => {
        setLoading(true);
        let calculatedScore = 0;
        const newFactors = [];
        const newSuggestions = [];

        // 1. Savings Ratio (30%)
        const net = summary.income - summary.expenses;
        const savingsRate = summary.income > 0 ? (net / summary.income) : 0;
        let savingsScore = 0;

        if (savingsRate >= 0.2) {
            savingsScore = 30;
            newSuggestions.push("Great job saving over 20% of your income!");
        } else if (savingsRate >= 0.1) {
            savingsScore = 20;
            newSuggestions.push("Increase savings by 10% to reach optimal levels.");
        } else if (savingsRate > 0) {
            savingsScore = 10;
            newSuggestions.push("Try to reduce non-essential spending to boost savings.");
        } else {
            savingsScore = 0;
            newSuggestions.push("You are spending more than you earn! Cut back on expenses immediately.");
        }
        calculatedScore += savingsScore;
        newFactors.push({ label: 'Savings Ratio', score: savingsScore, color: savingsScore > 15 ? '#22c55e' : '#ef4444' });

        // 2. Budget Adherence (30%)
        let budgetScore = 15; // default if no budgets
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const budgets = await getBudgetsForMonth(currentMonth);

            if (budgets.length > 0) {
                const overBudgetCategories = budgets.filter(b => b.spent > b.limit);
                if (overBudgetCategories.length === 0) {
                    budgetScore = 30;
                    newSuggestions.push("Perfect budget adherence this month.");
                } else {
                    budgetScore = Math.max(0, 30 - (overBudgetCategories.length * 10));
                    newSuggestions.push(`Reduce spending in: ${overBudgetCategories.map(b => b.category).join(', ')}`);
                }
            } else {
                newSuggestions.push("Set up budgets to improve your financial score.");
            }
        } catch (e) {
            console.error(e);
        }
        calculatedScore += budgetScore;
        newFactors.push({ label: 'Budget Adherence', score: budgetScore, color: budgetScore > 20 ? '#22c55e' : '#f59e0b' });

        // 3. Emergency Fund / Liquidity Proxy (20% - assumed based on positive balance streak)
        const emergencyScore = savingsRate > 0.1 ? 20 : (savingsRate > 0 ? 10 : 0);
        calculatedScore += emergencyScore;
        newFactors.push({ label: 'Emergency Fund Proxy', score: emergencyScore, color: emergencyScore > 10 ? '#3b82f6' : '#ef4444' });
        if (emergencyScore < 20) newSuggestions.push("Start building an emergency fund (goal: 3-6 months expenses).");

        // 4. Investment Diversification (20% - placeholder feature for future expansion)
        const investmentScore = 15; // Placebo
        calculatedScore += investmentScore;
        newFactors.push({ label: 'Investment Health', score: investmentScore, color: '#8b5cf6' });

        // Normalize
        calculatedScore = Math.min(Math.max(Math.round(calculatedScore), 0), 100);

        setScore(calculatedScore);
        setFactors(newFactors);
        setSuggestions(newSuggestions.slice(0, 3)); // Max 3 suggestions
        setLoading(false);
    };

    let circleColor = '#22c55e';
    let label = 'Excellent';
    if (score < 80) { circleColor = '#3b82f6'; label = 'Good'; }
    if (score < 60) { circleColor = '#f59e0b'; label = 'Fair'; }
    if (score < 40) { circleColor = '#ef4444'; label = 'Poor'; }

    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <div className="flex-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck size={24} className="text-indigo-600" />
                    Advanced Financial Health
                </h3>
                {score >= 80 && (
                    <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                        Budget Master Badge 🏆
                    </span>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 2fr', gap: '2rem', alignItems: 'center' }}>
                {/* Score Circle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: `conic-gradient(${circleColor} ${score}%, #e2e8f0 0)`,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            width: '100px',
                            height: '100px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                        }}>
                            <span style={{ fontSize: '32px', fontWeight: '900', color: circleColor }}>{loading ? '-' : score}</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>/ 100</span>
                        </div>
                    </div>
                    <span style={{ fontWeight: 'bold', color: circleColor, fontSize: '16px' }}>{label}</span>
                </div>

                {/* Details & Suggestions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Target size={16} /> Key Factors
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {factors.map((f, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{f.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: f.color }}>{f.score} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Lightbulb size={16} color="#eab308" /> Smart Suggestions
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {suggestions.map((s, i) => (
                                <li key={i} style={{ fontSize: '13px', color: '#475569', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <span style={{ color: '#3b82f6', marginTop: '2px' }}>•</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
