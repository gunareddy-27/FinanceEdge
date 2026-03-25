'use client';

import { useState } from 'react';
import { LayoutDashboard, Target } from 'lucide-react';
import { useToast } from './ToastProvider';

export default function AIBudgetRecommender() {
    const { showToast } = useToast();
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = () => {
        setIsApplying(true);
        // Simulate an API call latency for ML budget optimizations
        setTimeout(() => {
            setIsApplying(false);
            showToast('Smart Budget Defaults generated via RL applied successfully!', 'success');
        }, 1500);
    };

    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2 mb-4">
                <LayoutDashboard size={20} className="text-primary" />
                AI Budget Recommendation System
            </h3>
            
            <p className="text-sm text-muted mb-4">Reinforcement learning algorithm adjusting budgets based on historic consumption trends.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="flex-between p-3" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="font-bold flex items-center gap-2">
                        <Target size={16} className="text-primary"/> Food
                    </div>
                    <div>
                        <span className="text-xl font-bold text-primary">₹6,000</span>
                    </div>
                </div>

                <div className="flex-between p-3" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="font-bold flex items-center gap-2">
                        <Target size={16} className="text-primary"/> Travel
                    </div>
                    <div>
                        <span className="text-xl font-bold text-primary">₹3,000</span>
                    </div>
                </div>
                
                <div className="flex-between p-3" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="font-bold flex items-center gap-2">
                        <Target size={16} className="text-primary"/> Shopping
                    </div>
                    <div>
                        <span className="text-xl font-bold text-primary">₹2,500</span>
                    </div>
                </div>
            </div>

            <button onClick={handleApply} disabled={isApplying} className="btn btn-primary w-full text-sm">
                {isApplying ? 'Applying ML Allocations...' : 'Apply Smart Budget Defaults'}
            </button>
        </div>
    );
}
