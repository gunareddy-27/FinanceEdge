'use client';

import { useEffect, useState } from 'react';
import { Calendar, RefreshCw, Bell, AlertCircle } from 'lucide-react';
import { getRecurringSubscriptions } from '@/app/actions/subscription';

interface Subscription {
    id: string; // generated ID based on hash or just index
    name: string;
    amount: number;
    frequency: 'Monthly' | 'Weekly' | 'Irregular';
    nextPaymentDate: string;
    lastPaymentDate: string;
}

export default function SubscriptionManager() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRecurringSubscriptions()
            .then(data => {
                // Ensure data matches expected type (serialization over network)
                setSubscriptions(data as unknown as Subscription[]);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading Subscriptions...
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return null; // Don't show if empty
    }

    return (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 className="text-xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={20} color="#3b82f6" />
                    Recurring Expenses
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {subscriptions.map((sub, idx) => {
                    const today = new Date();
                    const nextDate = new Date(sub.nextPaymentDate);

                    // Calculate days difference
                    const diffTime = nextDate.getTime() - today.getTime();
                    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    const isDueSoon = daysUntil <= 3 && daysUntil >= 0;
                    const isOverdue = daysUntil < 0;

                    let statusColor = '#64748b'; // generic gray
                    if (isDueSoon) statusColor = '#f59e0b'; // orange
                    if (isOverdue) statusColor = '#ef4444'; // red

                    return (
                        <div key={idx} style={{
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: isDueSoon || isOverdue ? '#fee2e2' : '#e0f2fe',
                                    color: isDueSoon || isOverdue ? '#dc2626' : '#0ea5e9'
                                }}>
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{sub.name}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                                        {sub.frequency} • Last paid {new Date(sub.lastPaymentDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)', margin: 0 }}>
                                    ${Number(sub.amount).toFixed(2)}
                                </p>
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: statusColor,
                                    margin: '4px 0 0 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    gap: '4px'
                                }}>
                                    {(isDueSoon || isOverdue) && <AlertCircle size={12} />}
                                    {isOverdue
                                        ? `Overdue ${Math.abs(daysUntil)}d`
                                        : daysUntil === 0
                                            ? 'Due Today'
                                            : `Due in ${daysUntil}d`
                                    }
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
