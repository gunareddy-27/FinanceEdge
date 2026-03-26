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
    const taxableIncome = Math.max(0, data.income - data.deductions);
    let tax = 0;

    if (taxableIncome > 100525) {
        tax += (taxableIncome - 100525) * 0.24 + 17423.50;
    } else if (taxableIncome > 47150) {
        tax += (taxableIncome - 47150) * 0.22 + 5426;
    } else if (taxableIncome > 11600) {
        tax += (taxableIncome - 11600) * 0.12 + 1160;
    } else {
        tax += taxableIncome * 0.10;
    }

    const estimatedQuarterly = tax / 4;

    const userId = await getUserId();
    const year = new Date().getFullYear();

    await prisma.taxEstimate.create({
        data: {
            userId,
            quarter: 'Q2',
            year,
            estimatedTax: estimatedQuarterly
        }
    });

    revalidatePath('/tax-estimator');

    return {
        totalTax: tax,
        quarterly: estimatedQuarterly,
        q1: data.paidQ1,
        q2: estimatedQuarterly,
        q3: estimatedQuarterly,
        q4: estimatedQuarterly
    };
}

export async function getLatestTaxEstimate() {
    const userId = await getUserId();
    const estimate = await prisma.taxEstimate.findFirst({
        where: { userId },
        orderBy: { year: 'desc' }
    });
    
    if (!estimate) return null;
    
    return {
        ...estimate,
        estimatedTax: Number(estimate.estimatedTax)
    };
}

export async function autoEstimateQuarterlyTax() {
    const userId = await getUserId();
    const year = new Date().getFullYear();

    // Sum all income for current year
    const transactions = await prisma.transaction.findMany({
        where: { 
            userId, 
            type: 'income',
            date: {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31)
            }
        }
    });

    const totalIncome = (transactions as any[]).reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    
    // Simple 12.5% estimated tax for auto-fill (conservative estimate)
    const estimatedTax = totalIncome * 0.125;

    // Check if we already have an estimate for this year/quarter
    const currentMonth = new Date().getMonth();
    const quarter = currentMonth < 3 ? 'Q1' : currentMonth < 6 ? 'Q2' : currentMonth < 9 ? 'Q3' : 'Q4';

    await prisma.taxEstimate.create({
        data: {
            userId,
            quarter,
            year,
            estimatedTax
        }
    });

    revalidatePath('/dashboard');
    return { quarter, estimatedTax };
}

export async function generateSmartTaxStrategy() {
    const userId = await getUserId();
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    
    const transactions = await prisma.transaction.findMany({
        where: { userId, date: { gte: startDate } }
    });

    const income = (transactions as any[])
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const suggestions: string[] = [];
    let potentialSavings = 0;

    if (income > 1000000) {
        suggestions.push("Max out Section 80C through ELSS/PPF for a ₹1.5L deduction.");
        suggestions.push("Contribute to NPS (Section 80CCD) for an additional ₹50,000 exemption.");
        suggestions.push("Leverage Section 80D for medical insurance premiums for self and parents.");
        potentialSavings = 46800;
    } else if (income > 500000) {
        suggestions.push("Utilize full ₹1.5L limit of Section 80C via PPF/NPS.");
        suggestions.push("Compare Old vs New Tax Regime for optimized tax-free threshold.");
        potentialSavings = 22500;
    } else {
        suggestions.push("Claim Section 87A rebate to reduce tax liability to zero.");
        suggestions.push("Keep track of and document all business-related travel and software expenses.");
        potentialSavings = 12500;
    }

    return {
        income,
        suggestions,
        potentialSavings,
        generatedAt: new Date().toISOString()
    };
}
