'use client';

import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowUpRight, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiInsights({ income = 0, expenses = 0 }) {
    const savings = income - expenses;
    const isHealthy = savings > (income * 0.2);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card" 
            style={{ 
                background: isHealthy 
                    ? 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)' 
                    : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                color: 'white', 
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
        >
            {/* 4. Smart Highlighting UI (Glowing effect) */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'white', borderRadius: '50%', filter: 'blur(80px)' }}
            />

            <div className="flex-between" style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                        <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold" style={{ letterSpacing: '-0.02em' }}>Intelligence Report</h3>
                        <p style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 600 }}>FINANCE ENGINE v4.2 PRO</p>
                    </div>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                    <div className="flex items-center gap-1">
                        <Zap size={14} /> ADAPTIVE MODE
                    </div>
                </div>
            </div>

            {/* 2. Data Storytelling Dashboard */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: '1.2' }}>
                    {isHealthy 
                        ? "This month you improved your savings by 12% 🎉" 
                        : "Caution: Burn rate is 15% higher this period ⚠️"}
                </h2>
                <div style={{ fontSize: '14px', opacity: 0.8, maxWidth: '90%' }}>
                    Our AI models detected a <strong>7-day streak</strong> of disciplined spending in "Food & Dining". 
                    This trajectory puts you on track for your <strong>MacBook Pro goal</strong> 3 weeks early.
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', position: 'relative', zIndex: 1 }}>
                
                {/* 5. Progressive Disclosure UI (Interactive Insight) */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                >
                    <div className="flex-between mb-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <Target size={18} className="text-primary-light" /> Optimized Target
                        </div>
                        <ArrowUpRight size={14} opacity={0.6} />
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.8 }}>Recommendation: Transfer <strong>₹12,400</strong> to "High Yield Savings" to capture 7.2% APR yield cycle.</div>
                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '1rem' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} style={{ height: '100%', background: '#10b981', borderRadius: '2px' }} />
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                >
                    <div className="flex-between mb-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <Lightbulb size={18} style={{ color: '#fbbf24' }} /> Strategy Tip
                        </div>
                        <ArrowUpRight size={14} opacity={0.6} />
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.8 }}>Tax Advantage: Investing <strong>₹25,000</strong> in ELSS by Friday can reduce Q2 liability by 14%.</div>
                    <motion.div 
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ marginTop: '1rem', fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}
                    >
                         → SECURE DEDUCTION NOW
                    </motion.div>
                </motion.div>

            </div>
        </motion.div>
    );
}
