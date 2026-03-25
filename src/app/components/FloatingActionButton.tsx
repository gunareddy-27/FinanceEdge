'use client';

import { useState } from 'react';
import { Plus, Receipt, Banknote, ScanLine, X, Mic } from 'lucide-react';

interface FABProps {
    onAddExpense: () => void;
    onAddIncome: () => void;
    onScanReceipt: () => void;
}

export default function FloatingActionButton({ onAddExpense, onAddIncome, onScanReceipt }: FABProps) {
    const [isOpen, setIsOpen] = useState(false);

    const btnStyle = {
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        position: 'relative' as 'relative'
    };

    const actionBtnStyle = {
        width: '48px',
        height: '48px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        color: 'var(--primary)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid var(--border)',
        marginBottom: '1rem',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(20px) scale(0.8)',
        pointerEvents: (isOpen ? 'auto' : 'none') as React.CSSProperties['pointerEvents']
    };

    return (
        <div style={{ position: 'fixed', bottom: '100px', right: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ position: 'relative' }}>
                   <button onClick={() => { onAddIncome(); setIsOpen(false); }} style={{ ...actionBtnStyle, transitionDelay: '0ms' }} title="Add Income">
                        <Banknote size={20} />
                    </button>
                    {isOpen && <span style={{ position: 'absolute', right: '60px', top: '12px', background: 'black', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', whiteSpace: 'nowrap' }}>Add Income</span>}
                </div>
                
                <div style={{ position: 'relative' }}>
                    <button onClick={() => { onScanReceipt(); setIsOpen(false); }} style={{ ...actionBtnStyle, transitionDelay: '50ms' }} title="Scan Receipt">
                        <ScanLine size={20} />
                    </button>
                    {isOpen && <span style={{ position: 'absolute', right: '60px', top: '12px', background: 'black', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', whiteSpace: 'nowrap' }}>Scan Receipt</span>}
                </div>

                <div style={{ position: 'relative' }}>
                    <button onClick={() => { onAddExpense(); setIsOpen(false); }} style={{ ...actionBtnStyle, transitionDelay: '100ms' }} title="Add Expense">
                        <Receipt size={20} />
                    </button>
                    {isOpen && <span style={{ position: 'absolute', right: '60px', top: '12px', background: 'black', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', whiteSpace: 'nowrap' }}>Add Expense</span>}
                </div>
            </div>

            {/* Main Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ 
                    ...btnStyle, 
                    background: isOpen ? '#ef4444' : 'var(--primary)', 
                    color: 'white',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)'
                }}
            >
                <Plus size={28} />
            </button>
        </div>
    );
}
