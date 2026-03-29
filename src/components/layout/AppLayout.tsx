import { useState } from 'react';
import AppSidebar from './AppSidebar';
import AppTopBar from './AppTopBar';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, TrendingUp, Wallet, Gift } from 'lucide-react';
import AIChatWidget from '@/components/AIChatWidget';

const mobileNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
    { to: '/invest', icon: TrendingUp, label: 'Invest' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/referral', icon: Gift, label: 'Rewards' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <AppTopBar onMenuClick={() => setMobileOpen(true)} />

                <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6 overflow-auto">
                    {children}
                </main>

                {/* Mobile bottom nav */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border/60 z-30">
                    <div className="flex">
                        {mobileNavItems.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </div>
            <AIChatWidget />
        </div>
    );
}
