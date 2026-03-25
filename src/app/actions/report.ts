'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';

export async function logReport(period: string, type: string) {
    const userId = await getUserId();

    await prisma.report.create({
        data: {
            userId,
            period,
            reportType: type,
            filePath: null
        }
    });

    revalidatePath('/reports');
    revalidatePath('/dashboard');
}

export async function getReports() {
    const userId = await getUserId();

    return await prisma.report.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function generateReport(type: string, period: string) {
    const userId = await getUserId();
    const now = new Date();
    let startDate = new Date();

    if (period === 'Current Month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'Last Quarter') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    } else if (period === 'Last Year') {
        startDate = new Date(now.getFullYear() - 1, 0, 1);
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: { gte: startDate }
        },
        orderBy: { date: 'desc' }
    });

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [
        t.date.toISOString().slice(0, 10),
        `"${t.description || ''}"`,
        t.category,
        t.type,
        Number(t.amount).toFixed(2)
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const filename = `TaxPal_${type.replace(' ', '_')}_${period.replace(' ', '_')}_${now.getTime()}.csv`;

    await logReport(period, type);

    return {
        content: csvContent,
        filename
    };
}

export async function autoArchiveMonthReport() {
    const userId = await getUserId();
    const now = new Date();
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthName = lastMonthDate.toLocaleString('default', { month: 'long' });
    const year = lastMonthDate.getFullYear();
    const period = `${monthName} ${year}`;

    const existing = await prisma.report.findFirst({
        where: { userId, period, reportType: 'Monthly Summary' }
    });

    if (!existing) {
        await generateReport('Monthly Summary', 'Current Month');
        return { archived: true, period };
    }

    return { archived: false };
}
