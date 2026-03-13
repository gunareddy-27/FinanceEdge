'use client';

import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { setBudget } from '@/app/actions/budget';

interface Budget {
    id: number;
    category: string;
    limit: number;
    spent: number;
    month: string;
}

export default function BudgetsClient({ budgets }: { budgets: Budget[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newBudget, setNewBudget] = useState({ name: '', limit: '' });

    const currentMonth = new Date().toISOString().slice(0, 7);

    const handleAddBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBudget.name || !newBudget.limit) return;

        setLoading(true);
        await setBudget(newBudget.name, Number(newBudget.limit), currentMonth);
        setLoading(false);
        setIsModalOpen(false);
        setNewBudget({ name: '', limit: '' });
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Budgets</h1>
                    <p className="text-muted">Set limits and track your spending goals.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    <Plus size={18} />
                    Create Budget
                </button>
            </header>

            <div className="grid-cols-2">
                {budgets.length === 0 ? (
                    <div className="text-muted" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem' }}>
                        No budgets set. Create one to get started!
                    </div>
                ) : (
                    budgets.map((budget) => {
                        const limit = Number(budget.limit);
                        const used = budget.spent || 0;
                        const percent = limit > 0 ? Math.round((used / limit) * 100) : 0;
                        const warning = percent > 80;
                        const danger = percent >= 100;

                        return (
                            <div key={budget.id} className="card">
                                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                    <h3 className="text-xl">{budget.category}</h3>
                                    <span className="text-muted text-sm">${used.toLocaleString()} / ${limit.toLocaleString()}</span>
                                </div>

                                <div style={{ height: '8px', width: '100%', background: '#F3F4F6', borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(percent, 100)}%`,
                                        background: danger ? 'var(--danger)' : (warning ? '#D97706' : 'var(--primary)'),
                                        borderRadius: '4px'
                                    }}></div>
                                </div>

                                <div className="flex-between text-sm">
                                    <span className="text-muted">{percent}% used</span>
                                    <span className="text-muted">${(limit - used).toLocaleString()} remaining</span>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Reset monthly on the 1st
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create Budget Modal */}
            {isModalOpen && (
                <div className="modal-overlay open">
                    <div className="modal">
                        <h3 className="text-xl" style={{ marginBottom: '1.5rem' }}>Create New Budget</h3>
                        <form onSubmit={handleAddBudget}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input"
                                    placeholder="e.g. Marketing"
                                    value={newBudget.name}
                                    onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label">Monthly Limit ($)</label>
                                <input
                                    type="number"
                                    required
                                    className="input"
                                    placeholder="1000"
                                    value={newBudget.limit}
                                    onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                                />
                            </div>
                            <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Budget'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
