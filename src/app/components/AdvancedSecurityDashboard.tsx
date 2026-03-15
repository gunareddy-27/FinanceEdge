'use client';

import { 
    ShieldCheck, 
    Fingerprint, 
    Lock, 
    UploadCloud, 
    DatabaseBackup, 
    ActivitySquare, 
    AlertOctagon, 
    UserCheck,
    HardDriveDownload
} from 'lucide-react';
import { useState } from 'react';

export default function AdvancedSecurityDashboard() {
    const [mfaEnabled, setMfaEnabled] = useState(false);
    
    // 10. Audit Logging 
    const recentLogs = [
        { id: 1, action: 'User logged in', time: '10 mins ago', user: 'Admin' },
        { id: 2, action: 'Budget updated', time: '1 hour ago', user: 'Admin' },
        { id: 3, action: 'Failed login attempt', time: '2 hours ago', user: '192.168.1.45' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '3rem' }}>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <ShieldCheck size={28} className="text-success" />
                Security & Access Control
            </h2>

            {/* Config & MFA Group */}
            <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                
                {/* 1. MFA Component */}
                <div className="card">
                    <h3 className="text-lg flex items-center gap-2 mb-4">
                        <Fingerprint size={18} className="text-primary" />
                        Multi-Factor Auth (MFA)
                    </h3>
                    <div className="flex-between p-3" style={{ backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius)' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Two-Step Verification</div>
                            <div className="text-sm text-muted">Use Authenticator or OTP</div>
                        </div>
                        <button 
                            onClick={() => setMfaEnabled(!mfaEnabled)}
                            className={`btn ${mfaEnabled ? 'btn-danger' : 'btn-primary'}`}
                            style={mfaEnabled ? { backgroundColor: 'var(--success-text)', borderColor: 'transparent', color: 'white' } : {}}
                        >
                            {mfaEnabled ? 'Enabled ✓' : 'Enable'}
                        </button>
                    </div>
                    {mfaEnabled && <p className="text-sm text-success mt-3 flex items-center gap-1"><ShieldCheck size={14}/> Account protected via Authenticator App.</p>}
                </div>

                {/* 2, 3, 4, 6. Core Security Config */}
                <div className="card">
                    <h3 className="text-lg flex items-center gap-2 mb-4">
                        <Lock size={18} className="text-warning" />
                        Core System Security
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="flex items-center gap-2 text-sm">
                            <ShieldCheck size={16} className="text-success" /> 
                            <span><strong>AES-256 Encryption</strong> active for sensitive data</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <ShieldCheck size={16} className="text-success" /> 
                            <span><strong>Bcrypt Hashing</strong> implemented for passwords</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <ShieldCheck size={16} className="text-success" /> 
                            <span><strong>Secure Sessions</strong> (HttpOnly, strict) enforced</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <ActivitySquare size={16} className="text-primary" /> 
                            <span><strong>API Rate Limiting:</strong> 100 req/min/user</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* 5. RBAC Component */}
            <div className="card">
                <h3 className="text-lg flex items-center gap-2 mb-4">
                    <UserCheck size={18} className="text-primary" />
                    Role-Based Access Control (RBAC)
                </h3>
                <div className="grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--primary)' }}>
                        <div className="font-bold flex items-center justify-between">
                            Admin Role 
                            <span className="text-xs bg-primary text-white px-2 py-1 rounded">Active</span>
                        </div>
                        <ul className="text-sm text-muted mt-2 ml-4 mb-2" style={{ listStyle: 'disc' }}>
                            <li>View & Export all reports</li>
                            <li>System configuration</li>
                            <li>Manage users & Db backups</li>
                        </ul>
                    </div>
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--success-text)' }}>
                        <div className="font-bold">Standard User</div>
                        <ul className="text-sm text-muted mt-2 ml-4" style={{ listStyle: 'disc' }}>
                            <li>View own profile & data only</li>
                            <li>Add/Edit standard transactions</li>
                            <li>No admin feature access</li>
                        </ul>
                    </div>
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--warning-text)' }}>
                        <div className="font-bold">Financial Advisor</div>
                        <ul className="text-sm text-muted mt-2 ml-4" style={{ listStyle: 'disc' }}>
                            <li>Read-only access to clients</li>
                            <li>Generate recommendation reports</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 7, 8. Login monitoring & File Uploads */}
            <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3 className="text-lg flex items-center gap-2 mb-3">
                        <AlertOctagon size={18} className="text-danger" />
                        Login Attempt Monitoring
                    </h3>
                    <p className="text-sm text-muted mb-3">Accounts automatically lock after 5 consecutive failed attempts.</p>
                    <div className="text-sm p-3 rounded" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', borderLeft: '4px solid #b91c1c' }}>
                        <div className="flex items-center gap-2">
                            <Lock size={16} />
                            <strong>Security Alert Action Taken</strong>
                        </div>
                        <div className="text-xs mt-1 ml-6">IP 192.168.1.45 temporarily locked for 15 mins (5 failed attempts).</div>
                    </div>
                </div>
                
                <div className="card">
                    <h3 className="text-lg flex items-center gap-2 mb-3">
                        <UploadCloud size={18} className="text-primary" />
                        Secure File Upload System
                    </h3>
                    <p className="text-sm text-muted mb-3">All receipt uploads are scanned for malicious content. Limit 5MB.</p>
                    <div className="text-sm p-3 rounded text-center text-muted" style={{ border: '1px dashed var(--border)', backgroundColor: 'var(--bg-body)' }}>
                        Safety constraints active: <strong className="text-main">JPG, PNG, PDF</strong> ONLY
                    </div>
                </div>
            </div>

            {/* 9, 10. Backup & Audit */}
            <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3 className="text-lg flex items-center gap-2 mb-4">
                        <DatabaseBackup size={18} className="text-primary" />
                        Data Backup & Recovery
                    </h3>
                    <div className="flex-between p-3 mb-3" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: 'var(--radius)' }}>
                        <span className="text-sm font-medium">Last Cloud Snapshot Sync</span>
                        <span className="text-sm bg-white px-2 py-1 rounded font-bold" style={{ color: 'var(--success-text)' }}>Today, 03:00 AM</span>
                    </div>
                    <button className="btn btn-secondary w-full text-sm">
                        <HardDriveDownload size={14} /> Manually Trigger Backup
                    </button>
                    <p className="text-xs text-muted mt-2 text-center">Data is AES-256 encrypted before cloud upload.</p>
                </div>

                <div className="card">
                    <h3 className="text-lg flex items-center gap-2 mb-4">
                        <ActivitySquare size={18} className="text-muted" />
                        System Audit Logs
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '125px', overflowY: 'auto' }}>
                        {recentLogs.map((log, i) => (
                            <div key={log.id} className="flex-between p-2 text-sm" style={{ borderBottom: i !== recentLogs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                <div>
                                    <span className="font-medium text-main">{log.action}</span>
                                    <span className="text-muted ml-2 text-xs">by {log.user}</span>
                                </div>
                                <span className="text-muted text-xs">{log.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-secondary w-full mt-2 text-sm">Download Full CSV Log</button>
                </div>
            </div>
        </div>
    );
}
