import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

const typeIcon: Record<string, string> = {
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️',
    error: '❌',
};

const timeAgo = (ts: Date) => {
    const diff = (Date.now() - ts.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const { notifications, unreadCount, markRead, markAllRead, dismiss } = useNotifications();
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleClick = (id: string, link?: string) => {
        markRead(id);
        if (link) { navigate(link); setOpen(false); }
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-all duration-200"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[9px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                        <div>
                            <h3 className="text-foreground text-sm font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <p className="text-muted-foreground text-xs">{unreadCount} unread</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1.5 text-primary text-xs hover:text-primary/80 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center">
                                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                                <p className="text-muted-foreground text-sm">No notifications</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleClick(n.id, n.link)}
                                    className={`relative flex gap-3 px-4 py-3 cursor-pointer group hover:bg-secondary/30 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                                >
                                    {/* Unread dot */}
                                    {!n.read && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                                    )}
                                    <span className="text-base flex-shrink-0 mt-0.5">{typeIcon[n.type]}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-foreground text-xs font-semibold leading-snug">{n.title}</p>
                                        <p className="text-muted-foreground text-xs leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-muted-foreground text-[10px]">{timeAgo(n.ts)}</span>
                                            {n.link && (
                                                <span className="text-primary text-[10px] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View <ArrowRight className="w-2.5 h-2.5" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border/50 px-4 py-2.5">
                        <button
                            onClick={() => setOpen(false)}
                            className="text-muted-foreground text-xs hover:text-foreground transition-colors w-full text-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
