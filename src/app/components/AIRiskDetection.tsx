'use client';

import { AlertTriangle, TrendingDown } from 'lucide-react';

export default function AIRiskDetection() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-warning" />
                AI Risk Detection
            </h3>
            
            <p className="text-sm text-muted mb-4">Logistic Regression models evaluate your financial stability metrics.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="flex-between mb-2">
                        <span className="font-bold">Aggregated Risk Level</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-sm" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>Medium</span>
                    </div>
                    <div className="flex items-start gap-2 mt-4 text-sm text-muted">
                        <TrendingDown size={18} className="text-danger stroke-2 mt-1" />
                        <div>
                            <span className="block font-bold text-main">Primary Reason</span>
                            Your current savings rate (12%) is below our recommended 20% threshold for your income bracket.
                        </div>
                    </div>
                </div>
            </div>
            
            <button className="btn btn-secondary w-full mt-4 text-sm">Generate Mitigation Plan</button>
        </div>
    );
}
