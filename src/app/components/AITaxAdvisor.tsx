'use client';

import { Lightbulb, CheckCircle2 } from 'lucide-react';

export default function AITaxAdvisor() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2 mb-4">
                <Lightbulb size={20} className="text-success" />
                AI Tax Optimization Advisor
            </h3>
            
            <p className="text-sm text-muted mb-4">Our personalized tax rule engine analyzed your income vs deductions.</p>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--success-fade)', borderRadius: 'var(--radius)', border: '1px solid var(--success-bg)', marginBottom: '1.5rem' }}>
                <h4 className="font-bold text-success mb-2 text-lg">Potential Savings: ₹18,000</h4>
                <p className="text-sm mb-3">You have underutilized your Section 80C investment limits. Consider these options before the financial year ends:</p>
                
                <ul className="text-sm flex flex-col gap-2 font-medium" style={{ color: 'var(--success-text)' }}>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Public Provident Fund (PPF)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Equity Linked Savings Scheme (ELSS)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16}/> National Pension System (NPS)</li>
                </ul>
            </div>

            <button className="btn btn-secondary w-full text-sm">View Full Tax Report</button>
        </div>
    );
}
