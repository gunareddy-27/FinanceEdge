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
    ShieldCheck,
    Users,
    Paperclip,
    Mic
} from 'lucide-react';
import { addTransaction } from '@/app/actions/transaction';
import { getLatestTaxEstimate, autoEstimateQuarterlyTax } from '@/app/actions/tax';
import { autoArchiveMonthReport } from '@/app/actions/report';
import { applySelfHealingBudget } from '@/app/actions/budget';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';
import FinancialCalculators from '@/app/components/FinancialCalculators';
import FloatingCalculator from '@/app/components/FloatingCalculator';

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
}

export default function DashboardClient({ summary, recentTransactions, allTransactions }: DashboardClientProps) {
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
            if (summary.expenses > summary.income * 0.9 && summary.income > 0) {
                const heal = await applySelfHealingBudget();
                if (heal.applied) {
                    setAutomationLogs(prev => [...prev, `Self-healing: Capped ${heal.category} budget.`]);
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
        setLoading(true);
        await addTransaction({ description, amount: Number(amount), type: 'income', category, date });
        setLoading(false);
        setIncomeModalOpen(false);
        setDescription(''); setAmount('');
    };

    const handleSaveExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await addTransaction({
            description: expDescription,
            amount: Number(expAmount),
            type: 'expense',
            category: expCategory,
            date: expDate,
            voiceNotes: expVoice,
            attachmentUrl: expAttachment
        });
        setLoading(false);
        setExpenseModalOpen(false);
        setExpDescription(''); setExpAmount(''); setExpVoice(''); setExpAttachment('');
    };

    const estTax = summary.income * 0.25;
    const savingsRate = summary.income > 0 ? Math.round(((summary.income - summary.expenses - estTax) / summary.income) * 100) : 0;

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h1 className="text-3xl font-extrabold" style={{ marginBottom: '0.25rem' }}>TaxPal Dashboard</h1>
                    <p className="text-muted">High-precision financial automation actively running.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <ThemeSwitcher />
                    <CurrencySwitcher />
                    <ExportReportButton transactions={allTransactions} summary={summary} />
                    <button onClick={() => setExpenseModalOpen(true)} className="btn btn-secondary shadow-sm">Record Expense</button>
                    <button onClick={() => setIncomeModalOpen(true)} className="btn btn-primary shadow-md">Add Income</button>
                </div>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <StatCard title="Total Earnings" value={`₹${summary.income.toLocaleString()}`} icon={DollarSign} colorTheme="primary" />
                <StatCard title="Total Spent" value={`₹${summary.expenses.toLocaleString()}`} icon={Receipt} colorTheme="danger" />
                <StatCard title="Estimated Tax" value={`₹${estTax.toLocaleString()}`} icon={Wallet} colorTheme="warning" />
                <StatCard title="Savings Power" value={`${savingsRate}%`} icon={PiggyBank} colorTheme="success" />
                
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)' }}><Users size={20}/></div>
                    <div>
                        <p className="text-xs text-muted font-bold uppercase tracking-wider">Joint Wallet</p>
                        <p className="font-bold text-success text-sm">Private Connection</p>
                    </div>
                </div>
            </div>

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

            {/* Main Interactive Grid */}
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

            <FloatingCalculator />

            {/* Modals */}
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
                    <div style={{ flex: 1 }}><ReceiptScanner onScanComplete={async (d) => { /* logic here */ }} /></div>
                    <div style={{ flex: 1 }}><VoiceExpenseEntry onVoiceParsed={d => { setExpDescription(d.description); if(d.amount) setExpAmount(d.amount.toString()); }} /></div>
                </div>
                <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="input" placeholder="Merchant/Description" value={expDescription} onChange={e => setExpDescription(e.target.value)} required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input className="input" type="number" placeholder="Amount (₹)" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
                        <select className="input" value={expCategory} onChange={e => setExpCategory(e.target.value)}>
                            <option>Food</option><option>Transport</option><option>Business</option><option>Software</option><option>Taxes</option>
                        </select>
                    </div>
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
                    <button type="submit" className="btn btn-danger" disabled={loading}>{loading ? 'Logging Expense...' : 'Save Record'}</button>
                </form>
            </Modal>
        </div>
    );
}
