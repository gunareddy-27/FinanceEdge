import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { categorizeTransaction } from '@/lib/ai-engine';

export async function POST(req: Request) {
    try {
        const { userId, description, amount, date } = await req.json();

        if (!userId || !description || !amount) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const { category, confidence } = categorizeTransaction(description);

        const transaction = await prisma.transaction.create({
            data: {
                userId: Number(userId),
                description,
                amount: Number(amount),
                category,
                type: 'expense',
                date: date ? new Date(date) : new Date(),
            }
        });

        return NextResponse.json({ 
            success: true, 
            transaction,
            ai: { category, confidence }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
