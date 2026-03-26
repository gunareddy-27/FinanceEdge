
export function categorizeTransaction(description: string): { category: string; confidence: number } {
    const lower = description.toLowerCase();
    
    // Transport & Commute
    if (lower.match(/uber|ola|rapido|indigo|air india|irctc|metro|fuel|petrol|parking|shell|hpcl|toll/)) {
        return { category: 'Transport', confidence: 98 };
    }
    
    // Food, Dining & Groceries
    if (lower.match(/swiggy|zomato|starbucks|mcdonald|burger king|pizza hut|kfc|blinkit|zepto|bigbasket|instamart|grocery|supermarket|dining|restaurant|cafe/)) {
        return { category: 'Food', confidence: 99 };
    }
    
    // Software, SaaS & Cloud
    if (lower.match(/aws|google cloud|azure|openai|github|cursor|vercel|netlify|heroku|slack|zoom|notion|atlassian|figma|adobe|hosting|domain/)) {
        return { category: 'Software', confidence: 96 };
    }
    
    // Shopping & Lifestyle
    if (lower.match(/amazon|flipkart|myntra|ajio|zara|h&m|nike|adidas|mall|electronics|apple|samsung|croma|reliance digital/)) {
        return { category: 'Shopping', confidence: 94 };
    }
    
    // Bills, Utilities & Rent
    if (lower.match(/electricity|water|gas|rent|maintenance|jio|airtel|vi|recharge|wifi|broadband|insurance|policybazaar/)) {
        return { category: 'Bills', confidence: 97 };
    }
    
    // Health & Wellness
    if (lower.match(/hospital|pharmacy|apollo|medplus|pharmeasy|medicine|doctor|consultation|gym|cult|fitness|health/)) {
        return { category: 'Health', confidence: 95 };
    }
    
    // Entertainment & Subscriptions
    if (lower.match(/netflix|spotify|youtube|hotstar|prime|sonyliv|movie|pvr|inox|bookmyshow|gaming|steam|epic/)) {
        return { category: 'Entertainment', confidence: 98 };
    }

    // Default
    return { category: 'Others', confidence: 70 };
}

export function generateInvestmentAdvice(income: number, expenses: number) {
    const surplus = income - expenses;
    const savingsRate = (surplus / income) * 100;

    if (surplus <= 0) return {
        type: 'Defensive',
        suggestion: 'Focus on eliminating debt and reducing discretionary spend.',
        impact: 'Financial Stability'
    };

    if (savingsRate > 40) {
        return {
            type: 'Aggressive',
            suggestion: `Excellent savings rate (${savingsRate.toFixed(1)}%). Allocate 70% to Small/Mid-cap equity and 30% to Gold/Sovereign Bonds.`,
            impact: 'Maximized Wealth Growth'
        };
    } else if (savingsRate > 20) {
        return {
            type: 'Moderate',
            suggestion: `Healthy savings. Start a Flexi-cap SIP of ₹${Math.round(surplus * 0.6).toLocaleString()} and keep ₹${Math.round(surplus * 0.4).toLocaleString()} in Liquid Funds.`,
            impact: 'Balanced Portfolio'
        };
    }
    
    return {
        type: 'Conservative',
        suggestion: 'Surplus detected but low buffer. Prioritize Building an Emergency Fund (6x monthly expenses).',
        impact: 'Financial Safety Net'
    };
}
