'use client';

import { useState } from 'react';
import { addTransaction } from '@/app/actions/transaction';
import { ShieldCheck, PlusCircle, CheckCircle } from 'lucide-react';

export default function QuickAddPage() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Others');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleQuickAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Security Check (Query Param: ?key=taxpal_magic_key)
        const params = new URLSearchParams(window.location.search);
        const key = params.get('key');
        
        if (key !== 'taxpal_magic_key') {
            alert("Unauthorized: Please use your secure TaxPal Magic Link.");
            return;
        }

        if (!description || !amount) return;

        setLoading(true);
        try {
            await addTransaction({
                description,
                amount: parseFloat(amount),
                type: 'expense',
                category,
                date: new Date().toISOString().slice(0, 10)
            });
            setSuccess(true);
            setDescription('');
            setAmount('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert("Failed to save transaction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem 1rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #6366f1 100%)'
                }} />

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: '#f5f3ff',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: '#6366f1'
                    }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Magic Entry</h1>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Securely log a transaction from anywhere.</p>
                </div>

                {success ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{
                        textAlign: 'center',
                        padding: '2rem 0'
                    }}>
                        <div style={{ color: '#10b981', marginBottom: '1rem' }}>
                            <CheckCircle size={48} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#064e3b' }}>Success!</h2>
                        <p style={{ fontSize: '14px', color: '#34d399' }}>Transaction saved to TaxPal database.</p>
                    </div>
                ) : (
                    <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Amount (₹)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    color: '#0f172a'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>What was this for?</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Starbucks, Uber"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '16px',
                                    outline: 'none',
                                    color: '#0f172a'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '16px',
                                    background: 'white',
                                    color: '#0f172a'
                                }}
                            >
                                <option>Others</option>
                                <option>Food</option>
                                <option>Transport</option>
                                <option>Business</option>
                                <option>Software</option>
                                <option>Freelance</option>
                            </select>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(90deg, #6366f1 0%, #7c3aed 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '14px',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: loading ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 8px 15px -3px rgba(99, 102, 241, 0.3)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            {loading ? "Saving..." : <><PlusCircle size={18} /> Add Transaction</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
