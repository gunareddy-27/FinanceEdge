'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Leaf, Palette, Droplets, Zap } from 'lucide-react';

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem('taxpal-theme') || 'light';
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
    }, []);

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('taxpal-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const themes = [
        { id: 'light', icon: <Sun size={14} />, label: 'Light', color: '#6366f1' },
        { id: 'dark', icon: <Moon size={14} />, label: 'Dark', color: '#818cf8' },
        { id: 'finance_green', icon: <Leaf size={14} />, label: 'Finance', color: '#10b981' },
        { id: 'midnight', icon: <Zap size={14} />, label: 'OLED', color: '#3b82f6' },
        { id: 'nature', icon: <Palette size={14} />, label: 'Nature', color: '#059669' },
        { id: 'oceanic', icon: <Droplets size={14} />, label: 'Glass', color: '#0ea5e9' },
    ];

    return (
        <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '6px', 
            background: 'var(--bg-card)', 
            padding: '6px', 
            borderRadius: '16px', 
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => toggleTheme(t.id)}
                    style={{
                        background: theme === t.id ? 'var(--primary-light)' : 'transparent',
                        color: theme === t.id ? 'var(--primary-dark)' : 'var(--text-muted)',
                        border: 'none', 
                        padding: '8px',
                        borderRadius: '10px', 
                        cursor: 'pointer',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flex: '1',
                        minWidth: '32px'
                    }}
                    title={t.label}
                >
                    {t.icon}
                </button>
            ))}
        </div>
    );
}
