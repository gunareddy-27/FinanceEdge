'use server';

import OpenAI from 'openai';
import { getFinancialSummary, getTransactions } from './transaction';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// -------------------------------------------------------------
// Fallback Simulation Logic (When all AI services fail)
// -------------------------------------------------------------
async function getSimulationResponse(lastUserMessage: string): Promise<string> {
    const q = lastUserMessage.toLowerCase();

    // Greeting & Identity
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return "Hello! I'm your **TaxPal AI Financial Advisor**. 📊 I can help you analyze your transactions, estimate your tax liability, or give you general budgeting tips. How are we feeling about your finances today?";
    }

    // Dynamic Data Injection for Simulation
    if (q.includes('how much') || q.includes('my income') || q.includes('my expense') || q.includes('summary') || q.includes('status')) {
        try {
            const summary = await getFinancialSummary();
            const savings = summary.income - summary.expenses;
            const savingsRate = summary.income > 0 ? (savings / summary.income * 100).toFixed(1) : 0;

            return `### Your Financial Health at a Glance 📈
| Metric | Value |
| :--- | :--- |
| **Total Income** | $${summary.income.toFixed(2)} |
| **Total Expenses** | $${summary.expenses.toFixed(2)} |
| **Net Balance** | $${savings.toFixed(2)} |
| **Savings Rate** | ${savingsRate}% |

${savings > 0 ? "You're in the green! Nice work. 🌟" : "Looks like you're spending more than you earn. Let's look at ways to cut back."}`;
        } catch (e) {
            return "I'm having a bit of trouble reaching your database right now, but usually I can give you a full breakdown of your income and expenses!";
        }
    }

    // Specialized Tax Advice
    if (q.includes('tax') || q.includes('deduct')) {
        return `### Tax Optimization Strategies 💸
1. **Home Office:** If you work from home, you can deduct a portion of your rent/mortgage and utilities.
2. **Subscriptions:** Tools like Adobe, Slack, or TaxPal themselves are 100% deductible!
3. **Professional Development:** Courses and books related to your field count too.
4. **Hardware:** That new laptop you bought for work? Likely a major deduction.

**Pro Tip:** Use a separate credit card for business to make these deductions easy to spot!`;
    }

    // Budgeting & Savings
    if (q.includes('budget') || q.includes('save') || q.includes('money')) {
        return "### The 50/30/20 Rule for Success 🎯\n* **50% Needs:** Rent, groceries, insurance.\n* **30% Wants:** Dining out, entertainment, hobbies.\n* **20% Savings:** Emergency fund, retirement, investments.\n\nSince your income might be variable, I recommend building a **'Buffer Fund'** of at least 3 months of expenses to smooth out the lean months.";
    }

    // Investment Advice (Safe/General)
    if (q.includes('invest') || q.includes('retirement') || q.includes('stock')) {
        return "### Building Long-Term Wealth 💎\n- **SEP IRA:** Great for freelancers, allows you to contribute up to 25% of your net earnings.\n- **Index Funds:** A low-cost way to get broad market exposure (like the S&P 500).\n- **High-Yield Savings:** Keep your emergency fund here to earn 4-5% interest while staying liquid.\n\n*Note: I'm an AI, so please consult with a human financial advisor before making major moves!*";
    }

    // Audit Preparation
    if (q.includes('audit') || q.includes('irs') || q.includes('receipt')) {
        return "### Audit-Proofing Your Business 🛡️\n- **Keep Receipts:** Anything over $75 requires a receipt. I recommend digital scans.\n- **Consistency:** Use the same accounting method (Cash vs. Accrual) every year.\n- **Separate Accounts:** NEVER mix personal and business banking. It's the #1 red flag for an audit.";
    }

    // Fun/Easter Eggs
    if (q.includes('joke')) return "Why did the accountant cross the road? To get to the other side-ledgers! 💼 (I'm better at math than jokes, I promise.)";
    if (q.includes('coffee')) return "I don't drink coffee, but I noticed you spent about $45 on it last month. That's a lot of caffeine! ☕";

    // Subscription Check
    if (q.includes('subscription') || q.includes('recurring')) {
        return "You have several recurring charges including Netflix, Spotify, and a Gym membership. Would you like me to calculate the annual total for these? (Hint: It's often more than people realize!)";
    }

    if (q.includes('thank')) return "You're very welcome! I'm here whenever you need a financial sanity check. 🧘‍♂️";

    return "I can help you with specific questions like: \n- *'What is my current net balance?'*\n- *'How can I save more on taxes?'*\n- *'Analyze my spending patterns'*\n\nWhat would you like to dive into?";
}

// -------------------------------------------------------------
// Main Chat Function
// -------------------------------------------------------------
export async function chatWithAI(messages: Message[], providedKey?: string) {
    const apiKey = providedKey || process.env.OPENAI_API_KEY;

    // Fetch User Context
    let systemContext = `You are TaxPal AI, a sophisticated and helpful personal financial advisor. 
Your tone is professional, encouraging, and highly data-driven. 
You provide structured advice using markdown (bolding, lists, tables).
Always prioritize the user's financial health.
If the user asks about their own data, use the provided context accurately.
If they ask for general advice, provide actionable tips.`;

    try {
        const summary = await getFinancialSummary();
        const recentTx = await getTransactions(); // Limited to 10

        systemContext += `\n\n[USER FINANCIAL CONTEXT]
- TOTAL INCOME: $${summary.income}
- TOTAL EXPENSES: $${summary.expenses}
- NET BALANCE: $${(summary.income - summary.expenses).toFixed(2)}
- RECENT TRANSACTIONS: ${recentTx.length > 0 ? recentTx.map(t => `\n  * ${t.date}: ${t.description} ($${t.amount})`).join('') : "None yet."}

Use this data to give hyper-personalized responses. If they ask "how much did I spend", refer to TOTAL EXPENSES.`;
    } catch (e) {
        console.error("Failed to load financial context", e);
    }

    // 1. Try OpenAI if key exists
    if (apiKey && apiKey !== 'replace-this-with-your-openai-api-key') {
        const openai = new OpenAI({ apiKey });
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: systemContext }, ...messages],
                max_tokens: 350,
            });
            const content = response.choices[0].message.content;
            if (content) return { message: content };
        } catch (e: any) {
            console.error("OpenAI Error:", e.message);
        }
    }

    // Identify the last user message for processing
    const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user');
    const userContent = lastUserMessage ? lastUserMessage.content : "";

    // 2. Try Free Public AI (Hugging Face Inference - Phi-3)
    try {
        console.log("Attempting to connect to public AI model (Hugging Face)...");

        // Construct prompt with context
        const prompt = `<|system|>\n${systemContext}\nKeep answers short and relevant.<|end|>\n<|user|>\n${userContent}<|end|>\n<|assistant|>`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 200,
                        return_full_text: false,
                        temperature: 0.7
                    }
                })
            }
        );

        if (response.ok) {
            const result = await response.json();
            if (Array.isArray(result) && result[0] && result[0].generated_text) {
                return { message: result[0].generated_text.trim() };
            }
        }
    } catch (error) {
        console.error("Public AI Error:", error);
    }

    // 3. Fallback to Enhanced Simulation with Live Data
    return {
        message: await getSimulationResponse(userContent)
    };
}
