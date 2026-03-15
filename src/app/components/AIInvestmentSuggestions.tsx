'use client';

import { PieChart, TrendingUp, BarChart } from 'lucide-react';

export default function AIInvestmentSuggestions() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-primary" />
                AI Investment Suggestions
            </h3>
            
            <p className="text-sm text-muted mb-4">Based on your risk profile (Moderate) and consistent monthly surplus, our Portfolio Optimization Algorithm recommends:</p>

            <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--primary)' }}>
                    <div className="flex-between text-sm mb-1">
                        <span className="font-bold flex items-center gap-1"><PieChart size={14}/> Mutual Funds</span>
                        <span className="text-primary font-bold">40%</span>
                    </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--success-text)' }}>
                    <div className="flex-between text-sm mb-1">
                        <span className="font-bold flex items-center gap-1"><BarChart size={14}/> Stocks</span>
                        <span className="text-success font-bold">30%</span>
                    </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--warning-text)' }}>
                    <div className="flex-between text-sm mb-1">
                        <span className="font-bold">Gold ETFs</span>
                        <span className="text-warning font-bold">10%</span>
                    </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--text-muted)' }}>
                    <div className="flex-between text-sm mb-1">
                        <span className="font-bold">Fixed Deposit</span>
                        <span className="text-muted font-bold">20%</span>
                    </div>
                </div>
            </div>

            <button className="btn btn-primary w-full text-sm">Automate Investment Strategy</button>
        </div>
    );
}
