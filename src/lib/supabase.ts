import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Supabase env vars missing — running in demo mode (mock data only)');
}

export const supabase = createClient(
    supabaseUrl ?? 'https://placeholder.supabase.co',
    supabaseAnonKey ?? 'placeholder'
);

export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

/* ─── Database types ─────────────────────────────────────────── */
export type KycStatus = 'not_started' | 'pending' | 'approved' | 'rejected';
export type TxType = 'deposit' | 'withdrawal' | 'yield' | 'buy' | 'sell' | 'bonus' | 'referral';
export type TxStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type AlertCondition = 'above' | 'below';
export type RiskLevel = 'Low' | 'Moderate' | 'Moderate-High' | 'Aggressive';

export interface Profile {
    id: string;
    name: string;
    phone?: string;
    avatar_url?: string;
    kyc_status: KycStatus;
    kyc_submitted_at?: string;
    role: 'user' | 'admin';
    is_suspended: boolean;
    two_fa_enabled: boolean;
    auto_compound: boolean;
    risk_profile: 'conservative' | 'moderate' | 'aggressive';
    referral_code?: string;
    referred_by?: string;
    created_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    type: TxType;
    amount: number;
    currency: string;
    status: TxStatus;
    description?: string;
    reference?: string;
    chain_id?: string;
    wallet_address?: string;
    fee?: number;
    metadata?: Record<string, unknown>;
    confirmed_at?: string;
    created_at: string;
}

export interface Investment {
    id: string;
    user_id: string;
    plan_id: string;
    amount: number;
    current_value?: number;
    auto_compound: boolean;
    status: 'active' | 'matured' | 'withdrawn' | 'cancelled';
    started_at: string;
    matures_at: string;
    withdrawn_at?: string;
    plan?: InvestmentPlan;
}

export interface InvestmentPlan {
    id: string;
    name: string;
    slug: string;
    description?: string;
    min_investment: number;
    max_investment?: number;
    expected_return_min: number;
    expected_return_max: number;
    duration_days: number;
    risk_level: RiskLevel;
    is_active: boolean;
    featured: boolean;
}

export interface PriceAlert {
    id: string;
    user_id: string;
    symbol: string;
    condition: AlertCondition;
    target_price: number;
    is_active: boolean;
    triggered_at?: string;
    notification_method: 'email' | 'push' | 'both';
    created_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    body?: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'kyc' | 'transaction' | 'investment';
    is_read: boolean;
    action_url?: string;
    created_at: string;
}

/* ─── Service helpers ────────────────────────────────────────── */

export const profileService = {
    async getById(id: string) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) throw error;
        return data as Profile;
    },

    async update(id: string, updates: Partial<Profile>) {
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data as Profile;
    },
};

export const transactionService = {
    async getByUser(userId: string, limit = 50) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return (data ?? []) as Transaction[];
    },

    async create(tx: Omit<Transaction, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('transactions').insert(tx).select().single();
        if (error) throw error;
        return data as Transaction;
    },
};

export const investmentService = {
    async getByUser(userId: string) {
        const { data, error } = await supabase
            .from('investments')
            .select('*, plan:investment_plans(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []) as Investment[];
    },

    async create(investment: Omit<Investment, 'id' | 'started_at'>) {
        const { data, error } = await supabase.from('investments').insert(investment).select('*, plan:investment_plans(*)').single();
        if (error) throw error;
        return data as Investment;
    },

    async toggleAutoCompound(id: string, value: boolean) {
        const { error } = await supabase.from('investments').update({ auto_compound: value }).eq('id', id);
        if (error) throw error;
    },
};

export const alertService = {
    async getByUser(userId: string) {
        const { data, error } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []) as PriceAlert[];
    },

    async create(alert: Omit<PriceAlert, 'id' | 'created_at' | 'triggered_at'>) {
        const { data, error } = await supabase.from('price_alerts').insert(alert).select().single();
        if (error) throw error;
        return data as PriceAlert;
    },

    async delete(id: string) {
        const { error } = await supabase.from('price_alerts').delete().eq('id', id);
        if (error) throw error;
    },

    async toggleActive(id: string, value: boolean) {
        const { error } = await supabase.from('price_alerts').update({ is_active: value }).eq('id', id);
        if (error) throw error;
    },
};

export const notificationService = {
    async getByUser(userId: string) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(30);
        if (error) throw error;
        return (data ?? []) as Notification[];
    },

    async markAllRead(userId: string) {
        const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
        if (error) throw error;
    },
};

export const plansService = {
    async getAll() {
        const { data, error } = await supabase.from('investment_plans').select('*').eq('is_active', true).order('min_investment');
        if (error) throw error;
        return (data ?? []) as InvestmentPlan[];
    },
};
