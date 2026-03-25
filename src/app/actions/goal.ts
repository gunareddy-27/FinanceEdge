'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';

export async function addGoal(data: { name: string; targetAmount: number; deadline: string }) {
    const userId = await getUserId();

    await prisma.goal.create({
        data: {
            userId,
            name: data.name,
            targetAmount: data.targetAmount,
            deadline: new Date(data.deadline),
            status: 'active',
        },
    });

    revalidatePath('/dashboard');
}

export async function getGoals() {
    const userId = await getUserId();

    const goals = await prisma.goal.findMany({
        where: { userId },
        orderBy: { deadline: 'asc' },
    });

    return (goals as any[]).map((g: any) => ({
        ...g,
        targetAmount: Number(g.targetAmount),
        currentAmount: Number(g.currentAmount),
        deadline: g.deadline.toISOString().slice(0, 10),
    }));
}

export async function updateGoalProgress(goalId: number, amount: number) {
    const userId = await getUserId();

    await prisma.goal.update({
        where: { id: goalId, userId },
        data: {
            currentAmount: {
                increment: amount
            }
        }
    });

    revalidatePath('/dashboard');
}
