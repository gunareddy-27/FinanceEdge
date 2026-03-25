'use client';

import { useState } from 'react';
import { Calculator, X, Minus, Plus, Sidebar as SidebarIcon, Equal } from 'lucide-react';

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
                // Safe eval replacement (simple arithmetic)
                const result = eval(equation.replace(/×/g, '*').replace(/÷/g, '/'));
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
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '25px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    cursor: 'pointer',
                    border: 'none'
                }}
            >
                {isOpen ? <X size={20}/> : <Calculator size={20}/> }
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '140px',
                    right: '25px',
                    width: '280px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1001,
                    padding: '1.25rem',
                    fontFamily: 'monospace'
                }}>
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
        </>
    );
}
