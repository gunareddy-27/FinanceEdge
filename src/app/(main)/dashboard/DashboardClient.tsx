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
    ShieldCheck
} from 'lucide-react';
import { addTransaction } from '@/app/actions/transaction';
import { getLatestTaxEstimate, autoEstimateQuarterlyTax } from '@/app/actions/tax';
import { autoArchiveMonthReport } from '@/app/actions/report';
import { applySelfHealingBudget } from '@/app/actions/budget';

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

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Freelance');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    // Expense Form State
    const [expDescription, setExpDescription] = useState('');
    const [expAmount, setExpAmount] = useState('');
    const [expCategory, setExpCategory] = useState('Business');
    const [expDate, setExpDate] = useState(new Date().toISOString().slice(0, 10));

    // Automation: Tax Autofill
    const [taxSuggestion, setTaxSuggestion] = useState<{ quarter: string; amount: number } | null>(null);
    const [automationLogs, setAutomationLogs] = useState<string[]>([]);

    const checkTaxAutofill = async () => {
        const latest = await getLatestTaxEstimate();
        const currentMonth = new Date().getMonth();
        const currentQuarter = currentMonth < 3 ? 'Q1' : currentMonth < 6 ? 'Q2' : currentMonth < 9 ? 'Q3' : 'Q4';
        
        if (!latest || (latest.quarter !== currentQuarter && Number(latest.year) === new Date().getFullYear())) {
            // Suggest an autofill
            const totalIncome = allTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);
            
            if (totalIncome > 0) {
                setTaxSuggestion({ quarter: currentQuarter, amount: totalIncome * 0.125 });
            }
        }
    };

    useEffect(() => {
        const runAutomations = async () => {
            // 1. Check Tax Autofill
            await checkTaxAutofill();

            // 2. End-of-Month Archiving (Run if it's the 1st of the month)
            const today = new Date();
            if (today.getDate() === 1) {
                const res = await autoArchiveMonthReport();
                if (res.archived) {
                    setAutomationLogs(prev => [...prev, `Auto-Archived: ${res.period} financial report saved to vault.`]);
                }
            }

            // 3. Health Self-Healing (Check if expenses > 90% of income)
            if (summary.expenses > summary.income * 0.9 && summary.income > 0) {
                const heal = await applySelfHealingBudget();
                if (heal.applied) {
                    setAutomationLogs(prev => [...prev, `Self-healing Applied: Strictly capped ${heal.category} budget at ₹${heal.newLimit} to stabilize cash flow.`]);
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
            alert(`Quarterly tax estimate autofilled for ${taxSuggestion.quarter}!`);
        }
    };

    const handleSaveIncome = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await addTransaction({
            description,
            amount: Number(amount),
            type: 'income',
            category,
            date
        });
        setLoading(false);
        setIncomeModalOpen(false);
        // Reset form
        setDescription('');
        setAmount('');
    };

    const handleSaveExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await addTransaction({
            description: expDescription,
            amount: Number(expAmount),
            type: 'expense',
            category: expCategory,
            date: expDate
        });
        setLoading(false);
        setExpenseModalOpen(false);
        setExpDescription('');
        setExpAmount('');
    };

    const estTax = summary.income * 0.25; // Simple 25% rule
    const savingsRate = summary.income > 0
        ? Math.round(((summary.income - summary.expenses - estTax) / summary.income) * 100)
        : 0;

    return (
        <div>
            <header className="dashboard-header">
                <style jsx>{`
                    .dashboard-header {
                        margin-bottom: 2rem;
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    @media (min-width: 1024px) {
                        .dashboard-header {
                            flex-direction: row;
                            justify-content: space-between;
                            align-items: center;
                        }
                    }
                    .header-actions {
                        display: flex;
                        gap: 1rem;
                        flex-wrap: wrap;
                        align-items: center;
                    }
                    @media (max-width: 767px) {
                        .header-actions {
                            width: 100%;
                        }
                        .header-actions > * {
                            flex: 1;
                            min-width: 140px;
                        }
                    }
                `}</style>
                <div>
                    <h1 className="text-3xl">Financial Dashboard</h1>
                    <p className="text-muted">Welcome back! Here's your financial summary.</p>
                </div>
                <div className="header-actions">
                    <CurrencySwitcher />
                    <ExportReportButton transactions={allTransactions} summary={summary} />
                    <button onClick={() => setExpenseModalOpen(true)} className="btn btn-secondary">Record Expense</button>
                    <button onClick={() => setIncomeModalOpen(true)} className="btn btn-primary">Record Income</button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid-cols-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2rem' }}>
                <StatCard
                    title="Monthly Income"
                    value={`$${summary.income.toLocaleString()}`}
                    icon={DollarSign}
                    colorTheme="primary"
                    trend={{ value: '12%', direction: 'up', label: 'vs last month' }}
                />

                <StatCard
                    title="Monthly Expenses"
                    value={`$${summary.expenses.toLocaleString()}`}
                    icon={Receipt}
                    colorTheme="danger"
                    trend={{ value: '8%', direction: 'down', label: 'vs last month' }}
                />

                {automationLogs.length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <h4 className="flex items-center gap-2 text-success font-bold text-sm mb-2">
                            <ShieldCheck size={16} /> Background Automations Active
                        </h4>
                        <ul className="text-xs text-muted">
                            {automationLogs.map((log: string, i: number) => <li key={i}>• {log}</li>)}
                        </ul>
                    </div>
                )}

                {taxSuggestion && (
                    <div className="card animate-pulse shadow-glow" style={{ marginBottom: '1.5rem', border: '1px solid var(--primary)', background: 'var(--primary-light)' }}>
                        <div className="flex-between">
                            <div>
                                <h4 style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>Quarterly Tax Suggestion</h4>
                                <p className="text-sm" style={{ color: 'var(--primary-dark)' }}>
                                    Based on your current income, your {taxSuggestion.quarter} tax is estimated at ₹{taxSuggestion.amount.toLocaleString()}.
                                </p>
                            </div>
                            <button onClick={handleApplyTaxAutofill} className="btn btn-primary text-sm shadow-sm ring-2 ring-white">Autofill Now</button>
                        </div>
                    </div>
                )}

                <StatCard
                    title="Est. Tax Due"
                    value={`$${estTax.toLocaleString()}`}
                    icon={Wallet}
                    colorTheme="warning"
                    subtext="Based on 25% bracket"
                />

                <StatCard
                    title="Savings Rate"
                    value={`${savingsRate}%`}
                    icon={PiggyBank}
                    colorTheme="success"
                    trend={{ value: 'Healthy', direction: 'up' }}
                />
            </div>

            {/* Main Content Grid (3 Columns) */}
            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }} className="grid-charts">
                <style jsx>{`
                    .grid-charts {
                        grid-template-columns: 1fr;
                    }
                    /* Tablet: 2 Columns */
                    @media (min-width: 768px) {
                        .grid-charts {
                            grid-template-columns: 1fr 1fr;
                        }
                    }
                    /* Desktop: 3 Columns */
                    @media (min-width: 1280px) {
                        .grid-charts {
                            grid-template-columns: 1.2fr 1fr 1fr;
                        }
                    }
                `}</style>

                {/* Column 1: Main Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <CashFlowForecast transactions={allTransactions} />
                    <div className="card">
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="text-xl">Income vs Expenses</h3>
                        </div>
                        <div style={{ height: 300 }}>
                            <DashboardChart />
                        </div>
                    </div>
                    <SmartSpendingLimits />
                    <LifestyleAnalysis />
                    <AITransactionCategorizer />
                </div>

                {/* Column 2: Health & Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <HealthScore summary={summary} />
                    <BudgetOverview />
                    <FinancialCalendar />
                    <div className="card">
                        <h3 className="text-xl" style={{ marginBottom: '1rem' }}>Expense Breakdown</h3>
                        <ExpenseBreakdownChart transactions={recentTransactions} />
                    </div>
                    <ExpenseSplitter />
                    <LocationExpenseTracker />
                    <AIBudgetRecommender />
                    <AIFraudDetection />
                </div>

                {/* Column 3: Insights & Transactions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <SubscriptionManager />
                    <Goals />
                    <EmergencyFundTracker monthlyExpenses={summary.expenses} />
                    <MilestoneTracker />
                    <AutoSavingsSuggestion />
                    <AiInsights />
                    <AIRiskDetection />
                    <AIInvestmentSuggestions />
                    <AITaxAdvisor />
                    <TransactionList
                        transactions={recentTransactions}
                        limit={10}
                        title="Recent Activity"
                    />
                </div>
            </div>

            {/* Advanced Security & Admin Features */}
            <div style={{ marginTop: '2rem', marginBottom: '4rem' }}>
                <AdvancedSecurityDashboard />
            </div>

            {/* Record Income Modal */}
            <Modal isOpen={isIncomeModalOpen} onClose={() => setIncomeModalOpen(false)} title="Record New Income">
                <form onSubmit={handleSaveIncome}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Description</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Web Design Project"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="label">Amount</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="$ 0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Category</label>
                            <select
                                className="input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Freelance</option>
                                <option>Salary</option>
                                <option>Investment</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Date</label>
                        <input
                            type="date"
                            className="input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setIncomeModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Income'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Record Expense Modal */}
            <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)} title="Record New Expense">
                <ReceiptScanner onScanComplete={async (data) => {
                    setLoading(true);
                    // Automatic Save (Zero-Click)
                    await addTransaction({
                        description: `[AutoScan] ${data.merchant}`,
                        amount: Number(data.amount || 0),
                        type: 'expense',
                        category: 'Others', // Default category for auto-scan
                        date: (data.date || new Date()).toISOString().slice(0, 10)
                    });
                    setLoading(false);
                    setExpenseModalOpen(false);
                    alert(`Captured ₹${data.amount} at ${data.merchant}—added to Others.`);
                }} />
                <VoiceExpenseEntry onVoiceParsed={(data) => {
                    setExpDescription(data.description);
                    if (data.amount) setExpAmount(data.amount.toString());
                    if (data.category) setExpCategory(data.category);
                }} />
                
                <form onSubmit={handleSaveExpense} style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Description</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Office Supplies"
                            value={expDescription}
                            onChange={(e) => setExpDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="label">Amount</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="$ 0.00"
                                value={expAmount}
                                onChange={(e) => setExpAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Category</label>
                            <select
                                className="input"
                                value={expCategory}
                                onChange={(e) => setExpCategory(e.target.value)}
                            >
                                <option>Business</option>
                                <option>Office</option>
                                <option>Meals</option>
                                <option>Hosting</option>
                                <option>Software</option>
                                <option>Marketing</option>
                                <option>Travel</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Date</label>
                        <input
                            type="date"
                            className="input"
                            value={expDate}
                            onChange={(e) => setExpDate(e.target.value)}
                        />
                    </div>

                    <div className="flex-between" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => setExpenseModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-danger" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
