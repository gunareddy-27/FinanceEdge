'use client';

import { useState, useMemo } from 'react';
import { 
    Zap, 
    ArrowRight, 
    BrainCircuit, 
    ShieldAlert, 
    CheckCircle2, 
    Settings,
    History
} from 'lucide-react';
import { setBudget } from '@/app/actions/budget';
import { useToast } from './ToastProvider';

interface Transaction {
    amount: number;
    date: Date;
    type: string;
    category?: string | null;
}

interface Budget {
    category: string;
    limit: number;
    month: string;
}

export default function AIHabitCorrection({ transactions, currentBudgets }: { transactions: Transaction[], currentBudgets: Budget[] }) {
    const { showToast } = useToast();
    const [applying, setApplying] = useState(false);
    const [appliedHabit, setAppliedHabit] = useState<string | null>(null);

    // AI Analysis Logic
    const habitData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const weekendDays = [0, 5, 6]; // Fri, Sat, Sun
        
        let weekendTotal = 0;
        let weekdayTotal = 0;
        let weekendCount = 0;
        let weekdayCount = 0;

        expenses.forEach(t => {
            const day = new Date(t.date).getDay();
            if (weekendDays.includes(day)) {
                weekendTotal += Number(t.amount);
                weekendCount++;
            } else {
                weekdayTotal += Number(t.amount);
                weekdayCount++;
            }
        });

        const isWeekendOverspending = weekendTotal > (weekdayTotal * 1.5) && weekendCount > 0;
        
        return {
            isWeekendOverspending,
            weekendTotal,
            weekdayTotal,
            suggestion: isWeekendOverspending ? "Reduce Weekend Entertainment/Food budget by 20%" : null
        };
    }, [transactions]);

    const handleApplyCorrection = async () => {
        if (!habitData.suggestion) return;
        setApplying(true);
        
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            
            // Find Entertainment or Food budgets if they exist
            const relevantBudgets = currentBudgets.filter(b => 
                ['Food', 'Entertainment', 'Others', 'Transport'].includes(b.category)
            );

            if (relevantBudgets.length === 0) {
                showToast("AI Correction: No matching budgets found to optimize.", 'error');
                return;
            }

            for (const b of relevantBudgets) {
                const newLimit = Math.round(b.limit * 0.8); // 20% reduction
                await setBudget(b.category, newLimit, currentMonth);
            }

            setAppliedHabit("Weekend Overspending");
            showToast("AI Smart Habit Correction Applied: Budgets optimized by 20% for efficiency.", "success");
        } catch (error) {
            showToast("Failed to apply AI correction.", "error");
        } finally {
            setApplying(false);
        }
    };

    if (!habitData.isWeekendOverspending || appliedHabit) {
        if (appliedHabit) {
            return (
                <div className="card" style={{ borderLeft: '4px solid #10b981', background: '#f0fdf4', padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ background: '#10b981', color: 'white', padding: '10px', borderRadius: '12px' }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-success">Habit Corrected: {appliedHabit}</h4>
                            <p className="text-sm text-green-700">Financial hygiene algorithm is active. Budgets have been lowered to prevent weekend spikes.</p>
                        </div>
                    </div>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="card" style={{ 
            borderLeft: '4px solid #ef4444', 
            background: '#fef2f2', 
            padding: '1.5rem', 
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-10px', opacity: 0.05, transform: 'rotate(15deg)' }}>
                <BrainCircuit size={120} />
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ background: '#ef4444', color: 'white', minWidth: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldAlert size={28} />
                </div>
                
                <div style={{ flex: 1 }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <h4 style={{ color: '#991B1B', fontWeight: 800, fontSize: '1.1rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            AI HABIT CORRECTION DETECTED
                        </h4>
                        <span style={{ fontSize: '10px', background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>HIGH PRIORITY</span>
                    </div>
                    
                    <p style={{ color: '#B91C1C', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Pattern: Your weekend (Fri-Sun) spending is 50% higher than your weekdays.
                    </p>

                    <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px dashed #ef4444', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Zap size={16} fill="#ef4444" color="#ef4444" />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>AI RECOMMENDATION</p>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>Apply 20% Budget Discipline on Entertainment & Meals</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button 
                            onClick={handleApplyCorrection}
                            disabled={applying}
                            className="btn btn-primary" 
                            style={{ background: '#ef4444', border: 'none', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)', minWidth: '200px' }}
                        >
                            {applying ? 'Optimizing Budgets...' : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                    Execute Discipline Mode <ArrowRight size={16} />
                                </span>
                            )}
                        </button>
                        <button className="text-muted" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Dismiss & Continue Spending</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
