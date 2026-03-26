'use client';

import { LayoutDashboard, ReceiptText, Bot, Zap, CircleUser, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ReceiptText, label: 'Transact', path: '/transactions' },
        { icon: Bot, label: 'Expert AI', path: '/ai-analytics' },
        { icon: Zap, label: 'Auto', path: '/automations' },
        { icon: CircleUser, label: 'Profile', path: '/profile' }
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderTop: '1px solid rgba(226, 232, 240, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 12px 16px 12px',
            zIndex: 1000,
            boxShadow: '0 -4px 12px -2px rgba(0, 0, 0, 0.05)'
        }}>
            {navItems.map((item, idx) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                    <Link 
                        key={idx} 
                        href={item.path} 
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            flex: 1
                        }}
                    >
                        <div style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            transition: 'all 0.3s ease'
                        }}>
                             <Icon size={22} style={{ 
                                strokeWidth: isActive ? 2.5 : 2,
                                transform: isActive ? 'scale(1.1)' : 'scale(1)'
                             }} />
                        </div>
                        <span style={{ 
                            fontSize: '11px', 
                            fontWeight: isActive ? 700 : 500,
                            letterSpacing: '0.01em'
                        }}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
