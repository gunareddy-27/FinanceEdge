'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';

export interface Subscription {
    id: string; // generated ID based on hash or just index
    name: string;
    amount: number;
    frequency: 'Monthly' | 'Weekly' | 'Irregular';
    nextPaymentDate: string;
    lastPaymentDate: string;
}

export async function getRecurringSubscriptions(): Promise<Subscription[]> {
    const userId = await getUserId();

    // 1. Get all expenses
    const expenses = await prisma.transaction.findMany({
        where: { userId, type: 'expense' },
        orderBy: { date: 'asc' }
    });

    // 2. Group by Description (normalization: lowercase, trim)
    const groups: { [key: string]: typeof expenses } = {};

    (expenses as any[]).forEach((exp: any) => {
        const key = (exp.description || '').toLowerCase().trim();
        if (!key) return;
        if (!groups[key]) groups[key] = [];
        groups[key].push(exp);
    });

    const subscriptions: Subscription[] = [];

    // 3. Analyze each group
    Object.entries(groups).forEach(([name, txs]) => {
        if (txs.length < 2) return; // Need at least 2 to detect pattern

        // Check intervals
        let isRecurring = true;
        let totalDays = 0;
        let lastDate = new Date(txs[0].date);

        // Sort explicitly by date just in case
        const sortedTxs = txs.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const intervals: number[] = [];

        for (let i = 1; i < sortedTxs.length; i++) {
            const current = new Date(sortedTxs[i].date);
            const prev = new Date(sortedTxs[i - 1].date);
            const diffTime = Math.abs(current.getTime() - prev.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            intervals.push(diffDays);
            lastDate = current;
        }

        // Calculate average interval
        const avgInterval = (intervals as number[]).reduce((a: number, b: number) => a + b, 0) / intervals.length;

        let frequency: 'Monthly' | 'Weekly' | 'Irregular' = 'Irregular';

        // Detect frequency (Allow variance of +/- 5 days)
        if (avgInterval >= 25 && avgInterval <= 35) {
            frequency = 'Monthly';
        } else if (avgInterval >= 6 && avgInterval <= 8) {
            frequency = 'Weekly';
        } else {
            isRecurring = false; // Filter out irregular for now
        }

        // Also check if amount is consistent (variance < 10%)
        const amounts = sortedTxs.map((t: any) => Number(t.amount));
        const avgAmount = amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length;
        const isAmountConsistent = amounts.every((a: number) => Math.abs(a - avgAmount) / avgAmount < 0.1);

        if (isRecurring && isAmountConsistent) {
            // Calculate Next Payment
            const nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + Math.round(avgInterval));

            subscriptions.push({
                id: name, // unique key from description
                name: sortedTxs[0].description || name, // toggle casing back
                amount: avgAmount,
                frequency,
                lastPaymentDate: lastDate.toISOString().slice(0, 10),
                nextPaymentDate: nextDate.toISOString().slice(0, 10)
            });
        }
    });

    // Sort by next payment date
    return (subscriptions as Subscription[]).sort((a: any, b: any) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
}
