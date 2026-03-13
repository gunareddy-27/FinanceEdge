'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';

export async function calculateTaxEstimate(data: {
    income: number;
    deductions: number;
    filingStatus: string;
    paidQ1: number;
}) {
    // US Federal Tax Brackets 2024 (Simplified for Single Filers)
    // 10% up to $11,600
    // 12% up to $47,150
    // 22% up to $100,525
    // 24% up to $191,950
    const taxableIncome = Math.max(0, data.income - data.deductions);
    let tax = 0;

    if (taxableIncome > 100525) {
        tax += (taxableIncome - 100525) * 0.24 + 17423.50; // Base from lower brackets
    } else if (taxableIncome > 47150) {
        tax += (taxableIncome - 47150) * 0.22 + 5426;
    } else if (taxableIncome > 11600) {
        tax += (taxableIncome - 11600) * 0.12 + 1160;
    } else {
        tax += taxableIncome * 0.10;
    }

    const estimatedQuarterly = tax / 4;

    // Save this calculation to DB for record keeping
    const userId = await getUserId();
    const year = new Date().getFullYear();

    await prisma.taxEstimate.create({
        data: {
            userId,
            quarter: 'Q2', // Hardcoded for demo/current context
            year,
            estimatedTax: estimatedQuarterly
        }
    });

    revalidatePath('/tax-estimator');

    // Return breakdown for UI
    return {
        totalTax: tax,
        quarterly: estimatedQuarterly,
        q1: data.paidQ1,           // Already paid
        q2: estimatedQuarterly,    // Due
        q3: estimatedQuarterly,    // Projected
        q4: estimatedQuarterly     // Projected
    };
}
