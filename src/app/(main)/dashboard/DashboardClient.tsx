'use client';

import { useState, useEffect } from 'react';
import DashboardChart from '@/app/components/DashboardChart';
import AiInsights from '@/app/components/AiInsights';
import StatCard from '@/app/components/StatCard';
import TransactionList from '@/app/components/TransactionList';
import Modal from '@/app/components/Modal';
import ExpenseBreakdownChart from '@/app/components/ExpenseBreakdownChart';
import CashFlowForecast from '@/app/components/CashFlowForecast';
import BudgetOverview from '@/app/components/BudgetOverview';
import ExportReportButton from '@/app/components/ExportReportButton';
import SubscriptionManager from '@/app/components/SubscriptionManager';
import HealthScore from '@/app/components/HealthScore';
import Goals from '@/app/components/Goals';
import ReceiptScanner from '@/app/components/ReceiptScanner';
import VoiceExpenseEntry from '@/app/components/VoiceExpenseEntry';
import FinancialCalendar from '@/app/components/FinancialCalendar';
import CurrencySwitcher from '@/app/components/CurrencySwitcher';
import ExpenseSplitter from '@/app/components/ExpenseSplitter';
import LocationExpenseTracker from '@/app/components/LocationExpenseTracker';
import EmergencyFundTracker from '@/app/components/EmergencyFundTracker';
import AutoSavingsSuggestion from '@/app/components/AutoSavingsSuggestion';
import SmartSpendingLimits from '@/app/components/SmartSpendingLimits';
import LifestyleAnalysis from '@/app/components/LifestyleAnalysis';
import MilestoneTracker from '@/app/components/MilestoneTracker';
import AdvancedSecurityDashboard from '@/app/components/AdvancedSecurityDashboard';
import AITransactionCategorizer from '@/app/components/AITransactionCategorizer';
import AIFraudDetection from '@/app/components/AIFraudDetection';
import AIInvestmentSuggestions from '@/app/components/AIInvestmentSuggestions';
import AITaxAdvisor from '@/app/components/AITaxAdvisor';
import AIRiskDetection from '@/app/components/AIRiskDetection';
import AIBudgetRecommender from '@/app/components/AIBudgetRecommender';
import {
    DollarSign,
    Receipt,
    Wallet,
    PiggyBank,
    Users,
    Paperclip,
    Mic,
    MapPin
} from 'lucide-react';
import { addTransaction } from '@/app/actions/transaction';
import { getLatestTaxEstimate, autoEstimateQuarterlyTax } from '@/app/actions/tax';
import { autoArchiveMonthReport } from '@/app/actions/report';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';
import FinancialCalculators from '@/app/components/FinancialCalculators';
import FloatingCalculator from '@/app/components/FloatingCalculator';
import { useToast } from '@/app/components/ToastProvider';
import ProAnalytics from '@/app/components/ProAnalytics';
import AIHabitCorrection from '@/app/components/AIHabitCorrection';
import BottomNav from '@/app/components/BottomNav';
import FloatingActionButton from '@/app/components/FloatingActionButton';
import InsightFeed from '@/app/components/InsightFeed';
import { LayoutGrid, Zap, Sparkles, TrendingUp, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkTaxAutofill();
    }, [allTransactions]);

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

    useEffect(() => {
        const runAutomations = async () => {
            await checkTaxAutofill();
            const today = new Date();
            if (today.getDate() === 1) {
                const res = await autoArchiveMonthReport();
                if (res.archived) {
                    setAutomationLogs(prev => [...prev, `Auto-Archived: ${res.period} report saved.`]);
                }
            }
        };
        runAutomations();
    }, [allTransactions, summary]);

    const handleApplyTaxAutofill = async () => {
        if (taxSuggestion) {
            setLoading(true);
            await autoEstimateQuarterlyTax();
            setTaxSuggestion(null);
            setLoading(false);
            alert(`Tax applied for ${taxSuggestion.quarter}!`);
        }
    };

    const handleSaveIncome = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!confirm("Are you sure you want to add this income?")) return;
        setLoading(true);
        await addTransaction({ description, amount: Number(amount), type: 'income', category, date });
        setLoading(false);
        setIncomeModalOpen(false);
        showToast("Income added successfully!", "success");
        setDescription(''); setAmount('');
    };

    const handleSaveExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!confirm("Are you sure you want to save this expense?")) return;
        setLoading(true);
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
        setLoading(false);
        setExpenseModalOpen(false);
        showToast(`${expCategory} expense recorded!`, "success");
        setExpDescription(''); setExpAmount(''); setExpVoice(''); setExpAttachment(''); setExpFrom(''); setExpTo('');
    };

    const estTax = summary.income * 0.25;
    const savingsRate = summary.income > 0 ? Math.round(((summary.income - summary.expenses - estTax) / summary.income) * 100) : 0;

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
             <header style={{ 
                marginBottom: '2.5rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1.5rem',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px)',
                padding: '1.25rem',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 8px 32px -4px rgba(0,0,0,0.03)'
             }}>
                <div>
                    <h1 className="text-4xl font-black" style={{ 
                        marginBottom: '0.25rem', 
                        background: 'linear-gradient(to right, #1e293b, #4338ca)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                    }}>
                        TaxPal Prime
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                        <p className="text-muted font-semibold text-sm">Active Economic Monitoring</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button 
                        onClick={() => setIsProMode(!isProMode)} 
                        className={`btn ${isProMode ? 'btn-danger' : 'btn-secondary'}`}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            border: isProMode ? '1px solid #ef4444' : '1px solid rgba(226, 232, 240, 0.8)', 
                            padding: '10px 20px', 
                            borderRadius: '16px',
                            fontWeight: 700,
                            letterSpacing: '0.01em',
                            boxShadow: isProMode ? '0 4px 12px rgba(239, 68, 68, 0.2)' : 'none'
                        }}
                    >
                        {isProMode ? <LayoutGrid size={18} /> : <Zap size={18} />}
                        {isProMode ? 'Lite Mode' : 'Pro Engine'}
                    </button>
                    <ThemeSwitcher />
                    <CurrencySwitcher />
                    <ExportReportButton transactions={allTransactions} summary={summary} />
                </div>
            </header>

            {/* AI Insight Feed (Adaptive UI) */}
            <InsightFeed income={summary.income} expenses={summary.expenses} />

            {/* AI Habit Correction Engine (Active Monitor) */}
            <AIHabitCorrection 
                transactions={allTransactions} 
                currentBudgets={budgets} 
            />

            {/* Stats Row with Adaptive UI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard 
                    title="Total Liquidity" 
                    value={`₹${summary.income.toLocaleString()}`} 
                    icon={TrendingUp} 
                    colorTheme="primary"
                    trend={{ value: summary.income > summary.expenses ? "+12%" : "-5%", direction: summary.income > summary.expenses ? 'up' : 'down' }}
                />
                <StatCard 
                    title="Economic Outflow" 
                    value={`₹${summary.expenses.toLocaleString()}`} 
                    icon={TrendingDown} 
                    colorTheme={summary.expenses > (summary.income * 0.7) ? "danger" : "primary"}
                    trend={{ value: summary.expenses > (summary.income * 0.8) ? "Critical" : "Stable", direction: summary.expenses > (summary.income * 0.8) ? 'down' : 'neutral' }}
                />
                <StatCard 
                    title="Tax Reserve" 
                    value={`₹${estTax.toLocaleString()}`} 
                    icon={ShieldCheck} 
                    colorTheme="warning" 
                />
                <StatCard 
                    title="Saving Power" 
                    value={`${savingsRate}%`} 
                    icon={Clock} 
                    colorTheme={savingsRate > 30 ? "success" : (savingsRate < 10 ? "danger" : "primary")} 
                    trend={{ value: savingsRate > 50 ? "Elite Elite" : "Active", direction: savingsRate > 30 ? 'up' : 'neutral' }}
                />
            </div>
            
            {/* Pro Analytics Engine Toggle Section */}
            {isProMode && (
                <div style={{ marginBottom: '2.5rem' }}>
                    <ProAnalytics transactions={allTransactions} />
                </div>
            )}

            {/* Automation Alerts */}
            {(automationLogs.length > 0 || taxSuggestion) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {automationLogs.length > 0 && (
                        <div className="card" style={{ borderLeft: '4px solid #10b981', background: '#f0fdf4' }}>
                            <h4 className="font-bold text-success text-sm mb-2 flex items-center gap-2"><ShieldCheck size={14}/> Active Systems</h4>
                            <ul className="text-xs space-y-1">{automationLogs.map((l, i) => <li key={i}>• {l}</li>)}</ul>
                        </div>
                    )}
                    {taxSuggestion && (
                        <div className="card" style={{ borderLeft: '4px solid var(--primary)', background: 'var(--primary-light)' }}>
                            <h4 className="font-bold text-primary text-sm mb-1">Tax Autofill Ready</h4>
                            <p className="text-xs mb-2">Estimated {taxSuggestion.quarter} due: ₹{taxSuggestion.amount.toLocaleString()}</p>
                            <button onClick={handleApplyTaxAutofill} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '11px' }}>Apply to Ledger</button>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <DashboardChart transactions={recentTransactions} />
                    <TransactionList transactions={recentTransactions} limit={5} title="Recent Activity" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <FinancialCalculators />
                    <BudgetOverview />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <HealthScore summary={summary} />
                    <ExpenseBreakdownChart transactions={allTransactions} />
                    <AiInsights />
                </div>
            </div>

            <Modal isOpen={isIncomeModalOpen} onClose={() => setIncomeModalOpen(false)} title="Add Income">
                <form onSubmit={handleSaveIncome} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="input" placeholder="Source Name" value={description} onChange={e => setDescription(e.target.value)} required />
                    <input className="input" type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} required />
                    <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                        <option>Freelance</option><option>Salary</option><option>Investment</option>
                    </select>
                    <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Confirm Entry'}</button>
                </form>
            </Modal>

            <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)} title="Record Expense">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <ReceiptScanner onScanComplete={(d) => { 
                            setExpDescription(d.merchant); 
                            if(d.amount) setExpAmount(d.amount.toString()); 
                            if(d.date) setExpDate(d.date.toISOString().split('T')[0]);
                        }} />
                    </div>
                    <div style={{ flex: 1 }}><VoiceExpenseEntry onVoiceParsed={d => { setExpDescription(d.description); if(d.amount) setExpAmount(d.amount.toString()); }} /></div>
                </div>
                <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="input" placeholder="Merchant/Description" value={expDescription} onChange={e => setExpDescription(e.target.value)} required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input className="input" type="number" placeholder="Amount (₹)" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
                        <select className="input" value={expCategory} onChange={e => setExpCategory(e.target.value)}>
                            <option>Food</option><option>Transport</option><option>Business</option><option>Software</option><option>Taxes</option><option>Travel</option><option>Others</option>
                        </select>
                    </div>

                    {(expCategory === 'Travel' || expCategory === 'Transport') && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={14} style={{ position: 'absolute', right: '12px', top: '14px', color: '#10b981' }} />
                                <input className="input" placeholder="Starting point (Address)" value={expFrom} onChange={e => setExpFrom(e.target.value)} required />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={14} style={{ position: 'absolute', right: '12px', top: '14px', color: '#ef4444' }} />
                                <input className="input" placeholder="Drop point (City/Loc)" value={expTo} onChange={e => setExpTo(e.target.value)} required />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mic size={14} style={{ position: 'absolute', right: '12px', top: '14px', color: '#94a3b8' }} />
                            <input className="input" placeholder="Voice Memo" value={expVoice} onChange={e => setExpVoice(e.target.value)} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Paperclip size={14} style={{ position: 'absolute', right: '12px', top: '14px', color: '#94a3b8' }} />
                            <input className="input" placeholder="Attachment Link" value={expAttachment} onChange={e => setExpAttachment(e.target.value)} />
                        </div>
                    </div>
                    <input className="input" type="date" value={expDate} onChange={e => setExpDate(e.target.value)} />
                    <button type="submit" className="btn btn-danger" disabled={loading}>{loading ? 'Logging Expense...' : 'Confirm Save Record'}</button>
                </form>
            </Modal>

            <div style={{ height: '100px' }} />

            <FloatingActionButton 
                onAddExpense={() => setExpenseModalOpen(true)} 
                onAddIncome={() => setIncomeModalOpen(true)} 
                onScanReceipt={() => setExpenseModalOpen(true)} 
            />
            
            <BottomNav />
            <FloatingCalculator />
        </div>
    );
}
