import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: 'user' | 'admin';
    kycStatus: 'not_started' | 'pending' | 'approved' | 'rejected';
    avatar?: string;
    joinedAt: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

/* ──────────────────────────────────────────────
   Hardcoded demo accounts (replace with backend)
   ────────────────────────────────────────────── */
const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
    'user@yieldx.io': {
        password: 'User1234!',
        user: {
            id: 'user-001',
            email: 'user@yieldx.io',
            name: 'Alex Investor',
            phone: '+1 555 000 0001',
            role: 'user',
            kycStatus: 'approved',
            joinedAt: '2025-06-15T09:00:00Z',
        },
    },
    'admin@yieldx.io': {
        password: 'Admin1234!',
        user: {
            id: 'admin-001',
            email: 'admin@yieldx.io',
            name: 'YieldX Admin',
            phone: '+1 555 000 0099',
            role: 'admin',
            kycStatus: 'approved',
            joinedAt: '2024-01-01T00:00:00Z',
        },
    },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('yieldx_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('yieldx_user');
            }
        }
        setIsLoading(false);
    }, []);

    const persist = (u: User) => {
        localStorage.setItem('yieldx_user', JSON.stringify(u));
        setUser(u);
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 900));

        const emailLower = email.toLowerCase().trim();
        const account = DEMO_ACCOUNTS[emailLower];

        if (account && account.password === password) {
            persist(account.user);
        } else {
            // Fallback: create a generic user session for any other credentials
            const u: User = {
                id: `u-${Date.now()}`,
                email,
                name: email
                    .split('@')[0]
                    .replace(/[._-]/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
                role: 'user',
                kycStatus: 'pending',
                joinedAt: new Date().toISOString(),
            };
            persist(u);
        }
        setIsLoading(false);
    };

    const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        const u: User = {
            id: `u-${Date.now()}`,
            email: data.email,
            name: data.name,
            phone: data.phone,
            role: 'user',
            kycStatus: 'not_started',
            joinedAt: new Date().toISOString(),
        };
        persist(u);
        setIsLoading(false);
    };

    const logout = () => {
        localStorage.removeItem('yieldx_user');
        setUser(null);
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;
        const updated = { ...user, ...updates };
        persist(updated);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
