'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Landmark, Calculator as CalcIcon } from 'lucide-react';

export default function FinancialCalculators() {
    const [activeCalc, setActiveCalc] = useState('sip');

    return (
        <div className="card" style={{ padding: '1.5rem', height: '100%', background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Calculator size={24} className="text-primary" />
                    Interactive Calc Center
                </h3>
            </div>

            {/* Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                <button 
                    onClick={() => setActiveCalc('sip')}
                    className={`btn ${activeCalc === 'sip' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                    SIP Calc
                </button>
                <button 
                    onClick={() => setActiveCalc('emi')}
                    className={`btn ${activeCalc === 'emi' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                    EMI Calc
                </button>
                <button 
                    onClick={() => setActiveCalc('fd')}
                    className={`btn ${activeCalc === 'fd' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                    FD/Lumpsum
                </button>
            </div>

            {activeCalc === 'sip' && <SIPCalculator />}
            {activeCalc === 'emi' && <EMICalculator />}
            {activeCalc === 'fd' && <FDCalculator />}
        </div>
    );
}

function SIPCalculator() {
    const [monthly, setMonthly] = useState(5000);
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(12);

    const calcMaturity = () => {
        const i = (rate / 100) / 12;
        const n = years * 12;
        const maturityValue = monthly * (((Math.pow(1 + i, n)) - 1) / i) * (1 + i);
        return Math.round(maturityValue);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label className="label text-xs">Monthly Investment (₹)</label>
                <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="input text-sm" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="label text-xs">Tenure (Years)</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="input text-sm" />
                </div>
                <div>
                    <label className="label text-xs">Expected Return (%)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="input text-sm" />
                </div>
            </div>
            <div className="card" style={{ background: 'var(--primary-light)', padding: '1rem', border: 'none' }}>
                <p className="text-xs text-muted mb-1">Maturity Value after {years} years</p>
                <h4 className="text-2xl font-bold text-primary">₹ {calcMaturity().toLocaleString()}</h4>
                <p className="text-[10px] text-primary mt-1">Invested: ₹{(monthly * 12 * years).toLocaleString()}</p>
            </div>
        </div>
    );
}

function EMICalculator() {
    const [loan, setLoan] = useState(500000);
    const [rate, setRate] = useState(9);
    const [years, setYears] = useState(5);

    const calcEMI = () => {
        const p = loan;
        const r = (rate / 100) / 12;
        const n = years * 12;
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        return Math.round(emi);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label className="label text-xs">Loan Amount (₹)</label>
                <input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="input text-sm" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="label text-xs">Interest Rate (%)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="input text-sm" />
                </div>
                <div>
                    <label className="label text-xs">Tenure (Years)</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="input text-sm" />
                </div>
            </div>
            <div className="card" style={{ background: '#fef2f2', padding: '1rem', border: 'none' }}>
                <p className="text-xs text-muted mb-1">Monthly EMI</p>
                <h4 className="text-2xl font-bold text-danger">₹ {calcEMI().toLocaleString()}</h4>
                <p className="text-[10px] text-danger mt-1">Total Interest: ₹{(calcEMI() * 12 * years - loan).toLocaleString()}</p>
            </div>
        </div>
    );
}

function FDCalculator() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(5);

    const calcFD = () => {
        const maturity = principal * Math.pow(1 + (rate / 100), years);
        return Math.round(maturity);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label className="label text-xs">Investment Amount (₹)</label>
                <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="input text-sm" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="label text-xs">Interest Rate (%)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="input text-sm" />
                </div>
                <div>
                    <label className="label text-xs">Years</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="input text-sm" />
                </div>
            </div>
            <div className="card" style={{ background: '#ecfdf5', padding: '1rem', border: 'none' }}>
                <p className="text-xs text-muted mb-1">Estimated Maturity (Compound)</p>
                <h4 className="text-2xl font-bold text-success">₹ {calcFD().toLocaleString()}</h4>
                <p className="text-[10px] text-success mt-1">Total Gain: ₹{(calcFD() - principal).toLocaleString()}</p>
            </div>
        </div>
    );
}
