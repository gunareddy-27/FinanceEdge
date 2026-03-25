'use server';

import OpenAI from 'openai';
import { getFinancialSummary, getTransactions } from './transaction';
import { setBudget, getBudgetsForMonth } from './budget';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

async function processChatActions(userMessage: string): Promise<string | null> {
    const q = userMessage.toLowerCase();
    
    // Command: "set [category] budget to [amount]" or "increase [category] budget by [amount]"
    if (q.includes('budget')) {
        const categoryMatch = q.match(/budget (?:for|of) ([a-zA-Z\s]+) (?:to|by) (\d+)/i) || 
                             q.match(/set ([a-zA-Z\s]+) budget to (\d+)/i) ||
                             q.match(/increase ([a-zA-Z\s]+) budget by (\d+)/i);

        if (categoryMatch) {
            const category = categoryMatch[1].trim();
            const amount = parseInt(categoryMatch[2]);
            const isIncrease = q.includes('increase');
            const month = new Date().toISOString().slice(0, 7); // current month YYYY-MM

            if (isIncrease) {
                const currentBudgets = await getBudgetsForMonth(month);
                const existing = currentBudgets.find(b => b.category.toLowerCase() === category.toLowerCase());
                const newLimit = (existing ? Number(existing.limit) : 0) + amount;
                await setBudget(category, newLimit, month);
                return `Action Executed: I have **increased** your ${category} budget by ₹${amount}. Your new limit for ${month} is **₹${newLimit.toLocaleString()}**.`;
            } else {
                await setBudget(category, amount, month);
                return `Action Executed: Done! I have **set** your ${category} budget to **₹${amount.toLocaleString()}** for ${month}.`;
            }
        }
    }
    return null;
}

async function getSimulationResponse(lastUserMessage: string): Promise<string> {
    const q = lastUserMessage.toLowerCase();

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return "Hello! I'm your **TaxPal AI Financial Advisor**. 📊 I can help you analyze your transactions, estimate your tax liability, or update your budgets via chat. How can I help you today?";
    }

    if (q.includes('summary') || q.includes('how much') || q.includes('status')) {
        try {
            const summary = await getFinancialSummary();
            const savings = summary.income - summary.expenses;
            return `### Your Financial Health Summary 📈
- **Total Income**: ₹${summary.income.toLocaleString()}
- **Total Expenses**: ₹${summary.expenses.toLocaleString()}
- **Net Balance**: ₹${savings.toLocaleString()}
${savings > 0 ? "You're doing great! 🌟" : "Spending is high this month. Let's review your budget."}`;
        } catch (e) {
            return "Unable to fetch live data, but I can still give you general advice!";
        }
    }

    if (q.includes('tax')) {
        return "You can optimize your taxes by deducting business expenses like software (TaxPal!), home office costs, and professional development. Would you like me to estimate your quarterly tax?";
    }

    return "I'm your financial assistant. You can ask me to **'Set my Food budget to 5000'** or **'Show my spending summary'**.";
}

export async function chatWithAI(messages: Message[], providedKey?: string): Promise<{ message?: string; error?: string }> {
    const apiKey = providedKey || process.env.OPENAI_API_KEY;
    const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user');
    const userContent = lastUserMessage ? lastUserMessage.content : "";

    // 1. Process Action Commands (Budget updates, etc.)
    const actionResult = await processChatActions(userContent);
    if (actionResult) return { message: actionResult };

    let systemContext = `You are TaxPal AI personal financial advisor. 
You can update user budgets. Tone: Professional and helpful. Use Markdown.`;

    try {
        const summary = await getFinancialSummary();
        systemContext += `\n\n[CONTEXT] Income: $${summary.income}, Expense: $${summary.expenses}`;
    } catch (e) {}

    // 2. OpenAI Fallback
    if (apiKey && apiKey !== 'replace-this-with-your-openai-api-key') {
        const openai = new OpenAI({ apiKey });
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: systemContext }, ...messages],
                max_tokens: 300,
            });
            return { message: response.choices[0].message.content || "" };
        } catch (e) {}
    }

    // 3. Final Fallback
    return {
        message: await getSimulationResponse(userContent)
    };
}
