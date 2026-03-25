'use client';

import { Calculator, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { calculateTaxEstimate } from '@/app/actions/tax';
import { useToast } from '@/app/components/ToastProvider';

export default function TaxEstimatorClient({ initialResult }: { initialResult?: any }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(initialResult || null);

    const [formData, setFormData] = useState({
        income: '1200000',
        deductions: '150000',
        filingStatus: 'Individual',
        paidQ1: '25000'
    });

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await calculateTaxEstimate({
                income: Number(formData.income),
                deductions: Number(formData.deductions),
                filingStatus: formData.filingStatus,
                paidQ1: Number(formData.paidQ1)
            });
            setResult(res);
            showToast('Tax estimate updated successfully', 'success');
        } catch (err) {
            showToast('Failed to calculate estimates', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Tax Estimator</h1>
                    <p className="text-muted">Estimate your quarterly taxes and stay prepared.</p>
                </div>
                <button onClick={handleCalculate} className="btn btn-primary" disabled={loading}>
                    <Calculator size={18} />
                    {loading ? 'Calculating...' : 'Recalculate'}
                </button>
            </header>

            <div className="grid-cols-2" style={{ alignItems: 'start' }}>

                {/* Estimator Input Form */}
                <div className="card">
                    <h3 className="text-xl" style={{ marginBottom: '1.5rem' }}>Configuration</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Country / Region</label>
                        <select className="input">
                            <option>India</option>
                            <option>United States</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Filing Status</label>
                        <select
                            className="input"
                            value={formData.filingStatus}
                            onChange={(e) => setFormData({ ...formData, filingStatus: e.target.value })}
                        >
                            <option>Individual</option>
                            <option>HUF (Hindu Undivided Family)</option>
                            <option>Firm / Company</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Est. Annual Income (Gross)</label>
                        <input
                            type="number"
                            className="input"
                            value={formData.income}
                            onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Est. Annual Income (₹)</label>
                        <input
                            type="number"
                            className="input"
                            value={formData.deductions}
                            onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                        />
                    </div>

                    <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <p className="text-sm text-muted">Includes standard deduction and customized itemized deductions based on your tracking.</p>
                    </div>
                </div>

                {/* Results */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Summary Card */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)', color: 'white', border: 'none' }}>
                        <h3 className="text-xl" style={{ marginBottom: '0.5rem', opacity: 0.9 }}>Estimated Tax Due (Q2)</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                            ₹{result ? result.q2.toLocaleString() : '85,000'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                            <Calendar size={16} />
                            <span>Due Date: June 15, 2025</span>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="card">
                        <h3 className="text-xl" style={{ marginBottom: '1rem' }}>Quarterly Breakdown (Est.)</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="flex-between">
                                <div>
                                    <div style={{ fontWeight: 500 }}>Q1 (Jan - Mar)</div>
                                    <div className="text-muted text-sm">Paid</div>
                                </div>
                                <div style={{ display: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} className="text-success" />
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{Number(formData.paidQ1).toLocaleString()}</span>
                                </div>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--border)' }}></div>

                            <div className="flex-between">
                                <div>
                                    <div style={{ fontWeight: 500 }}>Q2 (Apr - Jun)</div>
                                    <div className="text-muted text-sm">Upcoming</div>
                                </div>
                                <div style={{ fontWeight: 600 }}>₹{result ? result.q2.toLocaleString() : '85,000'}</div>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--border)' }}></div>

                            <div className="flex-between">
                                <div>
                                    <div style={{ fontWeight: 500 }}>Q3 (Jul - Sep)</div>
                                    <div className="text-muted text-sm">Projected</div>
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>₹{result ? result.q3.toLocaleString() : '85,000'}</div>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--border)' }}></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
