import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
    Users, DollarSign, TrendingUp, ShieldCheck, LogOut, LayoutDashboard,
    Activity, FileCheck, Settings, Bell, Search, ChevronDown, ArrowUpRight,
    ArrowDownRight, MoreVertical, CheckCircle, XCircle, Clock, Eye,
    Ban, RefreshCw, Menu, X, Wallet, PieChart, List, Megaphone, Gift,
    Plus, Save, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';

/* ─── Mock data ─────────────────────────────────────────────────── */
const stats = [
    { label: 'Total Users', value: '52,841', change: '+12.4%', up: true, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Assets Under Management', value: '$2.41B', change: '+8.7%', up: true, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Monthly Revenue', value: '$1.24M', change: '+21.3%', up: true, icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { label: 'Pending KYC', value: '318', change: '-5.2%', up: false, icon: FileCheck, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const users = [
    { id: 'USR-001', name: 'Sarah Chen', email: 'sarah@example.com', aum: '$38,400', kyc: 'approved', status: 'active', joined: 'Mar 10, 2026', risk: 'Moderate' },
    { id: 'USR-002', name: 'Marcus Webb', email: 'marcus@example.com', aum: '$210,000', kyc: 'approved', status: 'active', joined: 'Feb 28, 2026', risk: 'Aggressive' },
    { id: 'USR-003', name: 'Priya Patel', email: 'priya@example.com', aum: '$14,850', kyc: 'pending', status: 'active', joined: 'Mar 15, 2026', risk: 'Conservative' },
    { id: 'USR-004', name: 'James Hartley', email: 'james@example.com', aum: '$1,200,000', kyc: 'approved', status: 'active', joined: 'Jan 5, 2026', risk: 'Aggressive' },
    { id: 'USR-005', name: 'Nina Kowalski', email: 'nina@example.com', aum: '$8,200', kyc: 'rejected', status: 'suspended', joined: 'Mar 20, 2026', risk: 'Moderate' },
    { id: 'USR-006', name: 'Omar Al-Rashid', email: 'omar@example.com', aum: '$95,000', kyc: 'pending', status: 'active', joined: 'Mar 1, 2026', risk: 'Moderate' },
    { id: 'USR-007', name: 'Elena Vasquez', email: 'elena@example.com', aum: '$52,100', kyc: 'approved', status: 'active', joined: 'Feb 14, 2026', risk: 'Moderate' },
    { id: 'USR-008', name: 'Ryan Mitchell', email: 'ryan@example.com', aum: '$26,750', kyc: 'not_started', status: 'active', joined: 'Mar 25, 2026', risk: 'Conservative' },
];

const transactions = [
    { id: 'TXN-9841', user: 'James Hartley', type: 'Deposit', amount: '+$50,000', method: 'Wire Transfer', status: 'completed', date: 'Mar 28, 2026' },
    { id: 'TXN-9840', user: 'Sarah Chen', type: 'Withdrawal', amount: '-$5,000', method: 'Bank Transfer', status: 'completed', date: 'Mar 28, 2026' },
    { id: 'TXN-9839', user: 'Priya Patel', type: 'Deposit', amount: '+$2,500', method: 'Card', status: 'pending', date: 'Mar 27, 2026' },
    { id: 'TXN-9838', user: 'Omar Al-Rashid', type: 'Deposit', amount: '+$15,000', method: 'Crypto', status: 'completed', date: 'Mar 27, 2026' },
    { id: 'TXN-9837', user: 'Nina Kowalski', type: 'Withdrawal', amount: '-$8,200', method: 'Bank Transfer', status: 'failed', date: 'Mar 26, 2026' },
];

const kycQueue = [
    {
        id: 'KYC-501', name: 'Priya Patel', email: 'priya@example.com', submitted: '2 hours ago', country: 'India', docType: 'Passport', dob: '1990-04-12', nationality: 'Indian',
        docFront: 'https://images.unsplash.com/photo-1550565118-3a14e8d0386f?w=600&q=80',
        docBack: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
        selfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
        id: 'KYC-502', name: 'Omar Al-Rashid', email: 'omar@example.com', submitted: '5 hours ago', country: 'UAE', docType: 'National ID', dob: '1985-11-30', nationality: 'Emirati',
        docFront: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80',
        docBack: null,
        selfie: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    },
    {
        id: 'KYC-503', name: 'Yuki Tanaka', email: 'yuki@example.com', submitted: '1 day ago', country: 'Japan', docType: 'Passport', dob: '1995-07-08', nationality: 'Japanese',
        docFront: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600&q=80',
        docBack: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
        selfie: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    },
    {
        id: 'KYC-504', name: 'Carlos Mendez', email: 'carlos@example.com', submitted: '1 day ago', country: 'Mexico', docType: "Driver's Licence", dob: '1988-02-14', nationality: 'Mexican',
        docFront: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=600&q=80',
        docBack: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80',
        selfie: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
];
type KycEntry = typeof kycQueue[number];

/* ─── Sub-components ────────────────────────────────────────────── */
const kycBadge = (status: string) => {
    const map: Record<string, string> = {
        approved: 'bg-emerald-500/15 text-emerald-400',
        pending: 'bg-amber-500/15 text-amber-400',
        rejected: 'bg-red-500/15 text-red-400',
        not_started: 'bg-border/60 text-muted-foreground',
    };
    const labels: Record<string, string> = { approved: 'Approved', pending: 'Pending', rejected: 'Rejected', not_started: 'Not Started' };
    return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${map[status]}`}>{labels[status]}</span>;
};

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        completed: 'bg-emerald-500/15 text-emerald-400',
        pending: 'bg-amber-500/15 text-amber-400',
        failed: 'bg-red-500/15 text-red-400',
        active: 'bg-emerald-500/15 text-emerald-400',
        suspended: 'bg-red-500/15 text-red-400',
    };
    return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${map[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

/* ─── Extra mock data ─── */
const revenueData = [
    { month: 'Oct', revenue: 820000, users: 38200 },
    { month: 'Nov', revenue: 940000, users: 41800 },
    { month: 'Dec', revenue: 1080000, users: 44200 },
    { month: 'Jan', revenue: 1150000, users: 46900 },
    { month: 'Feb', revenue: 1200000, users: 49700 },
    { month: 'Mar', revenue: 1240000, users: 52841 },
];

const auditLog = [
    { id: 'AL-001', user: 'admin@yieldx.io', action: 'Approved KYC for Priya Patel', ip: '192.168.1.1', ts: 'Mar 28, 2026 14:32' },
    { id: 'AL-002', user: 'admin@yieldx.io', action: 'Rejected KYC for Carlos Mendez', ip: '192.168.1.1', ts: 'Mar 28, 2026 13:55' },
    { id: 'AL-003', user: 'system', action: 'Auto-rebalance triggered for AI Alpha Fund', ip: 'internal', ts: 'Mar 28, 2026 12:00' },
    { id: 'AL-004', user: 'admin@yieldx.io', action: 'Updated ETH deposit address', ip: '192.168.1.1', ts: 'Mar 27, 2026 18:10' },
    { id: 'AL-005', user: 'system', action: 'Yield payout processed: $328,420 distributed', ip: 'internal', ts: 'Mar 27, 2026 00:00' },
    { id: 'AL-006', user: 'admin@yieldx.io', action: 'Created announcement: Q1 2026 Report', ip: '192.168.1.1', ts: 'Mar 26, 2026 10:44' },
];

/* ─── Admin Layout ───────────────────────────────────────────────── */
const navItems = [
    { label: 'Overview', icon: LayoutDashboard, tab: 'overview' },
    { label: 'Users', icon: Users, tab: 'users' },
    { label: 'Transactions', icon: Activity, tab: 'transactions' },
    { label: 'KYC Queue', icon: FileCheck, tab: 'kyc' },
    { label: 'Funds', icon: Wallet, tab: 'funds' },
    { label: 'Analytics', icon: PieChart, tab: 'analytics' },
    { label: 'Plans', icon: List, tab: 'plans' },
    { label: 'Wallet Config', icon: Settings, tab: 'walletconfig' },
    { label: 'Announcements', icon: Megaphone, tab: 'announcements' },
    { label: 'Audit Log', icon: ShieldCheck, tab: 'audit' },
    { label: 'Bonuses', icon: Gift, tab: 'bonuses' },
];

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingKyc, setViewingKyc] = useState<KycEntry | null>(null);
    const [kycDocTab, setKycDocTab] = useState<'front' | 'back' | 'selfie'>('front');
    const [kycStatuses, setKycStatuses] = useState<Record<string, string>>({});
    // Plans state
    const [plans, setPlans] = useState([
        { id: 'p1', name: 'Conservative Crypto', minInvestment: 100, expectedReturn: '15-25%', duration: '3 months', risk: 'Low', active: true },
        { id: 'p2', name: 'Balanced Growth', minInvestment: 500, expectedReturn: '40-70%', duration: '6 months', risk: 'Moderate', active: true },
        { id: 'p3', name: 'AI Alpha Fund', minInvestment: 1000, expectedReturn: '120-200%', duration: '12 months', risk: 'Aggressive', active: true },
        { id: 'p4', name: 'DeFi Yield Optimizer', minInvestment: 250, expectedReturn: '60-100%', duration: '6 months', risk: 'Moderate-High', active: true },
    ]);
    // Wallet config state
    const [walletAddresses, setWalletAddresses] = useState<Record<string, string>>({
        eth: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        sol: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKH',
        usdt: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
        bnb: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    });
    const [savedAddr, setSavedAddr] = useState(false);
    // Announcements state
    const [announcements, setAnnouncements] = useState([
        { id: 'a1', title: 'Q1 2026 Performance Report', body: 'AI Alpha Fund returned +184% YTD. Full report available in your dashboard.', type: 'info', active: true, date: 'Mar 26, 2026' },
        { id: 'a2', title: 'Scheduled Maintenance', body: 'Platform will be in read-only mode on Apr 1, 2026 from 02:00–04:00 UTC.', type: 'warning', active: true, date: 'Mar 25, 2026' },
    ]);
    const [newAnnTitle, setNewAnnTitle] = useState('');
    const [newAnnBody, setNewAnnBody] = useState('');
    const [newAnnType, setNewAnnType] = useState('info');
    // Bonuses state
    const [bonuses, setBonuses] = useState([
        { id: 'b1', user: 'Sarah Chen', email: 'sarah@example.com', amount: 250, reason: 'Referral bonus', date: 'Mar 20, 2026', status: 'paid' },
        { id: 'b2', user: 'Marcus Webb', email: 'marcus@example.com', amount: 500, reason: 'Performance milestone', date: 'Mar 15, 2026', status: 'paid' },
        { id: 'b3', user: 'Omar Al-Rashid', email: 'omar@example.com', amount: 100, reason: 'Referral bonus', date: 'Mar 28, 2026', status: 'pending' },
    ]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const approveKyc = (id: string) => setKycStatuses(p => ({ ...p, [id]: 'approved' }));
    const rejectKyc = (id: string) => setKycStatuses(p => ({ ...p, [id]: 'rejected' }));

    /* ─── KYC Doc Viewer Modal ─── */
    const KycDocModal = () => {
        if (!viewingKyc) return null;
        const k = viewingKyc;
        const alreadyDecided = !!kycStatuses[k.id];
        const images: Record<string, string | null> = { front: k.docFront, back: k.docBack, selfie: k.selfie };
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingKyc(null)} />
                <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold font-heading">{k.name.charAt(0)}</div>
                            <div>
                                <p className="text-foreground font-semibold text-sm">{k.name}</p>
                                <p className="text-muted-foreground text-xs">{k.email} · {k.country} · {k.docType}</p>
                            </div>
                        </div>
                        <button onClick={() => setViewingKyc(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Details row */}
                    <div className="flex gap-6 px-5 py-3 border-b border-border/40 bg-secondary/20 text-xs flex-shrink-0">
                        {[
                            { label: 'KYC ID', value: k.id },
                            { label: 'DOB', value: k.dob },
                            { label: 'Nationality', value: k.nationality },
                            { label: 'Submitted', value: k.submitted },
                        ].map(r => (
                            <div key={r.label}>
                                <p className="text-muted-foreground">{r.label}</p>
                                <p className="text-foreground font-semibold mt-0.5">{r.value}</p>
                            </div>
                        ))}
                    </div>
                    {/* Doc tabs */}
                    <div className="flex gap-1 px-5 pt-4 flex-shrink-0">
                        {([['front', 'Document Front'], ['back', 'Document Back'], ['selfie', 'Selfie with ID']] as const).map(([id, lbl]) => (
                            k.docBack !== null || id !== 'back' ? (
                                <button key={id} onClick={() => setKycDocTab(id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${kycDocTab === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-secondary'}`}>
                                    {lbl}
                                </button>
                            ) : null
                        ))}
                    </div>
                    {/* Image */}
                    <div className="flex-1 overflow-auto p-5">
                        {images[kycDocTab] ? (
                            <div className="relative">
                                <img src={images[kycDocTab]!} alt={kycDocTab}
                                    className="w-full rounded-xl border border-border/40 object-cover max-h-80" />
                                {kycDocTab === 'selfie' && (
                                    <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                                        <p className="text-amber-400 text-xs">⚠️ Verify that the person in the selfie matches the identity document and is clearly holding it beside their face.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 bg-secondary/30 rounded-xl">
                                <p className="text-muted-foreground text-sm">No back document provided (single-page document)</p>
                            </div>
                        )}
                    </div>
                    {/* Actions */}
                    <div className="px-5 py-4 border-t border-border/50 flex gap-3 flex-shrink-0">
                        {alreadyDecided ? (
                            <div className={`flex-1 text-center py-2.5 rounded-xl text-sm font-medium ${kycStatuses[k.id] === 'approved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                {kycStatuses[k.id] === 'approved' ? '✓ Approved' : '✗ Rejected'}
                            </div>
                        ) : (
                            <>
                                <button onClick={() => { rejectKyc(k.id); setViewingKyc(null); }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                                <button onClick={() => { approveKyc(k.id); setViewingKyc(null); }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                                    <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Sidebar = () => (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-card/90 backdrop-blur-lg border-r border-border/50
            flex flex-col transition-transform duration-300
            lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Logo */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                            <path d="M12 2L4 8V16L12 22L20 16V8L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                            <path d="M12 8L8 11V15L12 18L16 15V11L12 8Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <span className="font-heading text-base font-semibold text-foreground">YieldX</span>
                        <span className="block text-xs text-primary font-medium -mt-0.5">Admin Panel</span>
                    </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <button
                        key={item.tab}
                        onClick={() => { setTab(item.tab); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${tab === item.tab
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                            }`}
                    >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {item.label}
                        {item.tab === 'kyc' && (
                            <span className="ml-auto bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full">
                                {kycQueue.filter(k => !kycStatuses[k.id]).length}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* User footer */}
            <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-foreground text-xs font-semibold truncate">{user?.name}</p>
                        <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" /> Sign out
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {viewingKyc && <KycDocModal />}
            <Sidebar />

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50 px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="font-heading text-lg font-semibold text-foreground capitalize">{tab === 'kyc' ? 'KYC Queue' : tab}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="flex items-center gap-2 bg-secondary/60 border border-border/50 rounded-xl px-3 py-1.5">
                            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                {user?.name.charAt(0)}
                            </div>
                            <span className="text-foreground text-sm font-medium hidden sm:block">{user?.name}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 space-y-6">

                    {/* ──── OVERVIEW ──── */}
                    {tab === 'overview' && (
                        <>
                            {/* Stats grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                {stats.map((s) => (
                                    <div key={s.label} className="bg-card/60 border border-border/50 rounded-2xl p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                                <s.icon className={`w-5 h-5 ${s.color}`} />
                                            </div>
                                            <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {s.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                                {s.change}
                                            </span>
                                        </div>
                                        <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                                        <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent transactions + KYC queue */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {/* Recent txns */}
                                <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                                        <h2 className="font-heading text-sm font-semibold text-foreground">Recent Transactions</h2>
                                        <button onClick={() => setTab('transactions')} className="text-primary text-xs hover:text-primary/80 transition-colors">View all</button>
                                    </div>
                                    <div className="divide-y divide-border/30">
                                        {transactions.map((tx) => (
                                            <div key={tx.id} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/20 transition-colors">
                                                <div>
                                                    <p className="text-foreground text-xs font-medium">{tx.user}</p>
                                                    <p className="text-muted-foreground text-xs">{tx.id} · {tx.type}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-semibold font-heading ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount}</p>
                                                    {statusBadge(tx.status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* KYC queue mini */}
                                <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                                        <h2 className="font-heading text-sm font-semibold text-foreground">KYC Pending</h2>
                                        <button onClick={() => setTab('kyc')} className="text-primary text-xs hover:text-primary/80 transition-colors">View all</button>
                                    </div>
                                    <div className="divide-y divide-border/30">
                                        {kycQueue.map((k) => (
                                            <div key={k.id} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/20 transition-colors">
                                                <div>
                                                    <p className="text-foreground text-xs font-medium">{k.name}</p>
                                                    <p className="text-muted-foreground text-xs">{k.country} · {k.docType} · {k.submitted}</p>
                                                </div>
                                                {kycStatuses[k.id] ? (
                                                    kycStatuses[k.id] === 'approved'
                                                        ? <span className="text-xs text-emerald-400 font-medium">Approved</span>
                                                        : <span className="text-xs text-red-400 font-medium">Rejected</span>
                                                ) : (
                                                    <div className="flex gap-1.5">
                                                        <button onClick={() => approveKyc(k.id)} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Approve">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => rejectKyc(k.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Reject">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ──── USERS ──── */}
                    {tab === 'users' && (
                        <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border/40">
                                <h2 className="font-heading text-sm font-semibold text-foreground">All Users ({users.length})</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search users…"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-background/80 border border-border/60 rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all w-52"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/40 bg-secondary/20">
                                            {['User', 'AUM', 'Strategy', 'KYC', 'Status', 'Joined', ''].map((h) => (
                                                <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-secondary/20 transition-colors group">
                                                <td className="px-5 py-3.5">
                                                    <div>
                                                        <p className="text-foreground text-xs font-semibold">{u.name}</p>
                                                        <p className="text-muted-foreground text-xs">{u.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="font-heading text-xs font-semibold text-foreground">{u.aum}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-muted-foreground text-xs">{u.risk}</span>
                                                </td>
                                                <td className="px-5 py-3.5">{kycBadge(u.kyc)}</td>
                                                <td className="px-5 py-3.5">{statusBadge(u.status)}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-muted-foreground text-xs">{u.joined}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all" title="View">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all" title="Suspend">
                                                            <Ban className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all" title="More">
                                                            <MoreVertical className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ──── TRANSACTIONS ──── */}
                    {tab === 'transactions' && (
                        <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                                <h2 className="font-heading text-sm font-semibold text-foreground">All Transactions</h2>
                                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs transition-colors">
                                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border/40 bg-secondary/20">
                                            {['ID', 'User', 'Type', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                                                <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                                                <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">{tx.id}</td>
                                                <td className="px-5 py-3.5 text-xs font-medium text-foreground">{tx.user}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-medium ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-red-400'}`}>{tx.type}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`font-heading text-xs font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-xs text-muted-foreground">{tx.method}</td>
                                                <td className="px-5 py-3.5">{statusBadge(tx.status)}</td>
                                                <td className="px-5 py-3.5 text-xs text-muted-foreground">{tx.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ──── KYC QUEUE ──── */}
                    {tab === 'kyc' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Pending Review', value: kycQueue.filter(k => !kycStatuses[k.id]).length, color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
                                    { label: 'Approved Today', value: Object.values(kycStatuses).filter(s => s === 'approved').length, color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle },
                                    { label: 'Rejected Today', value: Object.values(kycStatuses).filter(s => s === 'rejected').length, color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
                                ].map((s) => (
                                    <div key={s.label} className="bg-card/60 border border-border/50 rounded-2xl p-5 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                            <s.icon className={`w-5 h-5 ${s.color}`} />
                                        </div>
                                        <div>
                                            <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                                            <p className="text-muted-foreground text-xs">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-border/40">
                                    <h2 className="font-heading text-sm font-semibold text-foreground">KYC Applications</h2>
                                </div>
                                <div className="divide-y divide-border/30">
                                    {kycQueue.map((k) => (
                                        <div key={k.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm flex-shrink-0">
                                                    {k.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-foreground text-sm font-semibold">{k.name}</p>
                                                    <p className="text-muted-foreground text-xs">{k.email}</p>
                                                    <div className="flex gap-3 mt-1">
                                                        <span className="text-xs text-muted-foreground">{k.id}</span>
                                                        <span className="text-xs text-muted-foreground">·</span>
                                                        <span className="text-xs text-muted-foreground">{k.country}</span>
                                                        <span className="text-xs text-muted-foreground">·</span>
                                                        <span className="text-xs text-muted-foreground">{k.docType}</span>
                                                        <span className="text-xs text-muted-foreground">·</span>
                                                        <span className="text-xs text-muted-foreground">{k.submitted}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {kycStatuses[k.id] ? (
                                                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${kycStatuses[k.id] === 'approved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                                    {kycStatuses[k.id] === 'approved' ? '✓ Approved' : '✗ Rejected'}
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => { setKycDocTab('front'); setViewingKyc(k); }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/60 border border-border/50 text-muted-foreground hover:text-foreground rounded-xl text-xs transition-all">
                                                        <Eye className="w-3.5 h-3.5" /> View Docs
                                                    </button>
                                                    <button onClick={() => approveKyc(k.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-xs font-medium transition-all">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                    </button>
                                                    <button onClick={() => rejectKyc(k.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-medium transition-all">
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ──── FUNDS ──── */}
                    {tab === 'funds' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[
                                { name: 'AI Alpha Fund', aum: '$890M', investors: '12,841', ytd: '+184.2%', status: 'Active', risk: 'Aggressive' },
                                { name: 'Balanced Growth', aum: '$1.1B', investors: '24,210', ytd: '+67.5%', status: 'Active', risk: 'Moderate' },
                                { name: 'DeFi Yield Optimizer', aum: '$340M', investors: '8,622', ytd: '+93.1%', status: 'Active', risk: 'Moderate-High' },
                                { name: 'Conservative Crypto', aum: '$620M', investors: '15,430', ytd: '+24.8%', status: 'Active', risk: 'Low' },
                            ].map((f) => (
                                <div key={f.name} className="bg-card/60 border border-border/50 rounded-2xl p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-heading text-base font-semibold text-foreground">{f.name}</h3>
                                            <span className="text-xs text-muted-foreground">{f.risk} Risk</span>
                                        </div>
                                        <span className="text-xs font-medium bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full">{f.status}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/40">
                                        <div>
                                            <p className="font-heading text-lg font-bold text-foreground">{f.aum}</p>
                                            <p className="text-muted-foreground text-xs">AUM</p>
                                        </div>
                                        <div>
                                            <p className="font-heading text-lg font-bold text-emerald-400">{f.ytd}</p>
                                            <p className="text-muted-foreground text-xs">YTD Return</p>
                                        </div>
                                        <div>
                                            <p className="font-heading text-lg font-bold text-foreground">{f.investors}</p>
                                            <p className="text-muted-foreground text-xs">Investors</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ──── ANALYTICS ──── */}
                    {tab === 'analytics' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="bg-card/60 border border-border/50 rounded-2xl p-5">
                                    <h2 className="font-heading text-sm font-semibold text-foreground mb-4">Monthly Revenue (USD)</h2>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={55} />
                                            <Tooltip formatter={(v: number) => [`$${(v / 1000).toFixed(0)}K`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                                            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="bg-card/60 border border-border/50 rounded-2xl p-5">
                                    <h2 className="font-heading text-sm font-semibold text-foreground mb-4">User Growth</h2>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={revenueData}>
                                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={40} />
                                            <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Users']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                                            <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: 'Avg. Investment', value: '$4,563', change: '+8.1%' },
                                    { label: 'Conversion Rate', value: '18.4%', change: '+2.3%' },
                                    { label: 'Churn Rate', value: '1.2%', change: '-0.4%' },
                                    { label: 'NPS Score', value: '72', change: '+5' },
                                ].map(s => (
                                    <div key={s.label} className="bg-card/60 border border-border/50 rounded-2xl p-4">
                                        <p className="text-muted-foreground text-xs">{s.label}</p>
                                        <p className="font-heading text-xl font-bold text-foreground mt-1">{s.value}</p>
                                        <p className="text-emerald-400 text-xs mt-0.5">{s.change} MoM</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ──── PLANS ──── */}
                    {tab === 'plans' && (
                        <div className="space-y-4 max-w-4xl">
                            <div className="flex items-center justify-between">
                                <h2 className="font-heading text-sm font-semibold text-foreground">Investment Plans</h2>
                            </div>
                            {plans.map(plan => (
                                <div key={plan.id} className="bg-card/60 border border-border/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div>
                                            <p className="text-muted-foreground text-xs">Plan Name</p>
                                            <input defaultValue={plan.name} className="bg-transparent border-b border-border/40 text-foreground text-sm font-semibold focus:outline-none focus:border-primary/60 w-full py-0.5" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Min. Investment</p>
                                            <input defaultValue={`$${plan.minInvestment}`} className="bg-transparent border-b border-border/40 text-foreground text-sm focus:outline-none focus:border-primary/60 w-full py-0.5" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Expected Return</p>
                                            <input defaultValue={plan.expectedReturn} className="bg-transparent border-b border-border/40 text-foreground text-sm focus:outline-none focus:border-primary/60 w-full py-0.5" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Duration</p>
                                            <input defaultValue={plan.duration} className="bg-transparent border-b border-border/40 text-foreground text-sm focus:outline-none focus:border-primary/60 w-full py-0.5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${plan.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-secondary text-muted-foreground'}`}>{plan.active ? 'Active' : 'Inactive'}</span>
                                        <button onClick={() => setPlans(p => p.map(x => x.id === plan.id ? { ...x, active: !x.active } : x))} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                                            {plan.active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => setPlans(p => p.filter(x => x.id !== plan.id))} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setPlans(p => [...p, { id: `p${Date.now()}`, name: 'New Plan', minInvestment: 100, expectedReturn: '10-20%', duration: '3 months', risk: 'Low', active: false }])}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-sm transition-all">
                                <Plus className="w-4 h-4" /> Add New Plan
                            </button>
                        </div>
                    )}

                    {/* ──── WALLET CONFIG ──── */}
                    {tab === 'walletconfig' && (
                        <div className="space-y-4 max-w-2xl">
                            <div>
                                <h2 className="font-heading text-sm font-semibold text-foreground">Deposit Wallet Addresses</h2>
                                <p className="text-muted-foreground text-xs mt-1">Configure the addresses users will send deposits to. Changes take effect immediately.</p>
                            </div>
                            {[{ id: 'eth', label: 'Ethereum (ERC-20)', symbol: 'ETH' }, { id: 'btc', label: 'Bitcoin', symbol: 'BTC' }, { id: 'sol', label: 'Solana (SPL)', symbol: 'SOL' }, { id: 'usdt', label: 'USDT (TRC-20)', symbol: 'USDT' }, { id: 'bnb', label: 'BNB Smart Chain', symbol: 'BNB' }].map(c => (
                                <div key={c.id} className="bg-card/60 border border-border/50 rounded-2xl p-4 space-y-2">
                                    <label className="text-foreground text-sm font-semibold">{c.label}</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={walletAddresses[c.id] ?? ''}
                                            onChange={e => setWalletAddresses(p => ({ ...p, [c.id]: e.target.value }))}
                                            className="flex-1 bg-background/80 border border-border rounded-xl px-3 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary/60 transition-all"
                                            placeholder={`Enter ${c.symbol} deposit address…`}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => { setSavedAddr(true); setTimeout(() => setSavedAddr(false), 2500); }}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${savedAddr ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25'}`}>
                                <Save className="w-4 h-4" />{savedAddr ? 'Saved!' : 'Save Addresses'}
                            </button>
                        </div>
                    )}

                    {/* ──── ANNOUNCEMENTS ──── */}
                    {tab === 'announcements' && (
                        <div className="space-y-5 max-w-3xl">
                            <div className="bg-card/60 border border-border/50 rounded-2xl p-5 space-y-4">
                                <h2 className="font-heading text-sm font-semibold text-foreground">New Announcement</h2>
                                <input value={newAnnTitle} onChange={e => setNewAnnTitle(e.target.value)} placeholder="Announcement title…"
                                    className="w-full bg-background/80 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all" />
                                <textarea value={newAnnBody} onChange={e => setNewAnnBody(e.target.value)} placeholder="Message body…" rows={3}
                                    className="w-full bg-background/80 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all resize-none" />
                                <div className="flex gap-3 items-center">
                                    <select value={newAnnType} onChange={e => setNewAnnType(e.target.value)}
                                        className="bg-background/80 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all">
                                        <option value="info">ℹ️ Info</option>
                                        <option value="warning">⚠️ Warning</option>
                                        <option value="success">✅ Success</option>
                                    </select>
                                    <button onClick={() => { if (!newAnnTitle.trim()) return; setAnnouncements(p => [{ id: `a${Date.now()}`, title: newAnnTitle, body: newAnnBody, type: newAnnType, active: true, date: 'Mar 28, 2026' }, ...p]); setNewAnnTitle(''); setNewAnnBody(''); }}
                                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
                                        <Megaphone className="w-4 h-4" /> Broadcast
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {announcements.map(ann => (
                                    <div key={ann.id} className="bg-card/60 border border-border/50 rounded-2xl p-4 flex gap-3">
                                        <span className="text-lg flex-shrink-0">{ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️'}</span>
                                        <div className="flex-1">
                                            <p className="text-foreground text-sm font-semibold">{ann.title}</p>
                                            <p className="text-muted-foreground text-xs mt-0.5">{ann.body}</p>
                                            <p className="text-muted-foreground/60 text-xs mt-1">{ann.date}</p>
                                        </div>
                                        <div className="flex gap-1.5 flex-shrink-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-full self-start ${ann.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-secondary text-muted-foreground'}`}>{ann.active ? 'Live' : 'Draft'}</span>
                                            <button onClick={() => setAnnouncements(p => p.filter(a => a.id !== ann.id))} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ──── AUDIT LOG ──── */}
                    {tab === 'audit' && (
                        <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
                                <h2 className="font-heading text-sm font-semibold text-foreground">Audit Log</h2>
                                <span className="text-muted-foreground text-xs">{auditLog.length} entries</span>
                            </div>
                            <div className="divide-y divide-border/30">
                                {auditLog.map(log => (
                                    <div key={log.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-foreground text-xs font-medium">{log.action}</p>
                                            <p className="text-muted-foreground text-xs">by <span className="text-primary">{log.user}</span> · IP: {log.ip}</p>
                                        </div>
                                        <span className="text-muted-foreground text-xs whitespace-nowrap flex-shrink-0">{log.ts}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ──── BONUSES ──── */}
                    {tab === 'bonuses' && (
                        <div className="space-y-4 max-w-4xl">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Total Paid', value: '$12,840', color: 'text-emerald-400' },
                                    { label: 'Pending', value: '$100', color: 'text-amber-400' },
                                    { label: 'This Month', value: '$850', color: 'text-primary' },
                                ].map(s => (
                                    <div key={s.label} className="bg-card/60 border border-border/50 rounded-2xl p-4">
                                        <p className="text-muted-foreground text-xs">{s.label}</p>
                                        <p className={`font-heading text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                                    <h2 className="font-heading text-sm font-semibold text-foreground">Bonus History</h2>
                                    <button onClick={() => setBonuses(p => [{ id: `b${Date.now()}`, user: 'New User', email: 'user@ex.com', amount: 0, reason: 'Manual bonus', date: 'Mar 28, 2026', status: 'pending' }, ...p])}
                                        className="flex items-center gap-1.5 text-primary text-xs hover:text-primary/80 transition-colors">
                                        <Plus className="w-3.5 h-3.5" /> Allocate Bonus
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead><tr className="border-b border-border/40 bg-secondary/20">
                                            {['User', 'Email', 'Amount', 'Reason', 'Date', 'Status'].map(h => (
                                                <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody className="divide-y divide-border/30">
                                            {bonuses.map(b => (
                                                <tr key={b.id} className="hover:bg-secondary/20 transition-colors">
                                                    <td className="px-5 py-3 text-xs font-medium text-foreground">{b.user}</td>
                                                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.email}</td>
                                                    <td className="px-5 py-3 text-xs font-heading font-bold text-emerald-400">${b.amount}</td>
                                                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.reason}</td>
                                                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.date}</td>
                                                    <td className="px-5 py-3">{statusBadge(b.status)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
