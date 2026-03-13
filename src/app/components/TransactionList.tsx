'use client';

import {
    Briefcase,
    Building2,
    Coffee,
    Laptop,
    Plane,
    FileText,
    ShoppingBag,
    Utensils,
    Globe,
    CreditCard
} from 'lucide-react';

interface Transaction {
    id: number;
    description: string | null;
    amount: any;
    date: Date | string;
    type: string;
    category?: string | null;
}

interface TransactionListProps {
    transactions: Transaction[];
    title?: string;
    limit?: number;
    showViewAll?: boolean;
}

const getCategoryIcon = (category: string = '') => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('freelance') || cat.includes('salary')) return Briefcase;
    if (cat.includes('business') || cat.includes('office')) return Building2;
    if (cat.includes('meal') || cat.includes('food')) return Coffee;
    if (cat.includes('software') || cat.includes('hosting')) return Laptop;
    if (cat.includes('travel')) return Plane;
    if (cat.includes('shop')) return ShoppingBag;
    if (cat.includes('dining')) return Utensils;
    if (cat.includes('web')) return Globe;
    return FileText;
};

const getCategoryColor = (category: string = '') => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('freelance') || cat.includes('salary')) return { bg: '#D1FAE5', text: '#065F46' }; // Green
    if (cat.includes('business') || cat.includes('office')) return { bg: '#E0E7FF', text: '#3730A3' }; // Indigo
    if (cat.includes('meal')) return { bg: '#FEF3C7', text: '#92400E' }; // Amber
    if (cat.includes('software')) return { bg: '#FEE2E2', text: '#991B1B' }; // Red
    return { bg: '#F1F5F9', text: '#475569' }; // Slate
};

export default function TransactionList({ transactions, title = 'Recent Transactions', limit, showViewAll = true }: TransactionListProps) {
    const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

    return (
        <div className="card">
            <h3 className="text-xl" style={{ marginBottom: '1.25rem' }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {displayedTransactions.length === 0 ? (
                    <div className="text-muted text-sm text-center py-4">No transactions found.</div>
                ) : (
                    displayedTransactions.map((tx) => {
                        const Icon = getCategoryIcon(tx.category || tx.description || '');
                        const colors = getCategoryColor(tx.category || tx.description || '');

                        return (
                            <div key={tx.id} className="flex-between transaction-item" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: colors.bg,
                                            color: colors.text,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{tx.description}</div>
                                        <div className="text-muted text-sm" style={{ fontSize: '0.8rem' }}>
                                            {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--success-text)' : 'var(--text-main)' }}>
                                        {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                        {tx.category || tx.type}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {showViewAll && displayedTransactions.length > 0 && (
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}>
                    View All Transactions
                </button>
            )}

            <style jsx>{`
                .transaction-item:last-child {
                    border-bottom: none !important;
                    padding-bottom: 0 !important;
                }
            `}</style>
        </div>
    );
}
