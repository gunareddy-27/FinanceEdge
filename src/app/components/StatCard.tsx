'use client';

import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

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
}

const themeColors = {
    primary: { bg: '#E0E7FF', text: 'var(--primary)' }, // Indigo 100 on 500
    danger: { bg: '#FEE2E2', text: 'var(--danger-text)' }, // Red 100 on Red 700
    warning: { bg: '#FEF3C7', text: '#D97706' }, // Amber 100 on Amber 600
    success: { bg: '#D1FAE5', text: 'var(--success-text)' }, // Emerald 100 on Emerald 700
    info: { bg: '#E0F2FE', text: '#0284C7' }, // Sky 100 on Sky 600
};

export default function StatCard({ title, value, icon: Icon, trend, subtext, colorTheme = 'primary' }: StatCardProps) {
    const theme = themeColors[colorTheme];

    return (
        <div className="card stat-card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <span className="text-muted text-sm font-medium">{title}</span>
                <div
                    style={{
                        padding: 10,
                        background: theme.bg,
                        borderRadius: 'var(--radius-sm)',
                        color: theme.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon size={20} />
                </div>
            </div>

            <div className="text-2xl" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                {value}
            </div>

            {trend ? (
                <div className="flex items-center" style={{ gap: '0.25rem', display: 'flex', fontSize: '0.875rem' }}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: trend.direction === 'up' ? 'var(--success-text)' : trend.direction === 'down' ? 'var(--danger-text)' : 'var(--text-muted)',
                            fontWeight: 500,
                            gap: 2
                        }}
                    >
                        {trend.direction === 'up' && <ArrowUpRight size={16} />}
                        {trend.direction === 'down' && <ArrowDownRight size={16} />}
                        {trend.direction === 'neutral' && <Minus size={16} />}
                        {trend.value}
                    </span>
                    {trend.label && <span className="text-muted" style={{ marginLeft: 4 }}>{trend.label}</span>}
                </div>
            ) : subtext ? (
                <div className="text-muted text-sm">{subtext}</div>
            ) : null}

            <style jsx>{`
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }
            `}</style>
        </div>
    );
}
