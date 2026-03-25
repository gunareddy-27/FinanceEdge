'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, AlertTriangle, BellRing, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { getBudgetsForMonth } from '@/app/actions/budget';
import { setBudget, deleteBudget } from '@/app/actions/budget';
import { useToast } from './ToastProvider';

interface Budget {
    id: number;
    category: string;
    limit: number;
    spent: number;
    month: string;
}

export default function BudgetOverview() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const { showToast } = useToast();
    const alertsShownRef = useRef(new Set<number>());

    // State for selected month
    const [viewMonth, setViewMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Form
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');

    useEffect(() => {
        loadBudgets();
    }, [viewMonth]);

    const loadBudgets = async () => {
        setIsLoading(true);
        try {
            const data = await getBudgetsForMonth(viewMonth);
            // Sort by progress desc (most critical first)
            setBudgets(data.sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit)));
            
            // Smart Budget Alerts check
            data.forEach(b => {
                const progress = b.spent / b.limit;
                if (!alertsShownRef.current.has(b.id)) {
                    if (progress >= 1) {
                        showToast(`⚠️ You have exceeded your ${b.category} budget!`, 'error');
                        alertsShownRef.current.add(b.id);
                    } else if (progress >= 0.9) {
                        showToast(`⚠️ Note: ${b.category} spending reached ${(progress * 100).toFixed(0)}% of budget.`, 'error');
                        alertsShownRef.current.add(b.id);
                    }
                }
            });
            
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !limit) return;

        await setBudget(category, Number(limit), viewMonth); // Use selected month
        setIsAdding(false);
        setCategory('');
        setLimit('');
        loadBudgets();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Delete this budget?")) {
            await deleteBudget(id);
            loadBudgets();
        }
    };

    const shiftMonth = (offset: number) => {
        const [y, m] = viewMonth.split('-').map(Number);
        const date = new Date(y, m - 1 + offset, 1);
        setViewMonth(date.toISOString().slice(0, 7));
    };

    const monthLabel = new Date(viewMonth + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <div className="card" style={{ padding: '1rem', height: '100%', position: 'relative' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <History size={16} className="text-primary" />
                        Budget Explorer
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <button onClick={() => shiftMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><ChevronLeft size={14}/></button>
                        <p className="text-muted text-xs font-bold" style={{ width: '100px', textAlign: 'center' }}>{monthLabel}</p>
                        <button onClick={() => shiftMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><ChevronRight size={14}/></button>
                    </div>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => setIsAdding(!isAdding)}
                    style={{ padding: '4px 8px', fontSize: '12px', minHeight: 'unset' }}
                >
                    <Plus size={14} />
                    {isAdding ? 'Cancel' : 'Add'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddBudget} style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Category"
                            className="input"
                            style={{ padding: '4px 8px', fontSize: '13px' }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Limit"
                            className="input"
                            style={{ padding: '4px 8px', fontSize: '13px' }}
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 8px', fontSize: '13px' }}>Save</button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>
            ) : budgets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <p style={{ marginBottom: '0.5rem' }}>No budgets for {monthLabel}.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {budgets.map((b) => {
                        const progress = Math.min((b.spent / b.limit) * 100, 100);
                        const isOverBudget = b.spent > b.limit;
                        const isNearLimit = progress > 80 && !isOverBudget;

                        let color = '#10b981'; // Green
                        if (isNearLimit) color = '#f59e0b'; // Orange
                        if (isOverBudget) color = '#ef4444'; // Red

                        return (
                            <div key={b.id}>
                                <div className="flex-between" style={{ marginBottom: '2px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{b.category}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '11px', color: isOverBudget ? '#ef4444' : 'var(--text-muted)' }}>
                                            ₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 0 }}
                                            className="hover:text-red-500"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{
                                    height: '6px',
                                    width: '100%',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${progress}%`,
                                        backgroundColor: color,
                                        borderRadius: '3px',
                                        transition: 'width 0.5s ease-out'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
