'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DollarSign, Receipt, Wallet, PiggyBank, Users, Paperclip, Mic, 
    MapPin, LayoutGrid, Zap, Sparkles, TrendingUp, TrendingDown, 
    Clock, ShieldCheck, ChevronRight, Activity, ArrowUpRight
} from 'lucide-react';

import DashboardChart from '@/app/components/DashboardChart';
import AiInsights from '@/app/components/AiInsights';
import StatCard from '@/app/components/StatCard';
import TransactionList from '@/app/components/TransactionList';
import Modal from '@/app/components/Modal';
import ExpenseBreakdownChart from '@/app/components/ExpenseBreakdownChart';
import BudgetOverview from '@/app/components/BudgetOverview';
import ExportReportButton from '@/app/components/ExportReportButton';
import HealthScore from '@/app/components/HealthScore';
import ReceiptScanner from '@/app/components/ReceiptScanner';
import VoiceExpenseEntry from '@/app/components/VoiceExpenseEntry';
import CurrencySwitcher from '@/app/components/CurrencySwitcher';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';
import FloatingCalculator from '@/app/components/FloatingCalculator';
import ProAnalytics from '@/app/components/ProAnalytics';
import AIHabitCorrection from '@/app/components/AIHabitCorrection';
import FloatingActionButton from '@/app/components/FloatingActionButton';
import InsightFeed from '@/app/components/InsightFeed';
import FinancialCalculators from '@/app/components/FinancialCalculators';
import { CardSkeleton } from '@/app/components/Skeleton';
import AnalysisExportButton from '@/app/components/AnalysisExportButton';

import { addTransaction } from '@/app/actions/transaction';
import { getLatestTaxEstimate, autoEstimateQuarterlyTax } from '@/app/actions/tax';
import { autoArchiveMonthReport } from '@/app/actions/report';
import { useToast } from '@/app/components/ToastProvider';

// Motion Configs - Fixed with as const
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
} as const;

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
} as const;

interface Transaction {
    id: number;
    description: string | null;
    amount: number;
    date: Date;
    type: string;
    category?: string | null;
}

interface DashboardClientProps {
    summary: { income: number; expenses: number };
    recentTransactions: Transaction[];
    allTransactions: Transaction[];
    budgets: any[];
}

export default function DashboardClient({ summary, recentTransactions, allTransactions, budgets }: DashboardClientProps) {
    const { showToast } = useToast();
    const [isProMode, setIsProMode] = useState(false);
    const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pulseTime, setPulseTime] = useState<string>('');

    // Chart Refs for PDF export
    const barChartRef = useRef<HTMLDivElement>(null);
    const pieChartRef = useRef<HTMLDivElement>(null);

    // Hydration check
    useEffect(() => {
        setPulseTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const timer = setTimeout(() => setInitialLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Form States
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Freelance');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    // Expense Form States
    const [expDescription, setExpDescription] = useState('');
    const [expAmount, setExpAmount] = useState('');
    const [expCategory, setExpCategory] = useState('Business');
    const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));
    const [expVoice, setExpVoice] = useState('');
    const [expAttachment, setExpAttachment] = useState('');
    const [expFrom, setExpFrom] = useState('');
    const [expTo, setExpTo] = useState('');

    // Automation States
    const [taxSuggestion, setTaxSuggestion] = useState<{ quarter: string; amount: number } | null>(null);
    const [automationLogs, setAutomationLogs] = useState<string[]>([]);

    useEffect(() => {
        const checkTaxAutofill = async () => {
            const latest = await getLatestTaxEstimate();
            const currentMonth = new Date().getMonth();
            const currentQuarter = currentMonth < 3 ? 'Q1' : currentMonth < 6 ? 'Q2' : currentMonth < 9 ? 'Q3' : 'Q4';
            
            if (!latest || (latest.quarter !== currentQuarter && Number(latest.year) === new Date().getFullYear())) {
                const totalIncome = allTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                
                if (totalIncome > 0) {
                    setTaxSuggestion({ quarter: currentQuarter, amount: totalIncome * 0.125 });
                }
            }
        };
        checkTaxAutofill();
    }, [allTransactions]);

    useEffect(() => {
        const runAutomations = async () => {
            const today = new Date();
            if (today.getDate() === 1) {
                const res = await autoArchiveMonthReport();
                if (res.archived) {
                    setAutomationLogs(prev => [...prev, `Auto-Archived: ${res.period} report saved.`]);
                }
            }
        };
        runAutomations();
    }, [summary]);

    const handleApplyTaxAutofill = async () => {
        if (taxSuggestion) {
            setIsSaving(true);
            await autoEstimateQuarterlyTax();
            setTaxSuggestion(null);
            setIsSaving(false);
            showToast(`Tax applied for ${taxSuggestion.quarter}!`, "success");
        }
    };

    const handleSaveIncome = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await addTransaction({ description, amount: Number(amount), type: 'income', category, date });
        setIsSaving(false);
        setIncomeModalOpen(false);
        showToast("Income added successfully!", "success");
        setDescription(''); setAmount('');
    };

    const handleSaveExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await addTransaction({
                description: expDescription,
                amount: Number(expAmount),
                type: 'expense',
                category: expCategory,
                date: expDate,
                voiceNotes: expVoice,
                attachmentUrl: expAttachment,
                fromDest: expFrom,
                toDest: expTo
            });
            showToast(`${expCategory} expense recorded!`, "success");
            setExpDescription(''); setExpAmount(''); setExpVoice(''); setExpAttachment(''); setExpFrom(''); setExpTo('');
            setExpenseModalOpen(false);
        } catch (err) {
            showToast("Failed to record expense", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const estTax = summary.income * 0.25;
    const savingsRate = summary.income > 0 ? Math.round(((summary.income - summary.expenses - estTax) / summary.income) * 100) : 0;

    if (initialLoading) {
        return (
            <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}><CardSkeleton /></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <CardSkeleton /><CardSkeleton />
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={container}
            style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}
        >
            <motion.header variants={item} style={{ 
                marginBottom: '3rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '2rem',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(24px)',
                padding: '1.5rem 2rem',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '0 20px 50px -12px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: '1rem',
                zIndex: 40
             }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '12px', color: 'white' }}>
                            <Activity size={20} />
                        </div>
                        <h1 className="text-3xl font-black" style={{ 
                            background: 'linear-gradient(to right, #0f172a, #4338ca)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.03em'
                        }}>
                            TaxPal Intelligence
                        </h1>
                    </div>
                    <p className="text-muted font-medium text-sm flex items-center gap-2">
                        <motion.span 
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}
                        />
                        Financial Autopilot Active • Pulse Update: {pulseTime || '--:--'}
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsProMode(!isProMode)} 
                        className={`btn ${isProMode ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ 
                            gap: '10px', 
                            padding: '12px 24px', 
                            borderRadius: '18px',
                            fontWeight: 800,
                            boxShadow: isProMode ? '0 10px 20px -5px rgba(239, 68, 68, 0.3)' : 'var(--shadow-sm)'
                        }}
                    >
                        {isProMode ? <LayoutGrid size={18} /> : <Zap size={18} />}
                        {isProMode ? 'STANDARD' : 'ACTIVATE PRO'}
                    </motion.button>
                    <div style={{ width: '1px', height: '32px', background: 'var(--border)' }} />
                    <ThemeSwitcher />
                    <CurrencySwitcher />
                    <AnalysisExportButton 
                        behaviorData={{ 
                            profile: 'Calculated from Summary', 
                            insights: 'Dashboard insights active.',
                            weekendSpending: Math.round(summary.expenses * 0.4),
                            weekdaySpending: Math.round(summary.expenses * 0.6)
                        }}
                        predictionData={{ prediction: summary.income * 0.9, confidence: 'Derived' }}
                        anomaliesData={recentTransactions.slice(0, 2)}
                        budgetData={null}
                        riskData={null}
                        chartContainerRefs={[barChartRef, pieChartRef]}
                    />
                    <ExportReportButton transactions={allTransactions} summary={summary} />
                </div>
            </motion.header>

            {/* Hero Insight Layer */}
            <motion.div variants={item} style={{ marginBottom: '3rem' }}>
                <AiInsights income={summary.income} expenses={summary.expenses} />
            </motion.div>

            <motion.div variants={item} style={{ marginBottom: '3rem' }}>
                <AIHabitCorrection transactions={allTransactions} currentBudgets={budgets} />
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
                variants={item}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}
            >
                <StatCard 
                    title="Liquid Assets" 
                    value={`₹${summary.income.toLocaleString()}`} 
                    icon={TrendingUp} 
                    colorTheme="primary"
                    trend={{ value: "+12.5%", direction: 'up', label: 'vs last week' }}
                />
                <StatCard 
                    title="Burn Rate" 
                    value={`₹${summary.expenses.toLocaleString()}`} 
                    icon={TrendingDown} 
                    colorTheme={summary.expenses > (summary.income * 0.7) ? "danger" : "primary"}
                    trend={{ value: 'Elevated', direction: summary.expenses > (summary.income * 0.8) ? 'down' : 'neutral' }}
                />
                <StatCard 
                    title="Liability Hold" 
                    value={`₹${estTax.toLocaleString()}`} 
                    icon={ShieldCheck} 
                    colorTheme="warning" 
                    subtext="Next filing in 22 days"
                />
                <StatCard 
                    title="Wealth Velocity" 
                    value={`${savingsRate}%`} 
                    icon={Zap} 
                    colorTheme={savingsRate > 30 ? "success" : "primary"} 
                    trend={{ value: 'Active', direction: 'up' }}
                />
            </motion.div>
            
            <AnimatePresence>
                {isProMode && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ marginBottom: '3rem', overflow: 'hidden' }}
                    >
                        <ProAnalytics transactions={allTransactions} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Automation Feed */}
            {(automationLogs.length > 0 || taxSuggestion) && (
                <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {automationLogs.length > 0 && (
                        <div className="card" style={{ borderLeft: '6px solid #10b981', background: '#f0fdf4', borderRadius: '20px' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div style={{ background: '#10b981', color: 'white', padding: '6px', borderRadius: '8px' }}><ShieldCheck size={16}/></div>
                                <h4 className="font-bold text-success text-sm uppercase tracking-wider">System Operations</h4>
                            </div>
                            <ul className="space-y-3">
                                {automationLogs.map((l, i) => (
                                    <li key={i} className="text-xs font-semibold flex items-center gap-2 text-slate-600">
                                        <ChevronRight size={12} className="text-success" /> {l}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {taxSuggestion && (
                        <div className="card" style={{ borderLeft: '6px solid var(--primary)', background: 'var(--primary-light)', borderRadius: '20px' }}>
                            <div className="flex items-center gap-3 mb-2">
                                <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px' }}><Zap size={16}/></div>
                                <h4 className="font-bold text-primary text-sm uppercase tracking-wider">Smart Tax Sync</h4>
                            </div>
                            <p className="text-sm font-bold mb-4">Estimated {taxSuggestion.quarter} liability: ₹{taxSuggestion.amount.toLocaleString()}</p>
                            <button 
                                onClick={handleApplyTaxAutofill} 
                                className="btn btn-primary" 
                                style={{ padding: '10px 20px', fontSize: '12px', width: '100%', borderRadius: '12px' }}
                            >
                                Sync to Ledger <ArrowUpRight size={14} />
                            </button>
                        </div>
                    )}
                </motion.div>
            )}

            <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div ref={barChartRef}>
                        <DashboardChart transactions={recentTransactions} />
                    </div>
                    <TransactionList transactions={recentTransactions} limit={5} title="Activity Ledger" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <FinancialCalculators />
                    <BudgetOverview />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <HealthScore summary={summary} />
                    <div ref={pieChartRef}>
                        <ExpenseBreakdownChart transactions={allTransactions} />
                    </div>
                    <InsightFeed income={summary.income} expenses={summary.expenses} />
                </div>
            </motion.div>

            <Modal isOpen={isIncomeModalOpen} onClose={() => setIncomeModalOpen(false)} title="Ingest Capital">
                <form onSubmit={handleSaveIncome} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="input-group">
                        <input placeholder="Source (e.g. Stripe, Salary)" value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="number" placeholder="Value (₹)" value={amount} onChange={e => setAmount(e.target.value)} required />
                    </div>
                    <select className="input" style={{ padding: '12px' }} value={category} onChange={e => setCategory(e.target.value)}>
                        <option>Freelance</option><option>Salary</option><option>Investment</option>
                    </select>
                    <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                    <button type="submit" className="btn btn-primary" style={{ padding: '14px' }} disabled={isSaving}>{isSaving ? 'Processing...' : 'Confirm Ingestion'}</button>
                </form>
            </Modal>

            <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)} title="Log Outflow">
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <ReceiptScanner onScanComplete={(d) => { 
                            setExpDescription(d.merchant); 
                            if(d.amount) setExpAmount(d.amount.toString()); 
                            if(d.date) setExpDate(d.date.toISOString().split('T')[0]);
                        }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <VoiceExpenseEntry onVoiceParsed={d => { setExpDescription(d.description); if(d.amount) setExpAmount(d.amount.toString()); }} />
                    </div>
                </div>
                <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <input className="input" style={{ padding: '14px' }} placeholder="Merchant/Description" value={expDescription} onChange={e => setExpDescription(e.target.value)} required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <input className="input" style={{ padding: '14px' }} type="number" placeholder="Amount (₹)" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
                        <select className="input" style={{ padding: '14px' }} value={expCategory} onChange={e => setExpCategory(e.target.value)}>
                            <option>Food</option><option>Transport</option><option>Business</option><option>Software</option><option>Taxes</option><option>Travel</option><option>Others</option>
                        </select>
                    </div>

                    {(expCategory === 'Travel' || expCategory === 'Transport') && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={14} style={{ position: 'absolute', right: '12px', top: '16px', color: '#10b981' }} />
                                <input className="input" placeholder="Start" value={expFrom} onChange={e => setExpFrom(e.target.value)} required />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={14} style={{ position: 'absolute', right: '12px', top: '16px', color: '#ef4444' }} />
                                <input className="input" placeholder="End" value={expTo} onChange={e => setExpTo(e.target.value)} required />
                            </div>
                        </motion.div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mic size={14} style={{ position: 'absolute', right: '12px', top: '16px', color: '#94a3b8' }} />
                            <input className="input" placeholder="Voice Memo" value={expVoice} onChange={e => setExpVoice(e.target.value)} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Paperclip size={14} style={{ position: 'absolute', right: '12px', top: '16px', color: '#94a3b8' }} />
                            <input className="input" placeholder="Attachment" value={expAttachment} onChange={e => setExpAttachment(e.target.value)} />
                        </div>
                    </div>
                    <input className="input" type="date" value={expDate} onChange={e => setExpDate(e.target.value)} />
                    <button type="submit" className="btn btn-danger" style={{ padding: '14px', borderRadius: '14px', fontWeight: 800 }} disabled={isSaving}>{isSaving ? 'Logging...' : 'Confirm Record'}</button>
                </form>
            </Modal>

            <div style={{ height: '120px' }} />

            <FloatingActionButton 
                onAddExpense={() => setExpenseModalOpen(true)} 
                onAddIncome={() => setIncomeModalOpen(true)} 
                onScanReceipt={() => setExpenseModalOpen(true)} 
            />
            
            <FloatingCalculator />
        </motion.div>
    );
}
