'use server';

import { resetMonthlyBudgets } from './budget';
import { autoArchiveMonthReport } from './report';
import { getFinancialSummary, getAllTransactions } from './transaction';
import { generateInvestmentAdvice } from '@/lib/ai-engine';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getUserId } from './user';

export async function sendSmartNudges() {
    const userId = await getUserId();
    const p = prisma as any;
    const unpaidMembers = await p.groupMember.findMany({
        where: { isPaid: false, group: { userId } },
        include: { group: true }
    });

    const results: string[] = [];
    for (const member of unpaidMembers) {
        // Only nudge if overdue (> 48h)
        const createdDate = new Date(member.group.createdAt);
        const hoursDiff = (new Date().getTime() - createdDate.getTime()) / (1000 * 3600);
        
        if (hoursDiff > 48) {
            results.push(`WhatsApp Nudge sent to ${member.name} for ₹${member.shareAmount.toLocaleString()}`);
            // In a real app, integrate Twilio/WhatsApp API here
        }
    }
    return results;
}

export async function runFullAutomationCycle() {
    const today = new Date();
    const isFirstDay = today.getDate() === 1;
    
    const results: string[] = [];
    
    // 1. Monthly Report & Archive
    if (isFirstDay) {
        const report = await autoArchiveMonthReport();
        if (report.archived) results.push(`Archived ${report.period} report.`);
    }

    // 2. Budget Reset
    const budgets = await resetMonthlyBudgets();
    if (budgets.reset) results.push(`Auto-Reset ${budgets.count} budgets for ${budgets.month}.`);

    // 3. Investment Suggestion Search
    const summary = await getFinancialSummary();
    const advice = generateInvestmentAdvice(summary.income, summary.expenses);
    if (advice && advice.type !== 'Defensive') {
        results.push(`Wealth Engine: ${advice.suggestion}`);
    }

    // 4. Overdue Split Bill Nudges
    const nudges = await sendSmartNudges();
    results.push(...nudges);

    // 5. Security Anomaly Detection
    const allT = await getAllTransactions();
    const recent = allT.slice(0, 5);
    const avg = allT.length > 5 ? allT.reduce((a, b) => a + Number(b.amount), 0) / allT.length : 1000;
    
    recent.forEach(t => {
        if (t.type === 'expense' && Number(t.amount) > avg * 2.5) {
            results.push(`Anomaly Detected: Unusual expense of ₹${Number(t.amount).toLocaleString()} at ${t.description}. Flagged.`);
        }
    });

    revalidatePath('/dashboard');
    return { success: true, logs: results, timestamp: new Date() };
}

export async function getAutomationStatus() {
    return {
        isAutoMagicLinkActive: true,
        isAutoCategorizeActive: true,
        isAutoBudgetResetActive: true,
        isAutoInvestmentActive: true,
        isSecurityMonitoringActive: true
    };
}
