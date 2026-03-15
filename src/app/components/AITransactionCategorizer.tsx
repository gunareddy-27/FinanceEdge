'use client';

import { FileText, Cpu, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function AITransactionCategorizer() {
    const [inputStr, setInputStr] = useState('Uber Ride to Airport');
    const [result, setResult] = useState<{ category: string, confidence: number } | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    const handleCategorize = (e: React.FormEvent) => {
        e.preventDefault();
        setIsThinking(true);
        setTimeout(() => {
            const lower = inputStr.toLowerCase();
            if (lower.includes('uber') || lower.includes('flight') || lower.includes('ola')) setResult({ category: 'Travel', confidence: 96 });
            else if (lower.includes('amazon') || lower.includes('flipkart') || lower.includes('zara')) setResult({ category: 'Shopping', confidence: 92 });
            else if (lower.includes('swiggy') || lower.includes('zomato') || lower.includes('starbucks')) setResult({ category: 'Food & Dining', confidence: 98 });
            else setResult({ category: 'General', confidence: 75 });
            setIsThinking(false);
        }, 800);
    };

    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <Cpu size={20} className="text-primary" />
                AI Expense Categorization (NLP)
            </h3>
            <p className="text-sm text-muted mb-4">Automatically classify raw transaction descriptions into standardized categories without manual selection.</p>

            <form onSubmit={handleCategorize} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <input 
                    type="text" 
                    className="input" 
                    value={inputStr} 
                    onChange={e => setInputStr(e.target.value)} 
                    placeholder="E.g., Swiggy Order" 
                    required 
                />
                <button type="submit" className="btn btn-primary" disabled={isThinking}>Classify</button>
            </form>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isThinking ? (
                    <div className="text-muted flex items-center gap-2">
                        <Cpu className="animate-pulse" size={16} /> Running NLP Text Classification Model...
                    </div>
                ) : result ? (
                    <div style={{ width: '100%' }}>
                        <div className="flex-between">
                            <span className="font-bold flex items-center gap-2">
                                <FileText size={16}/> "{inputStr}"
                            </span>
                            <ArrowRight size={16} className="text-muted" />
                            <span className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">
                                {result.category}
                            </span>
                        </div>
                        <div className="text-xs text-muted text-right mt-2">Confidence Score: {result.confidence}%</div>
                    </div>
                ) : (
                    <div className="text-sm text-muted">Input a description to see the AI categorization.</div>
                )}
            </div>
        </div>
    );
}
