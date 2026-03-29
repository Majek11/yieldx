import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, LayoutDashboard, PieChart, TrendingUp, Wallet, History,
    Settings, Gift, Shield, LogOut, Moon, Sun, X, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Command {
    id: string;
    label: string;
    description?: string;
    icon: React.ElementType;
    action: () => void;
    category: string;
    keywords?: string[];
}

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
    onToggleTheme: () => void;
    isDark: boolean;
}

export default function CommandPalette({ open, onClose, onToggleTheme, isDark }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);

    const go = (path: string) => { navigate(path); onClose(); };

    const commands: Command[] = [
        { id: 'dashboard', label: 'Dashboard', description: 'Portfolio overview', icon: LayoutDashboard, action: () => go('/dashboard'), category: 'Navigate', keywords: ['home', 'overview'] },
        { id: 'portfolio', label: 'Portfolio', description: 'Holdings & performance', icon: PieChart, action: () => go('/portfolio'), category: 'Navigate' },
        { id: 'invest', label: 'Invest', description: 'Browse investment funds', icon: TrendingUp, action: () => go('/invest'), category: 'Navigate' },
        { id: 'wallet', label: 'Wallet', description: 'Deposit & withdraw', icon: Wallet, action: () => go('/wallet'), category: 'Navigate' },
        { id: 'transactions', label: 'Transactions', description: 'Transaction history', icon: History, action: () => go('/transactions'), category: 'Navigate' },
        { id: 'settings', label: 'Settings', description: 'Account preferences', icon: Settings, action: () => go('/settings'), category: 'Navigate' },
        { id: 'referral', label: 'Referral', description: 'Earn rewards', icon: Gift, action: () => go('/referral'), category: 'Navigate' },
        { id: 'deposit', label: 'Deposit Funds', description: 'Add funds to your account', icon: Wallet, action: () => go('/wallet'), category: 'Actions', keywords: ['add money', 'fund'] },
        { id: 'withdraw', label: 'Withdraw Funds', description: 'Withdraw to external wallet', icon: Wallet, action: () => { go('/wallet'); }, category: 'Actions', keywords: ['cash out'] },
        { id: 'kyc', label: 'Complete KYC', description: 'Verify your identity', icon: Shield, action: () => go('/settings'), category: 'Actions', keywords: ['verify', 'identity'] },
        { id: 'theme', label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', description: 'Toggle colour theme', icon: isDark ? Sun : Moon, action: () => { onToggleTheme(); onClose(); }, category: 'Preferences' },
        { id: 'logout', label: 'Sign Out', description: 'Log out of your account', icon: LogOut, action: () => { logout(); go('/login'); }, category: 'Account' },
    ];

    const filtered = query.trim()
        ? commands.filter(c =>
            c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.description?.toLowerCase().includes(query.toLowerCase()) ||
            c.keywords?.some(k => k.toLowerCase().includes(query.toLowerCase()))
        )
        : commands;

    const grouped = filtered.reduce<Record<string, Command[]>>((acc, c) => {
        if (!acc[c.category]) acc[c.category] = [];
        acc[c.category].push(c);
        return acc;
    }, {});

    const [selectedIdx, setSelectedIdx] = useState(0);
    const flatFiltered = filtered;

    useEffect(() => {
        if (open) { setQuery(''); setSelectedIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
    }, [open]);

    useEffect(() => { setSelectedIdx(0); }, [query]);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, flatFiltered.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
        if (e.key === 'Enter') { e.preventDefault(); flatFiltered[selectedIdx]?.action(); }
        if (e.key === 'Escape') onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Search commands…"
                        className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <kbd className="hidden sm:flex items-center gap-1 text-muted-foreground/50 text-[10px] font-mono bg-secondary/60 border border-border/40 rounded px-1.5 py-0.5">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto py-2">
                    {Object.entries(grouped).map(([category, cmds]) => (
                        <div key={category}>
                            <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{category}</p>
                            {cmds.map(cmd => {
                                const globalIdx = flatFiltered.findIndex(c => c.id === cmd.id);
                                const isSelected = globalIdx === selectedIdx;
                                return (
                                    <button
                                        key={cmd.id}
                                        onClick={cmd.action}
                                        onMouseEnter={() => setSelectedIdx(globalIdx)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected ? 'bg-primary/10 text-foreground' : 'hover:bg-secondary/40 text-foreground'}`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary/20' : 'bg-secondary/60'}`}>
                                            <cmd.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{cmd.label}</p>
                                            {cmd.description && <p className="text-muted-foreground text-xs truncate">{cmd.description}</p>}
                                        </div>
                                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="py-8 text-center">
                            <p className="text-muted-foreground text-sm">No results for "<span className="text-foreground">{query}</span>"</p>
                        </div>
                    )}
                </div>

                <div className="px-4 py-2.5 border-t border-border/50 flex items-center gap-4 text-[10px] text-muted-foreground/50">
                    <span className="flex items-center gap-1"><kbd className="font-mono bg-secondary/60 border border-border/40 rounded px-1">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1"><kbd className="font-mono bg-secondary/60 border border-border/40 rounded px-1">↵</kbd> Select</span>
                    <span className="flex items-center gap-1"><kbd className="font-mono bg-secondary/60 border border-border/40 rounded px-1">ESC</kbd> Close</span>
                </div>
            </div>
        </div>
    );
}
