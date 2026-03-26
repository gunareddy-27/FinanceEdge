'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const EXCEL_FILE_PATH = path.join(process.cwd(), 'taxpal_ledger.csv');

async function syncToLocalExcel(data: any) {
    try {
        const headers = "Date,Description,Category,Type,Amount\n";
        const row = `${data.date},"${data.description || ''}","${data.category || ''}",${data.type.toUpperCase()},${data.amount}\n`;
        
        if (!fs.existsSync(EXCEL_FILE_PATH)) {
            fs.writeFileSync(EXCEL_FILE_PATH, headers + row);
        } else {
            fs.appendFileSync(EXCEL_FILE_PATH, row);
        }
    } catch (err) {
        console.error("Failed to sync to local excel:", err);
    }
}

export async function addTransaction(data: { description: string; amount: number; type: string; category: string; date: string; voiceNotes?: string; attachmentUrl?: string; fromDest?: string; toDest?: string }) {
    const userId = await getUserId();

    const transaction = await prisma.transaction.create({
        data: {
            userId,
            description: data.description,
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: new Date(data.date),
            voiceNotes: data.voiceNotes,
            attachmentUrl: data.attachmentUrl,
            fromDest: data.fromDest,
            toDest: data.toDest
        },
    });

    // Auto-store in local Excel file (CSV format)
    await syncToLocalExcel(data);

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

    return (transactions as any[]).map((t: any) => ({
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

    return (transactions as any[]).map((t: any) => ({
        ...t,
        amount: Number(t.amount)
    }));
}

export async function getFinancialSummary() {
    const userId = await getUserId();

    const transactions = await prisma.transaction.findMany({
        where: { userId },
    });

    const income = (transactions as any[])
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const expenses = (transactions as any[])
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    return { income, expenses };
}
