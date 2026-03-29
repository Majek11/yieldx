import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    PieChart,
    TrendingUp,
    Wallet,
    ReceiptText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    X,
    Gift,
    ArrowDown,
    BarChart2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/invest', icon: TrendingUp, label: 'Invest' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/wallet#deposit', icon: ArrowDown, label: 'Deposit', highlight: true },
    { to: '/transactions', icon: ReceiptText, label: 'Transactions' },
    { to: '/referral', icon: Gift, label: 'Refer & Earn' },
];

interface AppSidebarProps {
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export default function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'YX';

    const kycPending = user?.kycStatus !== 'approved';

    const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
        <div className={`flex flex-col h-full ${collapsed && !mobile ? 'w-[72px]' : 'w-[260px]'} transition-all duration-300`}>
            {/* Logo */}
            <div className={`flex items-center px-5 py-5 ${collapsed && !mobile ? 'justify-center px-3' : 'justify-between'}`}>
                {(!collapsed || mobile) && (
                    <div className="flex items-center gap-2">
                        <svg width="32" height="32" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                            {/* Purple Circle Ring */}
                            <circle cx="120" cy="120" r="95" fill="none" stroke="#7C3AED" strokeWidth="24" strokeLinecap="round"/>
                            
                            {/* S-Curve Arrow Path */}
                            <g transform="translate(120, 120)">
                                {/* Smooth S-curve line */}
                                <path d="M -50 30 Q -30 0 0 -15 Q 30 -25 50 -35" 
                                      fill="none" 
                                      stroke="#7C3AED" 
                                      strokeWidth="14" 
                                      strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </g>
                            
                            {/* Emerald Green Dot at curve endpoint */}
                            <circle cx="170" cy="85" r="12" fill="#10B981"/>
                        </svg>
                        <span className="font-heading text-lg font-semibold text-foreground tracking-wide">YieldX</span>
                    </div>
                )}
                {collapsed && !mobile && (
                    <svg width="32" height="32" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                        {/* Purple Circle Ring */}
                        <circle cx="120" cy="120" r="95" fill="none" stroke="#7C3AED" strokeWidth="24" strokeLinecap="round"/>
                        
                        {/* S-Curve Arrow Path */}
                        <g transform="translate(120, 120)">
                            {/* Smooth S-curve line */}
                            <path d="M -50 30 Q -30 0 0 -15 Q 30 -25 50 -35" 
                                  fill="none" 
                                  stroke="#7C3AED" 
                                  strokeWidth="14" 
                                  strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </g>
                        
                        {/* Emerald Green Dot at curve endpoint */}
                        <circle cx="170" cy="85" r="12" fill="#10B981"/>
                    </svg>
                )}
                {!mobile && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                )}
                {mobile && (
                    <button onClick={onMobileClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label, highlight }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={mobile ? onMobileClose : undefined}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${highlight
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : isActive
                                    ? 'bg-primary/15 text-primary border border-primary/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            } ${collapsed && !mobile ? 'justify-center px-0' : ''}`
                        }
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {(!collapsed || mobile) && <span>{label}</span>}
                    </NavLink>
                ))}

                <div className="h-px bg-border/50 my-3" />

                <NavLink
                    to="/settings"
                    onClick={mobile ? onMobileClose : undefined}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                            ? 'bg-primary/15 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        } ${collapsed && !mobile ? 'justify-center px-0' : ''}`
                    }
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {(!collapsed || mobile) && <span>Settings</span>}
                </NavLink>
            </nav>

            {/* Bottom section */}
            <div className="p-3 space-y-3">
                {/* KYC Banner */}
                {kycPending && (!collapsed || mobile) && (
                    <NavLink
                        to="/settings"
                        onClick={mobile ? onMobileClose : undefined}
                        className="block bg-primary/10 border border-primary/20 rounded-xl p-3 hover:bg-primary/15 transition-colors group"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-primary text-xs font-semibold">Verify Identity</span>
                        </div>
                        <p className="text-muted-foreground text-xs">Complete KYC to unlock all features</p>
                    </NavLink>
                )}

                {/* User card */}
                <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors ${collapsed && !mobile ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-heading text-xs font-bold text-primary">{initials}</span>
                    </div>
                    {(!collapsed || mobile) && (
                        <div className="flex-1 min-w-0">
                            <p className="text-foreground text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
                        </div>
                    )}
                    {(!collapsed || mobile) && (
                        <button
                            onClick={handleLogout}
                            className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebarbar */}
            <aside className="hidden lg:flex flex-col bg-card/60 backdrop-blur-md border-r border-border/60 h-screen sticky top-0 overflow-hidden transition-all duration-300 flex-shrink-0"
                style={{ width: collapsed ? 72 : 260 }}>
                <SidebarContent />
            </aside>

            {/* Mobile overlay + drawer */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onMobileClose} />
                    <aside className="fixed left-0 top-0 bottom-0 z-50 bg-card border-r border-border/60 lg:hidden overflow-hidden">
                        <SidebarContent mobile />
                    </aside>
                </>
            )}
        </>
    );
}
