'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Leaf } from 'lucide-react';

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

    return (
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-body)', padding: '4px', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <button
                onClick={() => toggleTheme('light')}
                style={{
                    background: theme === 'light' ? 'var(--bg-card)' : 'transparent',
                    color: theme === 'light' ? 'var(--text-main)' : 'var(--text-muted)',
                    border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer',
                    boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Light Mode"
            >
                <Sun size={16} />
            </button>
            <button
                onClick={() => toggleTheme('dark')}
                style={{
                    background: theme === 'dark' ? 'var(--bg-card)' : 'transparent',
                    color: theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)',
                    border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer',
                    boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Dark Mode"
            >
                <Moon size={16} />
            </button>
            <button
                onClick={() => toggleTheme('finance_green')}
                style={{
                    background: theme === 'finance_green' ? 'var(--bg-card)' : 'transparent',
                    color: theme === 'finance_green' ? '#10b981' : 'var(--text-muted)',
                    border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer',
                    boxShadow: theme === 'finance_green' ? 'var(--shadow-sm)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Finance Green Theme"
            >
                <Leaf size={16} />
            </button>
        </div>
    );
}
