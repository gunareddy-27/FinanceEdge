'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';

export async function createExpenseGroup(data: { name: string; totalAmount: number; members: { name: string; shareAmount: number }[] }) {
    const userId = await getUserId();
    const p = prisma as any;

    await p.expenseGroup.create({
        data: {
            userId,
            name: data.name,
            totalAmount: data.totalAmount,
            members: {
                create: data.members.map(m => ({
                    name: m.name,
                    shareAmount: m.shareAmount,
                    isPaid: false
                }))
            }
        }
    });

    revalidatePath('/dashboard');
}

export async function getExpenseGroups() {
    const userId = await getUserId();
    const p = prisma as any;

    const groups = await p.expenseGroup.findMany({
        where: { userId },
        include: { members: true },
        orderBy: { createdAt: 'desc' }
    });

    return groups.map((g: any) => ({
        ...g,
        totalAmount: Number(g.totalAmount),
        members: g.members.map((m: any) => ({
            ...m,
            shareAmount: Number(m.shareAmount)
        }))
    }));
}

export async function toggleMemberPaid(memberId: number, isPaid: boolean) {
    const userId = await getUserId(); 
    const p = prisma as any;

    await p.groupMember.update({
        where: { id: memberId },
        data: { isPaid }
    });

    revalidatePath('/dashboard');
}
