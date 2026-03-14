'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function CurrencySwitcher() {
    const [currency, setCurrency] = useState('INR');

    const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value);
        // Dispatch custom event to notify other components if needed
        const event = new CustomEvent('currency-changed', { detail: { currency: e.target.value } });
        window.dispatchEvent(event);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Globe size={16} className="text-muted" />
            <select 
                value={currency} 
                onChange={handleSwitch}
                style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                }}
            >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
            </select>
        </div>
    );
}
