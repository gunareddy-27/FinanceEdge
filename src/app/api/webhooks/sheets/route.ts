import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { description, amount, type, category, secret } = body;

        // Security check
        const APP_SECRET = process.env.API_SECRET || 'taxpal_magic_key';
        if (secret !== APP_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!description || !amount) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        const user = await prisma.user.findFirst();
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                description,
                amount: parseFloat(amount),
                type: type || 'expense',
                category: category || 'Others',
                date: new Date()
            }
        });

        return NextResponse.json({ success: true, transaction });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Error', details: error.message }, { status: 500 });
    }
}
