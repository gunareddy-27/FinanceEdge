import { getFinancialSummary, getTransactions, getAllTransactions } from '@/app/actions/transaction';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const summary = await getFinancialSummary();
    const recentTransactions = await getTransactions(); // recent 10
    const allTransactions = await getAllTransactions(); // for forecast

    return (
        <DashboardClient
            summary={summary}
            recentTransactions={recentTransactions}
            allTransactions={allTransactions}
        />
    );
}
