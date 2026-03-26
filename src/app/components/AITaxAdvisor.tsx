'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useToast } from './ToastProvider';
import { generateSmartTaxStrategy } from '@/app/actions/tax';

export default function AITaxAdvisor() {
    const { showToast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [strategy, setStrategy] = useState<any>(null);

    useEffect(() => {
        handleGenerate(true);
    }, []);

    const handleGenerate = async (isInitial = false) => {
        setIsGenerating(true);
        try {
            const res = await generateSmartTaxStrategy();
            setStrategy(res);
            if (!isInitial) showToast('AI Strategy updated with latest transactions!', 'success');
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="card" style={{ border: '2px dashed var(--success-bg)', background: '#f8fafc' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl flex items-center gap-2 m-0 p-0">
                    <Sparkles size={20} className="text-success" />
                    Smart Strategy Engine
                </h3>
                {isGenerating && <Loader2 size={16} className="animate-spin text-success" />}
            </div>
            
            <p className="text-sm text-muted mb-4 leading-relaxed">Personalized optimization audits based on current FY cash-flow patterns.</p>

            {strategy && (
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--success-fade)', borderRadius: 'var(--radius)', border: '1px solid #10b98130', marginBottom: '1.5rem' }}>
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-xs font-black uppercase text-success tracking-widest opacity-60">Estimated Potential Savings</span>
                        <h4 className="font-black text-success text-2xl m-0 leading-none">₹{strategy.potentialSavings.toLocaleString()}</h4>
                    </div>
                    
                    <ul className="text-xs flex flex-col gap-3 font-bold" style={{ color: 'var(--success-text)' }}>
                        {strategy.suggestions.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 p-2 bg-white rounded-lg shadow-sm">
                                <CheckCircle2 size={14} className="mt-1 flex-shrink-0" /> 
                                <span className="m-0 leading-normal">{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={() => handleGenerate()} disabled={isGenerating} className="btn btn-secondary w-full text-sm font-black flex items-center justify-center gap-2">
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />}
                {isGenerating ? 'ANALYZING LEDGER...' : 'RE-RUN SMART AUDIT'}
            </button>
        </div>
    );
}
