'use client';

import { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import Modal from './Modal';

interface Goal {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
}

export default function Goals() {
    const [goals, setGoals] = useState<Goal[]>([
        {
            id: 1,
            name: "Emergency Fund",
            targetAmount: 30000,
            currentAmount: 18000,
            deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().slice(0, 10),
        },
        {
            id: 2,
            name: "New Laptop",
            targetAmount: 80000,
            currentAmount: 36000,
            deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().slice(0, 10),
        }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    const calculateMonthlySavings = (target: number, current: number, limitDate: string) => {
        const remaining = target - current;
        if (remaining <= 0) return 0;
        const months = Math.max(1, Math.ceil((new Date(limitDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
        return Math.ceil(remaining / months);
    };

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        const newGoal = {
            id: Date.now(),
            name,
            targetAmount: Number(targetAmount),
            currentAmount: 0,
            deadline
        };
        setGoals([...goals, newGoal]);
        setIsModalOpen(false);
        setName('');
        setTargetAmount('');
        setDeadline('');
    };

    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Target size={20} className="text-blue-600" />
                    Financial Goals
                </h3>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                    <Plus size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {goals.map(goal => {
                    const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    const reqMonthly = calculateMonthlySavings(goal.targetAmount, goal.currentAmount, goal.deadline);
                    
                    return (
                        <div key={goal.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div className="flex-between" style={{ marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{goal.name}</span>
                                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{progress}%</span>
                            </div>
                            
                            {/* Progress bar */}
                            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: progress >= 100 ? '#22c55e' : 'var(--primary)', borderRadius: '4px', transition: 'width 0.3s' }}></div>
                            </div>
                            
                            <div className="flex-between" style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                                <span>₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                                <span>In {Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))} months</span>
                            </div>

                            {progress < 100 && (
                                <div style={{ fontSize: '12px', background: '#e0e7ff', color: '#4338ca', padding: '6px', borderRadius: '6px', textAlign: 'center', fontWeight: '500' }}>
                                    Save ₹{reqMonthly.toLocaleString()}/mo to reach goal
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Financial Goal">
                <form onSubmit={handleAddGoal}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Goal Name</label>
                        <input className="input" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vacation" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Target Amount (₹)</label>
                        <input type="number" className="input" required value={targetAmount} onChange={e => setTargetAmount(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Deadline</label>
                        <input type="date" className="input" required value={deadline} onChange={e => setDeadline(e.target.value)} />
                    </div>
                    <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Goal</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
