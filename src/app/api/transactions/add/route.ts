import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    
    // Extract parameters
    const description = searchParams.get('description');
    const amount = searchParams.get('amount');
    const type = searchParams.get('type') || 'expense'; // 'income' or 'expense'
    const category = searchParams.get('category') || 'Others';
    const secret = searchParams.get('secret');

    // Security check (Basic - ideally use env variable)
    const APP_SECRET = process.env.API_SECRET || 'taxpal_magic_key';
    
    if (secret !== APP_SECRET) {
        return NextResponse.json({ error: 'Unauthorized: Invalid Secret Key' }, { status: 401 });
    }

    if (!description || !amount) {
        return NextResponse.json({ error: 'Missing description or amount' }, { status: 400 });
    }

    try {
        // Find a default user for the "Magic Link" (usually the first one or a demo user)
        const user = await prisma.user.findFirst();
        
        if (!user) {
            return NextResponse.json({ error: 'No user found in database' }, { status: 404 });
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                description,
                amount: parseFloat(amount),
                type,
                category,
                date: new Date()
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: `Magic! Added ₹${amount} for ${description}`,
            transaction 
        });

    } catch (error: any) {
        return NextResponse.json({ error: 'Database Error', details: error.message }, { status: 500 });
    }
}
