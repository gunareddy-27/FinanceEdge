'use client';

import { Vault, HandCoins } from 'lucide-react';

export default function AutoSavingsSuggestion() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <Vault size={20} className="text-primary" />
                Auto-Savings Suggestion
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="text-sm text-muted mb-1">Saved this Month</div>
                    <div className="text-2xl font-bold mb-4">₹12,000</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--primary-fade)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                        <HandCoins size={24} className="text-primary" />
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Suggested Auto-Transfer</div>
                            <div className="text-lg font-bold">₹8,000</div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted">
                    Your spending is well under budget. Move ₹8,000 to savings effortlessly!
                </p>

                <button className="btn btn-primary mt-2">Set up Bank Auto-Transfer</button>
            </div>
        </div>
    );
}
