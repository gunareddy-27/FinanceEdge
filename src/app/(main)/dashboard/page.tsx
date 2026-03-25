import { getFinancialSummary, getTransactions, getAllTransactions } from '@/app/actions/transaction';
import { getBudgetsForMonth } from '@/app/actions/budget';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const summary = await getFinancialSummary();
    const recentTransactions = await getTransactions(); // recent 10
    const allTransactions = await getAllTransactions(); // for forecast

    const budgets = await getBudgetsForMonth(new Date().toISOString().slice(0, 7));

    return (
        <DashboardClient
            summary={summary}
            recentTransactions={recentTransactions}
            allTransactions={allTransactions}
            budgets={budgets}
        />
    );
}
