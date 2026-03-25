'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, Check } from 'lucide-react';
import { addGoal, getGoals, updateGoalProgress } from '@/app/actions/goal';
import Modal from './Modal';

interface Goal {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
}

export default function Goals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [progressAmount, setProgressAmount] = useState('');

    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        refreshGoals();
    }, []);

    const refreshGoals = async () => {
        setLoading(true);
        const data = await getGoals();
        setGoals(data as unknown as Goal[]);
        setLoading(false);
    };

    const calculateMonthlySavings = (target: number, current: number, limitDate: string) => {
        const remaining = target - current;
        if (remaining <= 0) return 0;
        const diff = new Date(limitDate).getTime() - new Date().getTime();
        const months = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24 * 30)));
        return Math.ceil(remaining / months);
    };

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        await addGoal({
            name,
            targetAmount: Number(targetAmount),
            deadline
        });
        setIsAddModalOpen(false);
        setName('');
        setTargetAmount('');
        setDeadline('');
        refreshGoals();
    };

    const handleUpdateProgress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGoal) {
            await updateGoalProgress(selectedGoal.id, Number(progressAmount));
            setIsProgressModalOpen(false);
            setProgressAmount('');
            refreshGoals();
        }
    };

    if (loading && goals.length === 0) {
        return <div className="card text-center text-muted">Loading Goals...</div>;
    }

    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Target size={20} className="text-primary" />
                    Financial Goals
                </h3>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-primary"
                    style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%' }}
                >
                    <Plus size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {goals.map(goal => {
                    const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    const reqMonthly = calculateMonthlySavings(goal.targetAmount, goal.currentAmount, goal.deadline);
                    
                    return (
                        <div key={goal.id} 
                             className="card-sub"
                             style={{ background: 'var(--bg-body)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}
                             onClick={() => { setSelectedGoal(goal); setIsProgressModalOpen(true); }}
                        >
                            <div className="flex-between" style={{ marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold' }}>{goal.name}</span>
                                <span style={{ fontWeight: 'bold' }}>{progress}%</span>
                            </div>
                            
                            <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', marginBottom: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: progress >= 100 ? '#22c55e' : 'var(--primary)', borderRadius: '4px', transition: 'width 0.3s' }}></div>
                            </div>
                            
                            <div className="flex-between text-muted" style={{ fontSize: '12px', marginBottom: '8px' }}>
                                <span>₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                                <span>Due: {goal.deadline}</span>
                            </div>

                            {progress < 100 && (
                                <div style={{ fontSize: '12px', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '6px', borderRadius: '6px', textAlign: 'center', fontWeight: '500' }}>
                                    Save ₹{reqMonthly.toLocaleString()}/mo to reach goal
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal: Add Goal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Financial Goal">
                <form onSubmit={handleAddGoal}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Goal Name</label>
                        <input className="input" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dream House" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Target Amount (₹)</label>
                        <input type="number" className="input" required value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0.00" />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Deadline</label>
                        <input type="date" className="input" required value={deadline} onChange={e => setDeadline(e.target.value)} />
                    </div>
                    <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Goal</button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Update Progress */}
            <Modal isOpen={isProgressModalOpen} onClose={() => setIsProgressModalOpen(false)} title={`Update Progress: ${selectedGoal?.name}`}>
                <form onSubmit={handleUpdateProgress}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Add Savings (₹)</label>
                        <input type="number" className="input" required value={progressAmount} onChange={e => setProgressAmount(e.target.value)} placeholder="0.00" autoFocus />
                        <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>Existing savings: ₹{selectedGoal?.currentAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsProgressModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Savings</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
