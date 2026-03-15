'use client';

import { useState } from 'react';
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

import {
    DollarSign,
    Receipt,
    Wallet,
    PiggyBank
} from 'lucide-react';
import { addTransaction } from '@/app/actions/transaction';

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
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Financial Dashboard</h1>
                    <p className="text-muted">Welcome back! Here's your financial summary.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                </div>

                {/* Column 3: Insights & Transactions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <SubscriptionManager />
                    <Goals />
                    <EmergencyFundTracker monthlyExpenses={summary.expenses} />
                    <MilestoneTracker />
                    <AutoSavingsSuggestion />
                    <AiInsights />
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
                <ReceiptScanner onScanComplete={(data) => {
                    setExpDescription(data.merchant);
                    if (data.amount) setExpAmount(data.amount.toString());
                    if (data.date) setExpDate(data.date.toISOString().slice(0, 10));
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
