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

    // Determine date range
    if (period === 'Current Month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'Last Quarter') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    } else if (period === 'Last Year') {
        startDate = new Date(now.getFullYear() - 1, 0, 1);
    }

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: { gte: startDate }
        },
        orderBy: { date: 'desc' }
    });

    // Generate CSV Content
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

    // Log the report
    await logReport(period, type);

    return {
        content: csvContent,
        filename
    };
}
