'use client';

import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        direction: 'up' | 'down' | 'neutral';
        label?: string;
    };
    subtext?: string;
    colorTheme?: 'primary' | 'danger' | 'warning' | 'success' | 'info';
    confidence?: string;
}

const themeColors = {
    primary: { bg: '#E0E7FF', text: 'var(--primary)', accent: 'var(--primary-light)' },
    danger: { bg: '#FEE2E2', text: 'var(--danger-text)', accent: '#fecaca' },
    warning: { bg: '#FEF3C7', text: '#D97706', accent: '#fde68a' },
    success: { bg: '#D1FAE5', text: 'var(--success-text)', accent: '#a7f3d0' },
    info: { bg: '#E0F2FE', text: '#0284C7', accent: '#bae6fd' },
};

export default function StatCard({ title, value, icon: Icon, trend, subtext, colorTheme = 'primary', confidence }: StatCardProps) {
    const theme = themeColors[colorTheme];

    return (
        <motion.div 
            whileHover={{ y: -5, boxShadow: 'var(--shadow-xl)', borderColor: theme.text }}
            whileTap={{ scale: 0.98 }}
            className="card stat-card" 
            style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                border: '1px solid var(--border)',
                cursor: 'pointer'
            }}
        >
            {/* 4. Smart Highlighting UI (Subtle pulse on danger) */}
            {colorTheme === 'danger' && (
                <motion.div 
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', inset: 0, background: 'var(--danger-bg)', pointerEvents: 'none' }}
                />
            )}

            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="text-muted text-xs font-bold uppercase tracking-widest">{title}</span>
                    {confidence && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ 
                                padding: '2px 6px', 
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                                color: 'white', 
                                borderRadius: '6px', 
                                fontSize: '9px', 
                                fontWeight: 900,
                                letterSpacing: '0.05em',
                                boxShadow: '0 0 10px rgba(79, 70, 229, 0.4)'
                            }}
                        >
                            AI {confidence}
                        </motion.div>
                    )}
                </div>
                <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    style={{
                        padding: 10,
                        background: theme.bg,
                        borderRadius: '14px',
                        color: theme.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 10px ${theme.accent}`
                    }}
                >
                    <Icon size={18} />
                </motion.div>
            </div>

            <div style={{ position: 'relative' }}>
                <AnimatePresence mode="popLayout">
                    <motion.div 
                        key={String(value)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-3xl" 
                        style={{ fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}
                    >
                        {value}
                    </motion.div>
                </AnimatePresence>
            </div>

            {trend ? (
                <div className="flex items-center" style={{ gap: '0.5rem', display: 'flex', fontSize: '0.8rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            background: trend.direction === 'up' ? '#d1fae5' : trend.direction === 'down' ? '#fee2e2' : '#f1f5f9',
                            color: trend.direction === 'up' ? '#065f46' : trend.direction === 'down' ? '#991b1b' : '#64748b',
                            fontWeight: 700,
                            gap: 4
                        }}
                    >
                        {trend.direction === 'up' && <ArrowUpRight size={14} />}
                        {trend.direction === 'down' && <ArrowDownRight size={14} />}
                        {trend.direction === 'neutral' && <Minus size={14} />}
                        {trend.value}
                    </div>
                    {trend.label && <span className="text-muted" style={{ fontWeight: 500 }}>{trend.label}</span>}
                </div>
            ) : subtext ? (
                <div className="text-muted text-xs font-medium flex items-center gap-1">
                    <Sparkles size={12} className="text-primary" /> {subtext}
                </div>
            ) : (
                 <div className="text-muted text-xs font-medium flex items-center gap-1">
                    <Sparkles size={12} style={{ opacity: 0.4 }} /> Intelligent tracking
                </div>
            )}
        </motion.div>
    );
}
