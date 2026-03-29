import { useState, useRef, useEffect } from "react";
import { Bell, Check, TrendingUp, Shield, DollarSign, Zap, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notifications = [
    {
        id: "1",
        icon: TrendingUp,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10",
        title: "Portfolio up +2.5% today",
        desc: "Your AI Alpha Fund is outperforming the market.",
        time: "2 min ago",
        read: false,
        href: "/dashboard",
    },
    {
        id: "2",
        icon: DollarSign,
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
        title: "Deposit confirmed",
        desc: "$5,000 bank transfer has been credited.",
        time: "1 hour ago",
        read: false,
        href: "/wallet",
    },
    {
        id: "3",
        icon: Zap,
        iconColor: "text-teal-400",
        iconBg: "bg-teal-500/10",
        title: "DeFi yield distributed",
        desc: "+$328.50 USDC yield reward received.",
        time: "Yesterday",
        read: true,
        href: "/transactions",
    },
    {
        id: "4",
        icon: Shield,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10",
        title: "Complete identity verification",
        desc: "Unlock full platform access by completing KYC.",
        time: "2 days ago",
        read: true,
        href: "/settings",
    },
];

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(notifications);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const unread = items.filter((n) => !n.read).length;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

    const handleClick = (n: typeof notifications[0]) => {
        setItems((prev) => prev.map((item) => item.id === n.id ? { ...item, read: true } : item));
        setOpen(false);
        navigate(n.href);
    };

    return (
        <div ref={ref} className="relative">
            <button
                id="notification-bell"
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-background/60 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-heading text-sm font-semibold text-foreground">Notifications</h3>
                            {unread > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                                    {unread}
                                </span>
                            )}
                        </div>
                        {unread > 0 && (
                            <button onClick={markAll} className="flex items-center gap-1 text-primary text-xs hover:text-primary/80 transition-colors">
                                <Check className="w-3 h-3" /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="divide-y divide-border/30 max-h-80 overflow-y-auto">
                        {items.map((n) => {
                            const Icon = n.icon;
                            return (
                                <button
                                    key={n.id}
                                    onClick={() => handleClick(n)}
                                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-secondary/40 transition-colors group ${!n.read ? "bg-primary/3" : ""}`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.iconBg}`}>
                                        <Icon className={`w-4 h-4 ${n.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-xs font-medium truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                                                {n.title}
                                            </p>
                                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                                        </div>
                                        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{n.desc}</p>
                                        <p className="text-muted-foreground/60 text-xs mt-1">{n.time}</p>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0 mt-0.5" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-border/50">
                        <button onClick={() => setOpen(false)} className="text-primary text-xs hover:text-primary/80 transition-colors font-medium">
                            View all notifications →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
