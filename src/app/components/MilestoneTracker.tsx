'use client';

import { Trophy, Target, Star, Award } from 'lucide-react';

export default function MilestoneTracker() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <Trophy size={20} className="text-primary" />
                Financial Milestones
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--success-fade)', padding: '0.75rem', borderRadius: '50%' }}>
                        <Star size={20} className="text-success" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }} className="text-success">🎉 First ₹10,000 Saved!</div>
                        <div className="text-sm text-muted">Achieved on March 12, 2026</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--primary-fade)', padding: '0.75rem', borderRadius: '50%' }}>
                        <Target size={20} className="text-primary" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }} className="text-primary">🎉 3 Months Under Budget</div>
                        <div className="text-sm text-muted">Achieved on March 1, 2026</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', opacity: 0.6 }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                        <Award size={20} className="text-muted" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Emergency Fund Goal</div>
                        <div className="text-sm text-muted">Save 6x overhead (53% complete)</div>
                        <div style={{ marginTop: '0.5rem', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: '53%', height: '100%', backgroundColor: 'var(--success)' }} />
                        </div>
                    </div>
                </div>
            </div>
            
            <button className="btn btn-secondary w-full mt-4">View All Achievements</button>
        </div>
    );
}
