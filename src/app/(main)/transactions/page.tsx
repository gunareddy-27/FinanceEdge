import { getTransactions } from '@/app/actions/transaction';
import TransactionsClient from './TransactionsClient';

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    return <TransactionsClient transactions={transactions} />;
}
