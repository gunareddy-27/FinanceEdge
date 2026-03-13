'use client';

import { Search, Filter, Plus, X, Check, ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { addTransaction } from '@/app/actions/transaction';
import ReceiptScanner from '@/app/components/ReceiptScanner';

interface Transaction {
    id: number;
    description: string | null;
    amount: number;
    date: Date;
    type: string;
    category: string;
}

export default function TransactionsClient({ transactions }: { transactions: Transaction[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter & Search State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Business',
        date: new Date().toISOString().slice(0, 10)
    });

    // Derived Filtered Transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = (tx.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (tx.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || tx.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [transactions, searchTerm, filterType]);

    const handleReceiptScanned = (data: { merchant: string; date: Date | null; amount: number | null }) => {
        setFormData(prev => ({
            ...prev,
            description: data.merchant,
            amount: data.amount ? data.amount.toString() : prev.amount,
            date: data.date ? data.date.toISOString().slice(0, 10) : prev.date,
            type: 'expense'
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await addTransaction({
            description: formData.description,
            amount: Number(formData.amount),
            type: formData.type,
            category: formData.category,
            date: formData.date
        });
        setLoading(false);
        setIsModalOpen(false);
        setFormData({
            description: '',
            amount: '',
            type: 'expense',
            category: 'Business',
            date: new Date().toISOString().slice(0, 10)
        });
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Transactions</h1>
                    <p className="text-muted">Manage your income and expenses.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Transaction
                </button>
            </header>

            <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            style={{ backgroundColor: isFilterOpen || filterType !== 'all' ? '#eff6ff' : undefined, borderColor: isFilterOpen || filterType !== 'all' ? 'var(--primary)' : undefined }}
                        >
                            <Filter size={18} />
                            {filterType === 'all' ? 'Filter' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                            <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                        </button>

                        {/* Filter Dropdown */}
                        {isFilterOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '110%',
                                right: 0,
                                width: '200px',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                border: '1px solid var(--border)',
                                zIndex: 50,
                                overflow: 'hidden'
                            }}>
                                <div style={{ padding: '8px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Filter by Type
                                </div>
                                {(['all', 'income', 'expense'] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setFilterType(type);
                                            setIsFilterOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '10px 16px',
                                            border: 'none',
                                            background: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            color: filterType === type ? 'var(--primary)' : 'var(--text-main)'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        {type === 'all' ? 'All Transactions' : type.charAt(0).toUpperCase() + type.slice(1)}
                                        {filterType === type && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '400px' }}>
                {filteredTransactions.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {searchTerm || filterType !== 'all'
                            ? 'No transactions match your filters.'
                            : 'No transactions found. Start by adding one!'}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#F9FAFB', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Description</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{tx.description}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: '#F3F4F6',
                                            borderRadius: '99px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}>
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: tx.type === 'income' ? '#D1FAE5' : '#FEF3C7',
                                            color: tx.type === 'income' ? '#065F46' : '#92400E'
                                        }}>
                                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--secondary)' : 'var(--text-main)' }}>
                                        {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Transaction Modal & Scanner */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '16px' }}>
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="text-xl">Add Transaction</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-muted)" />
                            </button>
                        </div>

                        {/* Scanner Integration */}
                        <ReceiptScanner onScanComplete={handleReceiptScanned} />

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label className="label">Type</label>
                                    <select
                                        className="input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Amount</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="0.00"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Description</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Office Rent"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label">Category</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Rent, Utilities"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label">Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
