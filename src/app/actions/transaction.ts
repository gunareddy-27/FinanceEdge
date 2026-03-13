'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';

export async function addTransaction(data: { description: string; amount: number; type: string; category: string; date: string }) {
    const userId = await getUserId();

    await prisma.transaction.create({
        data: {
            userId,
            description: data.description,
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: new Date(data.date),
        },
    });

    revalidatePath('/dashboard');
    revalidatePath('/transactions');
}

export async function getTransactions() {
    const userId = await getUserId();

    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 10,
    });

    return transactions.map(t => ({
        ...t,
        amount: Number(t.amount)
    }));
}

export async function getAllTransactions() {
    const userId = await getUserId();

    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'asc' }, // Ascending for time-series analysis
    });

    return transactions.map(t => ({
        ...t,
        amount: Number(t.amount)
    }));
}

export async function getFinancialSummary() {
    const userId = await getUserId();

    const transactions = await prisma.transaction.findMany({
        where: { userId },
    });

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return { income, expenses };
}
