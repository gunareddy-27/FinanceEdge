'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Receipt, 
    PieChart, 
    Calculator, 
    BrainCircuit 
} from 'lucide-react';

const mobileNavItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Trans', href: '/transactions', icon: Receipt },
    { name: 'Budget', href: '/budgets', icon: PieChart },
    { name: 'Tax', href: '/tax-estimator', icon: Calculator },
    { name: 'AI', href: '/ai-analytics', icon: BrainCircuit }
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                        key={item.href} 
                        href={item.href} 
                        className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
