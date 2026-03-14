'use client';

import { Suspense } from 'react';
import { BrainCircuit, LineChart, AlertTriangle, ShieldCheck, PieChart, TrendingUp, Cpu } from 'lucide-react';

interface Anomaly {
    id: number;
    description: string | null;
    amount: any;
    date: Date;
    reason: string;
}

interface BudgetOpt {
    Needs: number;
    Wants: number;
    Savings: number;
    Algorithm: string;
}

interface InvestRec {
    riskLevel: string;
    portfolio: Record<string, string>;
    advice: string;
}

interface AILabClientProps {
    behaviorData: { profile: string, insights: string, weekendSpending: number, weekdaySpending: number };
    predictionData: { prediction: number, confidence: string };
    anomaliesData: Anomaly[];
    budgetData: BudgetOpt | null;
    investmentData: InvestRec;
    riskData: { riskLevel: string, reasons: string[] };
}

export default function AILabClient({ behaviorData, predictionData, anomaliesData, budgetData, investmentData, riskData }: AILabClientProps) {
    
    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Cpu size={32} className="text-primary" />
                        AI Research Lab
                    </h1>
                    <p className="text-muted">A deep dive into your fintech metrics using Machine Learning models.</p>
                </div>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                    Ensemble Mode Active
                </div>
            </header>

            <div className="grid-cols-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '1.5rem' }}>
                
                {/* 2. Personalized Spending Behavior Analysis (K-Means Clustering Simulation) */}
                <div className="card">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ marginBottom: '1rem' }}><BrainCircuit size={18} /> Spending Behavior (K-Means Cluster)</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{behaviorData.profile}</span>
                    </div>
                    <p className="text-muted text-sm">{behaviorData.insights}</p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weekday (Avg)</div>
                            <div style={{ fontWeight: 600 }}>${behaviorData.weekdaySpending.toFixed(0)}</div>
                        </div>
                        <div style={{ flex: 1, background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weekend (Avg)</div>
                            <div style={{ fontWeight: 600 }}>${behaviorData.weekendSpending.toFixed(0)}</div>
                        </div>
                    </div>
                </div>

                {/* 3. Monthly Expense Prediction Model */}
                <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ marginBottom: '1rem' }}><LineChart size={18} /> Deep Expense Forecast (Ensemble)</h3>
                    <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>Using Combined Random Forest & LSTM heuristics.</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Next Month Expected</div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>${predictionData.prediction.toLocaleString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Model Confidence</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#10b981' }}>{predictionData.confidence}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-cols-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '1.5rem' }}>
                
                {/* 5. Fraudulent Transaction Detection (Anomaly) */}
                <div className="card">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ marginBottom: '1rem' }}><AlertTriangle size={18} color="#ef4444" /> Anomaly Detection (Isolation Forest)</h3>
                    {anomaliesData.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#10b981' }}>
                            <ShieldCheck size={32} style={{ marginBottom: '0.5rem' }} />
                            <span>No anomalies detected.</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {anomaliesData.map(a => (
                                <div key={a.id} style={{ padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                                    <div className="flex-between">
                                        <span style={{ fontWeight: 600, color: '#991b1b' }}>{a.description}</span>
                                        <span style={{ fontWeight: 700, color: '#991b1b' }}>${Number(a.amount).toFixed(2)}</span>
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#7f1d1d', marginTop: '4px' }}>{a.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 10. Financial Risk Model */}
                <div className="card">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ marginBottom: '1rem' }}><TrendingUp size={18} /> Financial Risk Prediction (XGBoost Sim)</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 700, 
                            background: riskData.riskLevel === 'Low' ? '#d1fae5' : riskData.riskLevel === 'Medium' ? '#fef3c7' : '#fee2e2',
                            color: riskData.riskLevel === 'Low' ? '#064e3b' : riskData.riskLevel === 'Medium' ? '#92400e' : '#7f1d1d'
                         }}>
                            Risk Level: {riskData.riskLevel}
                        </div>
                    </div>

                    <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Risk Factors & Reasoning:</h4>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '13px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {riskData.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid-cols-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '1.5rem' }}>
                {/* 6. Smart Budget & 8. Investments (Combined) */}
                <div className="card">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ marginBottom: '1rem' }}><PieChart size={18} /> Budget & Investment Recommendations</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px' }}>Smart Budget Allocation</h4>
                            {budgetData ? (
                                <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <li className="flex-between"><span>Needs</span> <span style={{ fontWeight: 600 }}>${budgetData.Needs}</span></li>
                                    <li className="flex-between"><span>Wants</span> <span style={{ fontWeight: 600 }}>${budgetData.Wants}</span></li>
                                    <li className="flex-between"><span>Savings</span> <span style={{ fontWeight: 600 }}>${budgetData.Savings}</span></li>
                                    <li style={{ marginTop: '6px', fontSize: '11px', color: 'var(--primary)', fontStyle: 'italic' }}>Powered by: {budgetData.Algorithm}</li>
                                </ul>
                            ) : (
                                <p className="text-muted text-sm">Add income to generate automated budget optimizations.</p>
                            )}
                        </div>

                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px' }}>Suggested Portfolio</h4>
                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {Object.entries(investmentData.portfolio).map(([asset, dist]) => (
                                    <li key={asset} className="flex-between">
                                        <span>{asset}</span> 
                                        <span style={{ fontWeight: 600 }}>{dist}</span>
                                    </li>
                                ))}
                            </ul>
                            <p style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>{investmentData.advice}</p>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
                    <Cpu size={48} style={{ color: '#818cf8', marginBottom: '1rem' }} />
                    <h3 className="text-xl font-bold mb-2">Research Contribution Ready</h3>
                    <p style={{ fontSize: '14px', maxWidth: '300px', opacity: 0.8 }}>
                        The Python training data algorithms, K-Means Clustering endpoints, and ensemble training sets are isolated locally inside `ml-research` for Jupyter/Colab replication.
                    </p>
                </div>
            </div>

        </div>
    );
}
