import { useState, useEffect, useRef } from 'react';
import { Plus, Moon, Sun, Search, Globe } from 'lucide-react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from '@/components/NotificationBell';
import { useTheme } from '@/contexts/ThemeContext';
import CommandPalette from '@/components/CommandPalette';

const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/portfolio': 'Portfolio',
    '/analytics': 'Analytics',
    '/invest': 'Invest',
    '/wallet': 'Wallet',
    '/transactions': 'Transactions',
    '/settings': 'Settings',
    '/referral': 'Referral',
};

interface AppTopBarProps {
    onMenuClick: () => void;
}

export default function AppTopBar({ onMenuClick }: AppTopBarProps) {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { toggleTheme, isDark } = useTheme();
    const [palette, setPalette] = useState(false);
    const [translateOpen, setTranslateOpen] = useState(false);
    const translateRef = useRef<HTMLDivElement>(null);

    const title = routeTitles[location.pathname] ?? 'YieldX';

    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'YX';

    // Global keyboard shortcut: Cmd+K / Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setPalette(p => !p);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    // Dismiss translate dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (translateRef.current && !translateRef.current.contains(e.target as Node)) {
                setTranslateOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // When translate opens, move the google_translate_element div into our container
    useEffect(() => {
        const el = document.getElementById('google_translate_element');
        const container = document.getElementById('translate-container');
        if (el && container) {
            if (translateOpen) {
                el.style.display = 'block';
                container.appendChild(el);
            } else {
                el.style.display = 'none';
                document.body.appendChild(el);
            }
        }
    }, [translateOpen]);

    return (
        <>
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 md:px-6 h-16 flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        id="mobile-menu-toggle"
                        onClick={onMenuClick}
                        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="font-heading text-lg font-semibold text-foreground">{title}</h1>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {/* Cmd+K search trigger */}
                    <button
                        id="command-palette-btn"
                        onClick={() => setPalette(true)}
                        className="hidden sm:flex items-center gap-2 bg-secondary/60 border border-border/40 hover:border-primary/30 rounded-xl px-3 py-2 text-xs text-muted-foreground/70 hover:text-muted-foreground transition-all"
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search…</span>
                        <kbd className="ml-2 font-mono bg-background/80 border border-border/60 rounded px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                    </button>

                    {/* Quick deposit */}
                    <button
                        id="quick-deposit-btn"
                        onClick={() => navigate('/wallet')}
                        className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-xs font-medium transition-all hover:shadow-md hover:shadow-primary/25 hover:-translate-y-0.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Deposit
                    </button>

                    {/* Google Translate */}
                    <div className="relative" ref={translateRef}>
                        <button
                            id="translate-btn"
                            onClick={() => setTranslateOpen(o => !o)}
                            className={`p-2 rounded-xl transition-all duration-200 ${translateOpen ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
                            aria-label="Translate page"
                            title="Translate"
                        >
                            <Globe className="w-[18px] h-[18px]" />
                        </button>
                        {translateOpen && (
                            <div className="absolute right-0 top-12 z-50 bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/40 p-4 min-w-[220px]">
                                <p className="text-foreground text-xs font-semibold mb-1">Translate Page</p>
                                <p className="text-muted-foreground text-xs mb-3">Select a language below</p>
                                <div id="translate-container" className="[&_.goog-te-gadget]:text-xs [&_select]:w-full" />
                            </div>
                        )}
                    </div>

                    {/* Theme toggle */}
                    <button
                        id="theme-toggle-btn"
                        onClick={toggleTheme}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-all duration-200"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                    </button>

                    {/* Notification bell */}
                    <NotificationBell />

                    {/* Avatar */}
                    <button
                        id="user-avatar-btn"
                        onClick={() => navigate('/settings')}
                        className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
                    >
                        <span className="font-heading text-xs font-bold text-primary">{initials}</span>
                    </button>
                </div>
            </header>

            <CommandPalette
                open={palette}
                onClose={() => setPalette(false)}
                onToggleTheme={toggleTheme}
                isDark={isDark}
            />
        </>
    );
}
