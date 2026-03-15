'use client';

import { MapPin, Navigation } from 'lucide-react';

export default function LocationExpenseTracker() {
    return (
        <div className="card">
            <h3 className="text-xl flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <MapPin size={20} className="text-primary" />
                Location Spending
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Starbucks</span>
                        <span className="text-danger">₹300</span>
                    </div>
                    <div className="text-sm text-muted flex items-center gap-1">
                        <Navigation size={12} /> Hyderabad, India
                    </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Airport Lounge</span>
                        <span className="text-danger">₹1,500</span>
                    </div>
                    <div className="text-sm text-muted flex items-center gap-1">
                        <Navigation size={12} /> Mumbai Airport
                    </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                    <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Local Market</span>
                        <span className="text-danger">₹850</span>
                    </div>
                    <div className="text-sm text-muted flex items-center gap-1">
                        <Navigation size={12} /> Koti, Hyderabad
                    </div>
                </div>
            </div>
            
            <button className="btn btn-secondary text-sm mt-4 w-full">Enable GPS Auto-Tracking</button>
        </div>
    );
}
