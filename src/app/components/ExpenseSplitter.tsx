'use client';

import { useState, useEffect } from 'react';
import { Users, SplitSquareHorizontal, CheckCircle2, Plus, X } from 'lucide-react';
import { createExpenseGroup, getExpenseGroups, toggleMemberPaid } from '@/app/actions/expenseSplit';
import Modal from './Modal';

interface GroupMember {
    id: number;
    name: string;
    shareAmount: number;
    isPaid: boolean;
}

interface ExpenseGroup {
    id: number;
    name: string;
    totalAmount: number;
    members: GroupMember[];
}

export default function ExpenseSplitter() {
    const [groups, setGroups] = useState<ExpenseGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [groupName, setGroupName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [members, setMembers] = useState<{ name: string; shareAmount: number }[]>([]);
    const [newMemberName, setNewMemberName] = useState('');

    useEffect(() => {
        refreshGroups();
    }, []);

    const refreshGroups = async () => {
        setLoading(true);
        const data = await getExpenseGroups();
        setGroups(data as unknown as ExpenseGroup[]);
        setLoading(false);
    };

    const handleAddMember = () => {
        if (newMemberName.trim()) {
            setMembers([...members, { name: newMemberName, shareAmount: 0 }]);
            setNewMemberName('');
        }
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(totalAmount);
        const share = amount / (members.length || 1);
        
        await createExpenseGroup({
            name: groupName,
            totalAmount: amount,
            members: members.map(m => ({ ...m, shareAmount: share }))
        });

        setIsModalOpen(false);
        setGroupName('');
        setTotalAmount('');
        setMembers([]);
        refreshGroups();
    };

    const handleTogglePaid = async (memberId: number, currentStatus: boolean) => {
        await toggleMemberPaid(memberId, !currentStatus);
        refreshGroups();
    };

    if (loading && groups.length === 0) {
        return <div className="card text-center text-muted">Loading Splitter...</div>;
    }

    return (
        <div className="card">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-xl flex items-center gap-2">
                    <Users size={20} className="text-primary" />
                    Expense Splitter
                </h3>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary text-sm">New Group</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {groups.map(group => (
                    <div key={group.id} style={{ padding: '1rem', backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>{group.name}</span>
                            <span className="text-danger">₹{group.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex-between text-sm text-muted" style={{ marginBottom: '1rem' }}>
                            <span className="flex items-center gap-1">
                                <SplitSquareHorizontal size={14} /> Split with {group.members.length} friends
                            </span>
                            <span>₹{Math.round(group.totalAmount / group.members.length).toLocaleString()} / person</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {group.members.map(member => (
                                <div key={member.id} className="flex-between text-sm">
                                    <span>{member.name}</span>
                                    <button 
                                        onClick={() => handleTogglePaid(member.id, member.isPaid)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        className={member.isPaid ? 'text-success' : 'text-danger'}
                                    >
                                        {member.isPaid ? <><CheckCircle2 size={14}/> Paid</> : `Owes ₹${member.shareAmount.toLocaleString()}`}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="text-center text-muted text-sm py-4">No groups yet. Start splitting!</div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Split Group">
                <form onSubmit={handleCreateGroup}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Group/Expense Name</label>
                        <input className="input" required value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="e.g. Dinner at Paradise" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Total Amount (₹)</label>
                        <input type="number" className="input" required value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="0.00" />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Add Members</label>
                        <div className="flex" style={{ gap: '0.5rem' }}>
                            <input className="input" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Member Name" />
                            <button type="button" onClick={handleAddMember} className="btn btn-secondary"><Plus size={18}/></button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {members.map((m, idx) => (
                            <div key={idx} style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {m.name}
                                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeMember(idx)} />
                            </div>
                        ))}
                    </div>

                    <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={members.length === 0}>Create Group</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
