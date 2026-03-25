'use client';

import { useState } from 'react';
import { 
    User, 
    Bell, 
    Shield, 
    LogOut, 
    CreditCard, 
    Settings, 
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Crown,
    HelpCircle,
    X,
    Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import BottomNav from '@/app/components/BottomNav';
import Modal from '@/app/components/Modal';

export default function ProfileClient({ user }: { user: any }) {
    const { showToast } = useToast();
    const router = useRouter();
    const [isPremium, setIsPremium] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [name, setName] = useState(user?.name || 'User');
    const [email, setEmail] = useState(user?.email || 'user@taxpal.com');

    const menuItems = [
        { id: 'info', icon: User, label: 'Personal Information', sub: 'Update your name and photo', color: '#6366f1' },
        { id: 'sub', icon: CreditCard, label: 'Subscription Plan', sub: isPremium ? 'Premium Active' : 'Free Plan', color: '#10b981' },
        { id: 'notif', icon: Bell, label: 'Notifications', sub: 'Receive smart alerts', color: '#f59e0b' },
        { id: 'sec', icon: Shield, label: 'Security & Privacy', sub: '2FA and Password security', color: '#ef4444' },
        { id: 'help', icon: HelpCircle, label: 'Help & Support', sub: 'Connect with financial advisors', color: '#8b5cf6' }
    ];

    const handleItemClick = (id: string) => {
        if (id === 'info') {
            setEditModalOpen(true);
        } else {
            showToast(`Opening ${id} settings (Premium Feature)`, 'info');
        }
    };

    const handleSaveProfile = () => {
        setEditModalOpen(false);
        showToast("Profile updated successfully!", "success");
    };

    const handleSignOut = () => {
        showToast("Signing out...", "info");
        setTimeout(() => {
            router.push('/login');
        }, 1000);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '120px' }}>
            <header className="flex-between" style={{ marginBottom: '2.5rem' }}>
                <h1 className="text-3xl font-black">Profile</h1>
                <button onClick={() => showToast("Global settings opened.", "info")} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={18} />
                </button>
            </header>

            {/* Profile Hero Card */}
            <div className="card" style={{ 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: 'white', 
                padding: '2rem', 
                borderRadius: '32px',
                border: 'none',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
                    <Sparkles size={160} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '36px', 
                        background: 'linear-gradient(45deg, #6366f1, #a855f7)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                    }}>
                        {name[0]}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{name}</h2>
                        <p style={{ opacity: 0.7, margin: '4px 0 12px 0' }}>{email}</p>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ 
                                background: 'rgba(255,255,255,0.1)', 
                                padding: '4px 12px', 
                                borderRadius: '12px', 
                                fontSize: '12px', 
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Crown size={12} fill="#fbbf24" color="#fbbf24" />
                                Prime Member
                            </span>
                            <span style={{ 
                                background: 'rgba(16, 185, 129, 0.2)', 
                                color: '#10b981',
                                padding: '4px 12px', 
                                borderRadius: '12px', 
                                fontSize: '12px', 
                                fontWeight: 700
                            }}>
                                KYC Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="card" style={{ padding: '0.5rem', borderRadius: '32px' }}>
                {menuItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div 
                            key={idx} 
                            onClick={() => handleItemClick(item.id)}
                            className="profile-item" 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '1.5rem',
                                cursor: 'pointer',
                                borderRadius: '24px',
                                transition: 'all 0.2s ease',
                                borderBottom: idx === menuItems.length - 1 ? 'none' : '1px solid #f1f5f9'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{ 
                                    background: `${item.color}15`, 
                                    color: item.color, 
                                    padding: '12px', 
                                    borderRadius: '16px' 
                                }}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: 700 }}>{item.label}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{item.sub}</p>
                                </div>
                            </div>
                            <ArrowRight size={20} color="#cbd5e1" />
                        </div>
                    );
                })}
            </div>

            <button 
                onClick={handleSignOut}
                className="btn btn-secondary" 
                style={{ 
                    marginTop: '2rem', 
                    width: '100%', 
                    padding: '1.25rem', 
                    borderRadius: '24px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '12px',
                    color: '#ef4444',
                    border: '1px solid #fee2e2',
                    fontWeight: 800
                }}
            >
                <LogOut size={20} />
                Sign Out from TaxPal Prime
            </button>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Personal Information"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="label">Full Name</label>
                        <input 
                            className="input" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="label">Email Address</label>
                        <input 
                            className="input" 
                            disabled 
                            value={email}
                            placeholder="user@example.com"
                        />
                        <p className="text-xs text-muted mt-2">Verified account email cannot be changed without 2FA confirmation.</p>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setEditModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button onClick={handleSaveProfile} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <BottomNav />

            <style jsx>{`
                .profile-item:hover {
                    background: #f8fafc;
                    transform: translateX(4px);
                }
            `}</style>
        </div>
    );
}
