import { getBudgetsForMonth } from '@/app/actions/budget';
import BudgetsClient from './BudgetsClient';

export default async function BudgetsPage() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgets = await getBudgetsForMonth(currentMonth);

    return <BudgetsClient budgets={budgets} />;
}
