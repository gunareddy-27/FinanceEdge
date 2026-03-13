'use client';

import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export default function AiInsights() {
    return (
        <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', border: 'none' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={20} className="animate-pulse" />
                    <h3 className="text-xl" style={{ fontWeight: 600 }}>TaxPal Smart Insights</h3>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>BETA</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                    <TrendingUp size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Income Streak</div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>You've earned 15% more this month compared to your 6-month average. Consider setting aside an extra 5% for taxes.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                    <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#FECACA' }} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Budget Alert</div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>You're close to your 'Software Subscriptions' limit. Review your recurring payments.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                    <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#FEF08A' }} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Tax Saving Tip</div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Did you know? Your home office deduction could save you ~$850 this quarter based on your expense patterns.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
