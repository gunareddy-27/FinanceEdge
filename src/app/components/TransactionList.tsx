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
    CreditCard,
    MapPin,
    ArrowRight,
    CalendarDays
} from 'lucide-react';

interface Transaction {
    id: number;
    description: string | null;
    amount: any;
    date: Date | string;
    type: string;
    category?: string | null;
    fromDest?: string | null;
    toDest?: string | null;
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
    if (cat.includes('travel') || cat.includes('transport')) return Plane;
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
    if (cat.includes('travel') || cat.includes('transport')) return { bg: '#E0F2FE', text: '#0369A1' }; // Blue
    return { bg: '#F1F5F9', text: '#475569' }; // Slate
};

export default function TransactionList({ transactions, title = 'Activity Timeline', limit, showViewAll = true }: TransactionListProps) {
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const displayedTransactions = limit ? sorted.slice(0, limit) : sorted;

    // Grouping by Date
    const groups: Record<string, Transaction[]> = {};
    displayedTransactions.forEach(tx => {
        const dateStr = new Date(tx.date).toLocaleDateString(undefined, { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(tx);
    });

    return (
        <div className="card timeline-container" style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <CalendarDays size={20} className="text-primary" />
                    {title}
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Object.keys(groups).length === 0 ? (
                    <div className="text-muted text-sm text-center py-8">No activity found.</div>
                ) : (
                    Object.entries(groups).map(([date, txs]) => (
                        <div key={date}>
                            <div style={{ 
                                fontSize: '12px', 
                                fontWeight: 800, 
                                color: 'var(--text-muted)', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.05em',
                                marginBottom: '1rem',
                                paddingLeft: '8px',
                                borderLeft: '3px solid var(--primary-light)'
                            }}>
                                {date}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {txs.map((tx) => {
                                    const Icon = getCategoryIcon(tx.category || tx.description || '');
                                    const colors = getCategoryColor(tx.category || tx.description || '');
                                    const amt = Number(tx.amount);
                                    const isTravel = tx.category === 'Travel' || tx.category === 'Transport';

                                    return (
                                        <div key={tx.id} className="flex-between transaction-item" style={{ 
                                            padding: '12px', 
                                            borderRadius: '16px',
                                            background: 'var(--bg-body)',
                                            border: '1px solid transparent',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    background: colors.bg,
                                                    color: colors.text,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                                }}>
                                                    <Icon size={22} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tx.description}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                                        {tx.category || tx.type}
                                                    </div>
                                                    
                                                    {isTravel && (tx.fromDest || tx.toDest) && (
                                                        <div style={{ 
                                                            marginTop: '8px', 
                                                            fontSize: '11px', 
                                                            color: '#64748b',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}>
                                                            <MapPin size={10} color="#10b981" />
                                                            <span>{tx.fromDest}</span>
                                                            <ArrowRight size={10} />
                                                            <span>{tx.toDest}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ 
                                                    fontWeight: 800, 
                                                    fontSize: '1.05rem',
                                                    color: tx.type === 'income' ? '#059669' : '#1e293b' 
                                                }}>
                                                    {tx.type === 'income' ? '+' : '-'}₹{amt.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showViewAll && sorted.length > limit! && (
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem', borderRadius: '14px' }}>
                    View Full History
                </button>
            )}

            <style jsx>{`
                .transaction-item:hover {
                    border-color: var(--primary-light) !important;
                    background: white !important;
                    transform: scale(1.01);
                    box-shadow: 0 4px 12px -2px rgba(0,0,0,0.05);
                }
            `}</style>
        </div>
    );
}
