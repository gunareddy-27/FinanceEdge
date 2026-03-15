'use client';

import { ShieldAlert, Activity } from 'lucide-react';

export default function AIFraudDetection() {
    return (
        <div className="card" style={{ borderLeft: '4px solid var(--danger-text)' }}>
            <h3 className="text-xl flex items-center gap-2 mb-4">
                <ShieldAlert size={20} className="text-danger" />
                AI Fraud Detection (Anomaly)
            </h3>
            
            <p className="text-sm text-muted mb-4">Isolation Forest Algorithm actively monitors your spending behavior to detect unusual transactions.</p>
            
            <div style={{ backgroundColor: 'var(--danger-fade)', padding: '1.25rem', borderRadius: 'var(--radius)', color: 'var(--danger-text)', border: '1px solid #fca5a5' }}>
                <div className="flex-between mb-2">
                    <span className="font-bold">⚠ Unusual Transaction Detected</span>
                    <span className="text-sm">2 Mins Ago</span>
                </div>
                <div className="flex items-center gap-2 mb-2 text-main font-medium">
                    <Activity size={16} /> ₹15,000 spent at midnight.
                </div>
                <p className="text-sm mb-4">This transaction is 4 standard deviations away from your normal pattern.</p>

                <div className="flex gap-2">
                    <button className="btn btn-danger text-sm">Block Transaction</button>
                    <button className="btn btn-secondary text-sm">It was me</button>
                </div>
            </div>
        </div>
    );
}
