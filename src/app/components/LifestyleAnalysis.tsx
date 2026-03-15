'use client';

import { Activity, Coffee, ShoppingBag, Utensils } from 'lucide-react';

export default function LifestyleAnalysis() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <Activity size={20} className="text-primary" />
                Lifestyle Spending Analysis
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <div style={{ backgroundColor: 'var(--danger-fade)', padding: '0.75rem', borderRadius: '50%' }}>
                        <Utensils size={20} className="text-danger" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Food Delivery</div>
                        <div className="text-sm text-muted">Spending increased by 25%</div>
                        <div className="text-sm text-primary font-medium mt-1">Reducing this could save ₹4,000/month.</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <div style={{ backgroundColor: 'var(--warning-fade)', padding: '0.75rem', borderRadius: '50%' }}>
                        <Coffee size={20} className="text-warning" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Cafes & Coffee</div>
                        <div className="text-sm text-muted">Steady spending habit</div>
                        <div className="text-sm text-muted mt-1">Costing ₹1,500/month.</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <div style={{ backgroundColor: 'var(--success-fade)', padding: '0.75rem', borderRadius: '50%' }}>
                        <ShoppingBag size={20} className="text-success" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Shopping</div>
                        <div className="text-sm text-muted">Spending decreased by 10%</div>
                        <div className="text-sm text-success font-medium mt-1">Great job! Saved ₹2,000 vs. last month.</div>
                    </div>
                </div>
            </div>

            <button className="btn btn-secondary w-full">View Detailed Report</button>
        </div>
    );
}
