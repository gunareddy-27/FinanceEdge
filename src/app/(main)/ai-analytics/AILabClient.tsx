'use client';

import { useState, useTransition, useRef } from 'react';
import { 
    BrainCircuit, LineChart, AlertTriangle, ShieldCheck, PieChart, 
    TrendingUp, Cpu, Settings, Play, CheckCircle, Info, Sparkles, 
    ArrowRight, Smartphone, Target, ShieldAlert, Zap, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    getAutonomousBudgetOptimization, 
    simulateScenario, 
    getMultiGoalOptimization, 
    getFinancialRiskInsight 
} from '@/app/actions/ai-engine';
import AnalysisExportButton from '@/app/components/AnalysisExportButton';

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

// Motion variants for stagger
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
} as const;

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
} as const;

import ResearchSection from './ResearchSection';
import { useEffect } from 'react';

// ... (existing helper functions if any, but AILabClient already imports what it needs)

export default function AILabClient({ behaviorData, predictionData, anomaliesData, budgetData, investmentData, riskData }: AILabClientProps) {
    const [isAutopilot, setIsAutopilot] = useState(false);
    const [simulationExpense, setSimulationExpense] = useState(80000); 
    const [simResult, setSimResult] = useState<any>(null);
    const [isSimulating, startSimulating] = useTransition();
    const [isOptimizing, startOptimizing] = useTransition();
    const [optimizationResult, setOptimizationResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'insights' | 'optimizer' | 'goals' | 'research'>('insights');
    const [mlMetrics, setMlMetrics] = useState<any>(null);

    // Fetch live metrics on load
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch('/api/ml-metrics');
                const data = await res.json();
                setMlMetrics(data);
            } catch (e) {
                console.error("Failed to load metrics", e);
            }
        };
        fetchMetrics();
    }, []);

    // Refs for PDF inclusion
    const forecastCardRef = useRef<HTMLDivElement>(null);
    const behaviorCardRef = useRef<HTMLDivElement>(null);
    const riskCardRef = useRef<HTMLDivElement>(null);

    const handleSimulation = () => {
        startSimulating(async () => {
            const result = await simulateScenario(simulationExpense, 'Electronics');
            setSimResult(result);
        });
    };

    const handleOptimization = () => {
        startOptimizing(async () => {
            const result = await getAutonomousBudgetOptimization();
            setOptimizationResult(result);
        });
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={container}
            className="ai-lab-wrapper"
        >
            <motion.header variants={item} className="flex-between" style={{ marginBottom: '2.5rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                            <Cpu size={40} className="text-primary" />
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ position: 'absolute', inset: -4, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(10px)', zIndex: -1 }}
                            />
                        </div>
                        AI Decision Engine
                    </h1>
                    <p className="text-muted mt-2">Autonomous financial intelligence that simulates, optimizes, and protects.</p>
                </div>
                
                {/* 4. Financial Autopilot Toggle */}
                <div className="flex items-center gap-4" style={{ background: isAutopilot ? 'var(--primary-light)' : '#f1f5f9', padding: '10px 20px', borderRadius: '30px', transition: '0.3s' }}>
                    <div className="flex items-center gap-2">
                        <Settings size={18} className={isAutopilot ? 'text-primary animate-spin' : 'text-muted'} style={{ animationDuration: '3s' }} />
                        <span style={{ fontWeight: 600, fontSize: '14px', color: isAutopilot ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                            AUTOPILOT: {isAutopilot ? 'ACTIVE' : 'OFF'}
                        </span>
                    </div>
                    <button 
                        onClick={() => setIsAutopilot(!isAutopilot)}
                        style={{ 
                            width: '48px', height: '26px', background: isAutopilot ? 'var(--primary)' : '#cbd5e1', 
                            borderRadius: '13px', position: 'relative', border: 'none', cursor: 'pointer' 
                        }}
                    >
                        <motion.div 
                            animate={{ x: isAutopilot ? 22 : 2 }}
                            style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', top: 2 }}
                        />
                    </button>
                    
                    <div style={{ width: '1px', height: '32px', background: 'var(--border)', margin: '0 8px' }} />
                    
                    <AnalysisExportButton 
                        behaviorData={behaviorData}
                        predictionData={predictionData}
                        anomaliesData={anomaliesData}
                        budgetData={budgetData}
                        riskData={riskData}
                        optimizationResult={optimizationResult}
                        chartContainerRefs={[forecastCardRef, behaviorCardRef, riskCardRef]}
                    />
                </div>
            </motion.header>

            {/* Premium Tab Navigation */}
            <motion.div variants={item} className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <button 
                    onClick={() => setActiveTab('insights')}
                    className={`btn ${activeTab === 'insights' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: '20px' }}
                >
                    <Layers size={18} /> Lab Insights
                </button>
                <button 
                    onClick={() => setActiveTab('optimizer')}
                    className={`btn ${activeTab === 'optimizer' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: '20px' }}
                >
                    <Zap size={18} /> Budget Optimizer
                </button>
                <button 
                    onClick={() => setActiveTab('goals')}
                    className={`btn ${activeTab === 'goals' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: '20px' }}
                >
                    <Target size={18} /> Goal Simulation
                </button>
                <button 
                    onClick={() => setActiveTab('research')}
                    className={`btn ${activeTab === 'research' ? 'bg-indigo-600 text-white' : 'btn-secondary'}`}
                    style={{ borderRadius: '20px' }}
                >
                    <GraduationCap size={18} /> Research & Ethics
                </button>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'insights' && (
                    <motion.div 
                        key="insights"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}
                    >
                        {/* 5. Decision Confidence & Explainability Layer */}
                        <div ref={forecastCardRef} className="card" style={{ borderLeft: '4px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                            <div className="flex-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2"><LineChart size={20} /> Expense Forecast (LSTM-Prophet)</h3>
                                <div style={{ background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                                    CONFIDENCE: {predictionData.confidence}
                                </div>
                            </div>
                            
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <div className="text-muted text-xs uppercase font-bold tracking-wider mb-1">Expected Next Month</div>
                                    <motion.div 
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}
                                    >
                                        ${predictionData.prediction.toLocaleString()}
                                    </motion.div>
                                </div>
                                <div className="text-right">
                                    <Sparkles size={24} className="text-primary mb-2 ml-auto" />
                                    <div className="text-xs text-muted">Adaptive Learning active</div>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                                    <Info size={14} className="text-primary" /> Explainable AI Insight:
                                </div>
                                <p className="text-sm text-muted leading-relaxed">
                                    Forecast adjusted by <span className="text-primary font-bold">12%</span> due to recurring weekend spikes. Reasoning: Systematic variance detected in "Dining" category over the last 3 business cycles.
                                </p>
                            </div>
                        </div>

                        {/* 8. AI Risk Intervention System */}
                        <div ref={riskCardRef} className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                            <div className="flex-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2"><ShieldAlert size={20} className="text-danger" /> Real-time Risk Intervention</h3>
                                <PulseCircle color="#ef4444" />
                            </div>

                            {anomaliesData.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {anomaliesData.slice(0, 2).map(a => (
                                        <div key={a.id} className="p-4" style={{ background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                                            <div className="flex-between mb-1">
                                                <span className="font-bold text-danger">{a.description}</span>
                                                <span className="font-bold text-danger">${Number(a.amount).toFixed(0)}</span>
                                            </div>
                                            <p className="text-xs text-muted">AI Action: Tagged for review. This spending deviates from your "Saver" profile by 4x.</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <ShieldCheck size={48} className="text-success mx-auto mb-3" />
                                    <p className="font-bold text-success">Financial Shield Active</p>
                                    <p className="text-sm text-muted">No high-risk behaviors detected in current session.</p>
                                </div>
                            )}
                        </div>

                        <div ref={behaviorCardRef} className="card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
                             <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white"><BrainCircuit size={20} className="text-primary" /> Adaptive Learning Profile</h3>
                                    <div style={{ padding: '8px 16px', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', display: 'inline-block', marginBottom: '1rem' }}>
                                        Cluster: <span className="text-primary font-extrabold">{behaviorData.profile}</span>
                                    </div>
                                    <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6' }}>{behaviorData.insights}</p>
                                </div>
                                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5, marginBottom: '1rem' }}>Internal Metrics</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div className="flex-between">
                                            <span style={{ fontSize: '14px' }}>Efficiency</span>
                                            <span className="font-bold text-success">92%</span>
                                        </div>
                                        <div className="flex-between">
                                            <span style={{ fontSize: '14px' }}>Safety Score</span>
                                            <span className="font-bold" style={{ color: '#fbbf24' }}>78%</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                     <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                     >
                                        <Smartphone size={32} />
                                     </motion.div>
                                     <span className="mt-2 text-xs opacity-50">App Experience</span>
                                </div>
                             </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'optimizer' && (
                    <motion.div 
                        key="optimizer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        {/* 1. Autonomous Budget Optimizer */}
                        <div className="card" style={{ border: '2px solid var(--primary-light)' }}>
                            <div className="flex-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold">Autonomous Budget Rebalancing</h3>
                                    <p className="text-muted">AI continuously optimizes your limits based on real utility.</p>
                                </div>
                                <button 
                                    onClick={handleOptimization}
                                    disabled={isOptimizing}
                                    className="btn btn-primary"
                                    style={{ borderRadius: '12px', padding: '12px 24px' }}
                                >
                                    {isOptimizing ? 'AI Reasoning...' : 'Trigger Rebalance'} <ArrowRight size={18} />
                                </button>
                            </div>

                            {optimizationResult ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <h4 className="font-bold flex items-center gap-2"><Settings size={16} /> Proposed Adjustments:</h4>
                                        {optimizationResult.actions.map((act: any, i: number) => (
                                            <div key={i} className="p-4 rounded-xl border border-slate-100 flex items-start gap-4 bg-slate-50">
                                                <div style={{ background: act.change < 0 ? '#fee2e2' : '#d1fae5', color: act.change < 0 ? '#ef4444' : '#10b981', padding: '10px', borderRadius: '10px' }}>
                                                    {act.change < 0 ? '↓' : '↑'}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{act.category} {act.change < 0 ? 'Decrease' : 'Increase'} by ₹{Math.abs(act.change)}</div>
                                                    <div className="text-xs text-muted mt-1">{act.reason}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="card" style={{ background: 'var(--primary-dark)', color: 'white', border: 'none' }}>
                                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Info size={18} /> Optimization Logic (Why?)</h4>
                                        <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: '1.6', marginBottom: '1.5rem' }}>{optimizationResult.explanation}</p>
                                        <div className="flex-between" style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px' }}>
                                            <span>System Confidence</span>
                                            <span className="font-extrabold text-success">{(optimizationResult.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                                    <Zap size={48} className="mx-auto mb-4" />
                                    <p>Run the optimizer to see AI-rebalanced budget categories.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'goals' && (
                    <motion.div 
                        key="goals"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}
                    >
                        {/* 2. Scenario Simulation Engine (What-If) */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Smartphone size={20} className="text-primary" /> Scenario Simulator (What-If)</h3>
                            <p className="text-sm text-muted mb-6">Test the impact of major purchases on your recovery time.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, opacity: 0.6, marginBottom: '0.5rem', display: 'block' }}>Purchase Amount (₹)</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input 
                                            type="range" 
                                            style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
                                            min="5000" 
                                            max="200000" 
                                            step="5000"
                                            value={simulationExpense}
                                            onChange={(e) => setSimulationExpense(Number(e.target.value))}
                                        />
                                        <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '100px' }}>₹{simulationExpense.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSimulation}
                                    disabled={isSimulating}
                                    className="btn btn-primary w-full"
                                    style={{ padding: '1rem', gap: '1rem', width: '100%' }}
                                >
                                    {isSimulating ? 'Processing Matrix...' : 'Run Simulation'} <Play size={18} />
                                </button>
                            </div>

                            {simResult && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '1rem', background: simResult.outcome === 'Safe' ? '#f0fdf4' : '#fff7ed', border: `1px solid ${simResult.outcome === 'Safe' ? '#bbf7d0' : '#ffedd5'}` }}>
                                    <div className="flex-between mb-4">
                                        <div style={{ fontWeight: 900, fontSize: '1.2rem', color: simResult.outcome === 'Safe' ? '#166534' : '#9a3412' }}>
                                            IMPACT: {simResult.outcome.toUpperCase()}
                                        </div>
                                        <div style={{ opacity: 0.5, fontSize: '11px' }}>AI Confidence: {simResult.confidence * 100}%</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '9px', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase' }}>Recovery Time</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{simResult.recoveryTimeMonths} Months</div>
                                        </div>
                                        <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '9px', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase' }}>Safe Level</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>₹{simResult.savingsAfter.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: '1.6', color: simResult.outcome === 'Safe' ? '#15803d' : '#c2410c' }}>
                                        {simResult.advice}
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* 3. Multi-Goal Optimization Engine */}
                        <div className="card">
                             <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Target size={20} className="text-primary" /> Multi-Goal Optimization</h3>
                             <p className="text-sm text-muted mb-8">AI balances allocations between your competing financial targets.</p>
                             
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <GoalProgress name="Emergency Fund" current={80000} target={200000} allocation={8000} />
                                <GoalProgress name="Apple Laptop" current={45000} target={120000} allocation={5000} />
                                <GoalProgress name="Travel (Japan)" current={15000} target={150000} allocation={2000} />
                             </div>

                             <div style={{ marginTop: '3rem', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed var(--primary)', background: 'var(--primary-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                    <Sparkles size={20} className="text-primary" />
                                    <div>
                                        <div style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>AI Optimization Active</div>
                                        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>₹15,000 monthly savings distributed by priority weights. "Emergency Fund" given 53% priority for risk mitigation.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </motion.div>
                )}
                {activeTab === 'research' && (
                    <motion.div 
                        key="research"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                        <ResearchSection metrics={mlMetrics} />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .ai-lab-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                }
            `}</style>
        </motion.div>
    );
}

function PulseCircle({ color }: { color: string }) {
    return (
        <div style={{ position: 'relative', width: '12px', height: '12px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
            <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }}
            />
        </div>
    );
}

function GoalProgress({ name, current, target, allocation }: { name: string, current: number, target: number, allocation: number }) {
    const progress = (current / target) * 100;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="flex-between">
                <span style={{ fontWeight: 800 }}>{name}</span>
                <span style={{ fontSize: '11px', opacity: 0.6 }}>₹{current.toLocaleString()} / ₹{target.toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: '100%', background: 'var(--primary)' }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                <Sparkles size={12} /> AI Allocation: +₹{allocation.toLocaleString()}/mo
            </div>
        </div>
    );
}
