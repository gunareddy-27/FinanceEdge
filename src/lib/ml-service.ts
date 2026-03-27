/**
 * FinanceEdge ML Service (Hybrid Engine)
 * Automatically falls back to Rule-Based RegEx if FastAPI ML v2 is unavailable.
 */

import { categorizeTransaction as ruleBasedCategorize } from './ai-engine';

const ML_API_URL = 'http://localhost:8000/api/v2';

export async function categorizeSmart(description: string, amount: number) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
        
        const response = await fetch(`${ML_API_URL}/categorize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, amount }),
            signal: controller.signal
        });
        
        if (response.ok) {
            const data = await response.json();
            return { 
                category: data.category, 
                confidence: data.confidence * 100, 
                engine: 'ML v2 (LogisticRegression)' 
            };
        }
    } catch (e) {
        console.warn("ML Engine offline, falling back to Rules Engine.");
    }

    // Fallback to RegEx engine
    const result = ruleBasedCategorize(description);
    return { 
        ...result, 
        engine: 'Rules Engine (RegEx)' 
    };
}

export async function getForecastSmart(history: number[]) {
    try {
        if (history.length < 10) return null; // Not enough data for XGBoost
        
        // Mocking feature prep [lag_1, lag_7, rolling_7]
        const lag_1 = history[history.length - 1];
        const lag_7 = history[history.length - 7];
        const rolling_7 = history.slice(-7).reduce((a, b) => a + b, 0) / 7;

        const response = await fetch(`${ML_API_URL}/forecast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lags: [lag_1, lag_7, rolling_7] })
        });

        if (response.ok) {
            const data = await response.json();
            return { 
                predicted: data.predicted_amount, 
                engine: 'ML v2 (XGBoost)' 
            };
        }
    } catch (e) {
        return null;
    }
}
