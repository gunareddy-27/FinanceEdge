'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    Calculator,
    FileText,
    LogOut,
    BrainCircuit,
    Zap,
    UserCircle
} from 'lucide-react';

import ThemeSwitcher from './ThemeSwitcher';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Automations', href: '/automations', icon: Zap },
    { name: 'Tax Estimator', href: '/tax-estimator', icon: Calculator },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'AI Lab', href: '/ai-analytics', icon: BrainCircuit }
];

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = () => {
        router.push('/login');
    };

    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    F
                </div>
                <span className="text-xl" style={{ color: 'var(--text-main)' }}>FinanceEdge</span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                background: isActive ? 'var(--primary-light)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ paddingBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <ThemeSwitcher />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/profile" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem 1rem',
                    textDecoration: 'none',
                    color: 'var(--text-main)',
                    borderRadius: 'var(--radius-sm)',
                    background: pathname === '/profile' ? 'var(--primary-light)' : 'transparent'
                }}>
                    <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '10px', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700
                    }}>
                        {user?.name?.[0] || <UserCircle size={18} />}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</p>
                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Pro Member</p>
                    </div>
                </Link>

                <button
                    onClick={handleSignOut}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: 500
                    }}
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
