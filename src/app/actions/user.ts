'use server';

import { prisma } from '@/lib/prisma';

export async function getUserId() {
    // For demo purposes, we'll use a fixed email or create a default user
    const email = 'demo@taxpal.com';

    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Anshul',
                email: email,
                password: 'hashed_password_placeholder', // In real app, hash this
                country: 'United States',
                incomeBracket: 'middle',
            },
        });
    }

    return user.id;
}

export async function updateUserProfile(data: { name: string }) {
    const userId = await getUserId();
    
    await prisma.user.update({
        where: { id: userId },
        data: { name: data.name }
    });

    return { success: true };
}
