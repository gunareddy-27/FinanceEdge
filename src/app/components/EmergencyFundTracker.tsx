'use client';

import { Shield, TrendingUp } from 'lucide-react';

interface EmergencyFundProps {
    monthlyExpenses: number;
}

export default function EmergencyFundTracker({ monthlyExpenses }: EmergencyFundProps) {
    const recommendedFund = monthlyExpenses * 6;
    const currentSavings = recommendedFund * 0.53; // Mocking 53% progress
    const progress = Math.min((currentSavings / recommendedFund) * 100, 100);

    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <Shield size={20} className="text-success" />
                Emergency Fund
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div className="text-sm text-muted">Recommended (6 months expenses)</div>
                <div className="text-2xl font-bold">₹{recommendedFund.toLocaleString()}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div className="flex-between text-sm mb-2">
                    <span>Current: ₹{currentSavings.toLocaleString()}</span>
                    <span>{progress.toFixed(0)}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--success)' }} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--success-fade)', padding: '0.75rem', borderRadius: 'var(--radius)', color: 'var(--success)', marginTop: '1rem' }}>
                <TrendingUp size={16} />
                <span className="text-sm">You are on track! Keep saving ₹15,000/mo to reach your goal.</span>
            </div>
        </div>
    );
}
