'use client';

import { Users, SplitSquareHorizontal, CheckCircle2 } from 'lucide-react';

export default function ExpenseSplitter() {
    return (
        <div className="card">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-xl flex items-center gap-2">
                    <Users size={20} className="text-primary" />
                    Expense Splitter
                </h3>
                <button className="btn btn-secondary text-sm">New Group</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>Dinner at Paradise</span>
                        <span style={{ color: 'var(--danger)' }}>₹2,000</span>
                    </div>
                    <div className="flex-between text-sm text-muted">
                        <span className="flex items-center gap-1">
                            <SplitSquareHorizontal size={14} /> Split with 4 friends
                        </span>
                        <span>₹500 / person</span>
                    </div>
                    
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-between text-sm">
                            <span>Rahul</span>
                            <span className="text-success flex items-center gap-1"><CheckCircle2 size={14}/> Paid</span>
                        </div>
                        <div className="flex-between text-sm">
                            <span>Neha</span>
                            <span className="text-danger">Owes ₹500</span>
                        </div>
                        <div className="flex-between text-sm">
                            <span>Amit</span>
                            <span className="text-danger">Owes ₹500</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>Goa Trip</span>
                        <span style={{ color: 'var(--danger)' }}>₹15,000</span>
                    </div>
                    <div className="flex-between text-sm text-muted">
                        <span className="flex items-center gap-1">
                            <SplitSquareHorizontal size={14} /> Split with 3 friends
                        </span>
                        <span>₹5,000 / person</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
