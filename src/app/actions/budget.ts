'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';

export async function getBudgetsForMonth(month: string) {
    const userId = await getUserId();

    // 1. Get all budgets for this month
    const budgets = await prisma.budget.findMany({
        where: { userId, month },
    });

    // 2. Calculate actual spending for each category in this month
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of month

    const expenses = await prisma.transaction.groupBy({
        by: ['category'],
        where: {
            userId,
            type: 'expense',
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        _sum: {
            amount: true,
        },
    });

    // 3. Combine budget limit with actual spending
    const budgetData = budgets.map(b => {
        const spent = expenses.find(e => e.category === b.category)?._sum.amount || 0;
        return {
            id: b.id,
            category: b.category,
            limit: Number(b.limit),
            spent: Number(spent),
            month: b.month
        };
    });

    return budgetData;
}

export async function setBudget(category: string, limit: number, month: string) {
    const userId = await getUserId();

    // Check if budget exists for this category/month
    const existing = await prisma.budget.findFirst({
        where: { userId, category, month },
    });

    if (existing) {
        await prisma.budget.update({
            where: { id: existing.id },
            data: { limit },
        });
    } else {
        await prisma.budget.create({
            data: {
                userId,
                category,
                limit,
                month,
            },
        });
    }

    revalidatePath('/dashboard');
}

export async function deleteBudget(id: number) {
    const userId = await getUserId();
    // Ensure user owns the budget
    const budget = await prisma.budget.findUnique({ where: { id } });
    if (budget && budget.userId === userId) {
        await prisma.budget.delete({ where: { id } });
        revalidatePath('/dashboard');
    }
}
