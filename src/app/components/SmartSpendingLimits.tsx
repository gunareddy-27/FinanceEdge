'use client';

import { AlertTriangle, TrendingDown } from 'lucide-react';

export default function SmartSpendingLimits() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <AlertTriangle size={20} className="text-warning" />
                Smart Spending Limits
            </h3>
            
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                <div className="flex-between mb-2">
                    <span style={{ fontWeight: 600 }}>Food & Dining Target</span>
                    <span className="text-danger flex items-center gap-1"><TrendingDown size={14}/> Exceeded Trends</span>
                </div>
                <p className="text-sm text-muted mb-4">
                    Your average food spending increased by 15% over the last 3 months.
                </p>

                <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                    <div>
                        <div className="text-sm text-muted">New Suggestion</div>
                        <div className="text-xl font-bold text-primary">₹6,500 <span className="text-sm text-muted font-normal">/mo</span></div>
                    </div>
                    <button className="btn btn-secondary text-sm">Apply Limit</button>
                </div>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                <div className="flex-between mb-2">
                    <span style={{ fontWeight: 600 }}>Shopping Budget</span>
                    <span className="text-success text-sm">On Track</span>
                </div>
                <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                    <div>
                        <div className="text-sm text-muted">Current Limit</div>
                        <div className="text-lg font-bold">₹4,000 <span className="text-sm text-muted font-normal">/mo</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
