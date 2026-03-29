import { useState, createContext, useContext, ReactNode, useCallback } from 'react';

export interface Notification {
    id: string;
    title: string;
    body: string;
    type: 'success' | 'warning' | 'info' | 'error';
    read: boolean;
    ts: Date;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (n: Omit<Notification, 'id' | 'read' | 'ts'>) => void;
    markAllRead: () => void;
    markRead: (id: string) => void;
    dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const INITIAL: Notification[] = [
    {
        id: 'n1',
        title: 'Deposit Confirmed',
        body: '$5,000 deposit to Balanced Growth Fund has been confirmed and is now invested.',
        type: 'success',
        read: false,
        ts: new Date(Date.now() - 1000 * 60 * 15),
        link: '/transactions',
    },
    {
        id: 'n2',
        title: 'Monthly Yield Paid',
        body: 'Your DeFi Yield Optimizer paid $328.50 in yield earnings this month.',
        type: 'success',
        read: false,
        ts: new Date(Date.now() - 1000 * 60 * 60 * 3),
        link: '/transactions',
    },
    {
        id: 'n3',
        title: 'KYC Approved',
        body: 'Your identity verification has been approved. All features are now unlocked.',
        type: 'success',
        read: true,
        ts: new Date(Date.now() - 1000 * 60 * 60 * 24),
        link: '/settings',
    },
    {
        id: 'n4',
        title: 'Portfolio Alert',
        body: 'BTC dropped more than 5% in the last hour. Your AI Alpha Fund has auto-rebalanced.',
        type: 'warning',
        read: true,
        ts: new Date(Date.now() - 1000 * 60 * 60 * 48),
        link: '/portfolio',
    },
    {
        id: 'n5',
        title: 'New Feature: Auto-Invest',
        body: 'Set up recurring investments with our new DCA scheduler on the Invest page.',
        type: 'info',
        read: true,
        ts: new Date(Date.now() - 1000 * 60 * 60 * 72),
        link: '/invest',
    },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL);

    const addNotification = useCallback((n: Omit<Notification, 'id' | 'read' | 'ts'>) => {
        setNotifications(prev => [{
            ...n,
            id: `n-${Date.now()}`,
            read: false,
            ts: new Date(),
        }, ...prev]);
    }, []);

    const markRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const dismiss = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount: notifications.filter(n => !n.read).length,
            addNotification,
            markAllRead,
            markRead,
            dismiss,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
    return ctx;
}
