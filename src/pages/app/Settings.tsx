import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Shield, Bell, Key, ChevronRight, Check, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import TwoFactorAuth from '@/components/TwoFactorAuth';
import KycWizard from '@/components/KycWizard';

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'kyc', label: 'Verification', icon: ShieldAlert },
    { id: 'notifications', label: 'Notifications', icon: Bell },
];


export default function Settings() {
    const { user, updateUser } = useAuth();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'profile');
    const [name, setName] = useState(user?.name ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [saving, setSaving] = useState(false);
    const [notifications, setNotifications] = useState({
        trades: true,
        deposits: true,
        news: false,
        yields: true,
        security: true,
    });

    const handleSaveProfile = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        updateUser({ name, phone });
        setSaving(false);
        toast.success('Profile updated!');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Tab sidebar */}
                <div className="sm:w-52 flex-shrink-0">
                    <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-2 space-y-1">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setActiveTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab === id ? 'bg-primary/15 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}>
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 space-y-6">
                    {/* Profile */}
                    {activeTab === 'profile' && (
                        <>
                            <div>
                                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Profile</h3>
                                <p className="text-muted-foreground text-sm">Manage your personal information</p>
                            </div>
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                                    <span className="font-heading text-xl font-bold text-primary">
                                        {name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-foreground font-medium">{name}</p>
                                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                                    <p className="text-muted-foreground text-xs mt-0.5">
                                        Member since {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="settings-name" className="block text-sm font-medium text-foreground mb-2">Full name</label>
                                    <input id="settings-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all" />
                                </div>
                                <div>
                                    <label htmlFor="settings-email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                                    <input id="settings-email" type="email" value={user?.email ?? ''} disabled
                                        className="w-full bg-background/60 border border-border/40 rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
                                </div>
                                <div>
                                    <label htmlFor="settings-phone" className="block text-sm font-medium text-foreground mb-2">Phone number</label>
                                    <input id="settings-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000"
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all" />
                                </div>
                                <button onClick={handleSaveProfile} disabled={saving}
                                    className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2">
                                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <>
                            <div>
                                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Security</h3>
                                <p className="text-muted-foreground text-sm">Protect your account</p>
                            </div>
                            <div className="space-y-3">
                                {/* Change password row */}
                                <button
                                    className="w-full flex items-center gap-4 p-4 bg-secondary/40 hover:bg-secondary/80 border border-border/40 rounded-xl transition-colors text-left group"
                                    onClick={() => toast.info('Change password — connect to real auth to enable')}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0">
                                        <Key className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-foreground font-medium text-sm">Change Password</p>
                                        <p className="text-muted-foreground text-xs mt-0.5">Update your login password</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </button>
                                {/* Active sessions row */}
                                <button
                                    className="w-full flex items-center gap-4 p-4 bg-secondary/40 hover:bg-secondary/80 border border-border/40 rounded-xl transition-colors text-left group"
                                    onClick={() => toast.info('Session management — connect to real auth to enable')}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center flex-shrink-0">
                                        <Bell className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-foreground font-medium text-sm">Active Sessions</p>
                                        <p className="text-muted-foreground text-xs mt-0.5">1 active session · Chrome, Linux</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </button>
                            </div>
                            {/* 2FA Component */}
                            <TwoFactorAuth />
                        </>
                    )}

                    {/* KYC */}
                    {activeTab === 'kyc' && (
                        <>
                            <div>
                                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Identity Verification</h3>
                                <p className="text-muted-foreground text-sm">Required to unlock withdrawals and higher limits</p>
                            </div>

                            {/* Status badge */}
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${user?.kycStatus === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30' :
                                user?.kycStatus === 'pending' ? 'bg-amber-500/10 border-amber-500/30' :
                                    'bg-red-500/10 border-red-500/30'}`}>
                                {user?.kycStatus === 'approved'
                                    ? <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    : <ShieldAlert className="w-5 h-5 text-amber-400" />}
                                <div>
                                    <p className={`text-sm font-medium capitalize ${user?.kycStatus === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {user?.kycStatus === 'not_started' ? 'Not Started' : user?.kycStatus}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {user?.kycStatus === 'approved' ? 'Full access unlocked — withdrawals enabled' :
                                            user?.kycStatus === 'pending' ? 'Under review — typically 24h' :
                                                'Complete verification to enable withdrawals'}
                                    </p>
                                </div>
                            </div>

                            {user?.kycStatus !== 'approved' && user?.kycStatus !== 'pending' && (
                                <KycWizard onSubmit={() => { updateUser({ kycStatus: 'pending' }); toast.success("KYC submitted! We'll review within 24 hours."); }} />
                            )}
                        </>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <>
                            <div>
                                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Notifications</h3>
                                <p className="text-muted-foreground text-sm">Choose what updates you receive</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { key: 'trades', label: 'Trade Confirmations', desc: 'When the AI executes a trade in your portfolio' },
                                    { key: 'deposits', label: 'Deposits & Withdrawals', desc: 'Confirmation when funds move in or out' },
                                    { key: 'yields', label: 'Yield Rewards', desc: 'When DeFi rewards are distributed' },
                                    { key: 'security', label: 'Security Alerts', desc: 'New logins, password changes, suspicious activity' },
                                    { key: 'news', label: 'Market News', desc: 'Weekly crypto market insights and reports' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-secondary/40 rounded-xl border border-border/40">
                                        <div>
                                            <p className="text-foreground font-medium text-sm">{label}</p>
                                            <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
                                                toast.success('Preference saved');
                                            }}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${notifications[key as keyof typeof notifications] ? 'bg-primary' : 'bg-border'
                                                }`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${notifications[key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
