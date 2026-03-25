'use client';

import { Lightbulb, TrendingDown, Target, Zap, ArrowRight, Wallet2 } from 'lucide-react';

interface Insight {
    id: number;
    title: string;
    description: string;
    type: 'spend' | 'saving' | 'alert' | 'tip';
}

export default function InsightFeed({ income, expenses }: { income: number, expenses: number }) {
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    
    // Dynamic Insights based on state
    const insights: Insight[] = [
        { 
            id: 1, 
            type: savingsRate < 20 ? 'alert' : 'saving', 
            title: savingsRate < 20 ? "Low Savings Power" : "High Savings Velocity", 
            description: savingsRate < 20 ? `Your current savings rate is ${savingsRate}%. We recommend reaching at least 30%.` : `Exceptional Discipline! You saved ₹${(income-expenses).toLocaleString()} this month.` 
        },
        {
            id: 2,
            type: 'tip',
            title: "Smart Tax Strategy",
            description: "Allocating 15% to 80C instruments now will reduce your quarterly tax liability by roughly ₹12,500."
        },
        {
            id: 3,
            type: 'spend',
            title: "Merchant Velocity Detected",
            description: "Spending at 'Dining' merchants has increased by 18% compared to last Tuesday. Monitor Swiggy/Zomato orders."
        }
    ];

    const getIcon = (type: string) => {
        if (type === 'spend') return <TrendingDown size={18} color="#ef4444" />;
        if (type === 'saving') return <Target size={18} color="#10b981" />;
        if (type === 'tip') return <Lightbulb size={18} color="#f59e0b" />;
        return <AlertCircle size={18} color="#ef4444" />;
    };

    const getBg = (type: string) => {
        if (type === 'spend') return '#fef2f2';
        if (type === 'saving') return '#f0fdf4';
        if (type === 'tip') return '#fffbeb';
        return '#fff1f2';
    };

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Zap size={20} className="text-primary" />
                Smart Insight Feed
            </h3>
            
            <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }} className="insight-container">
                {insights.map((insight) => (
                    <div 
                        key={insight.id} 
                        style={{ 
                            minWidth: '320px', 
                            padding: '1.5rem', 
                            background: getBg(insight.type), 
                            borderRadius: '24px', 
                            border: '1px solid rgba(0,0,0,0.03)',
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 12px -2px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <div style={{ background: 'white', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    {getIcon(insight.type)}
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {insight.title}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                {insight.description}
                            </p>
                        </div>
                        
                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>
                            Take Action <ArrowRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
            
            <style jsx>{`
                .insight-container::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}

function AlertCircle({ size, color }: { size: number, color: string }) {
    return <Lightbulb size={size} color={color} />; // fallback
}
