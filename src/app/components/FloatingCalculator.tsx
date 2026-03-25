'use client';

import { useState } from 'react';
import { Calculator, X } from 'lucide-react';

export default function FloatingCalculator() {
    const [isOpen, setIsOpen] = useState(false);
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleKey = (key: string) => {
        if (key === 'C') {
            setDisplay('0');
            setEquation('');
            return;
        }
        if (key === '=') {
            try {
                // Safe evaluation logic (only numbers and basic operators)
                const safeEquation = equation.replace(/×/g, '*').replace(/÷/g, '/');
                if (!/^[0-9+\-*/.\s]+$/.test(safeEquation)) throw new Error();
                const result = Function(`"use strict"; return (${safeEquation})`)();
                setDisplay(String(result));
                setEquation(String(result));
            } catch (e) {
                setDisplay('Error');
            }
            return;
        }
        
        const lastChar = equation.slice(-1);
        const operators = ['+', '-', '*', '/', '×', '÷'];
        if (operators.includes(key) && operators.includes(lastChar)) return;

        setEquation(prev => prev === '0' ? key : prev + key);
        setDisplay(prev => (prev === '0' || operators.includes(lastChar)) ? key : prev + key);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-secondary"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 12px',
                    height: '40px'
                }}
            >
                <Calculator size={18}/>
                <span className="hidden-mobile">Quick Calc</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    width: '280px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 2000,
                    padding: '1.25rem',
                    fontFamily: 'monospace'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Calculator</span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={16}/>
                        </button>
                    </div>
                    
                    <div style={{ 
                        background: 'var(--bg-body)', 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        textAlign: 'right', 
                        marginBottom: '1rem',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', minHeight: '18px' }}>{equation}</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', overflowX: 'hidden' }}>{display}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', 'C', '0', '=', '+'].map(key => (
                            <button
                                key={key}
                                onClick={() => handleKey(key)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border)',
                                    background: key === '=' ? 'var(--primary)' : 'var(--bg-body)',
                                    color: key === '=' ? 'white' : 'var(--text-main)',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.1s'
                                }}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
