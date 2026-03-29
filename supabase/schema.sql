-- ============================================================
-- YieldX — Supabase Production Schema
-- Run this in your Supabase SQL editor to set up the database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS (extends Supabase auth.users) ─────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT '',
  phone         TEXT,
  avatar_url    TEXT,
  kyc_status    TEXT NOT NULL DEFAULT 'not_started'
                  CHECK (kyc_status IN ('not_started','pending','approved','rejected')),
  kyc_submitted_at TIMESTAMPTZ,
  kyc_reviewed_at  TIMESTAMPTZ,
  kyc_notes     TEXT,
  referral_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
  referred_by   UUID REFERENCES public.profiles(id),
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  is_suspended  BOOLEAN NOT NULL DEFAULT FALSE,
  two_fa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  two_fa_secret  TEXT,
  auto_compound  BOOLEAN NOT NULL DEFAULT FALSE,
  risk_profile  TEXT DEFAULT 'moderate'
                  CHECK (risk_profile IN ('conservative','moderate','aggressive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── KYC DOCUMENTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type      TEXT NOT NULL CHECK (doc_type IN ('passport','national_id','drivers_license')),
  doc_front_url TEXT NOT NULL,
  doc_back_url  TEXT,
  selfie_url    TEXT NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality   TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── WALLETS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.deposit_addresses (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chain_id   TEXT NOT NULL UNIQUE,
  chain_name TEXT NOT NULL,
  symbol     TEXT NOT NULL,
  address    TEXT NOT NULL,
  network    TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with default addresses (admin should update these)
INSERT INTO public.deposit_addresses (chain_id, chain_name, symbol, address, network) VALUES
  ('eth',      'Ethereum (ERC-20)',       'ETH',  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', 'mainnet'),
  ('btc',      'Bitcoin',                 'BTC',  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'mainnet'),
  ('sol',      'Solana (SPL)',             'SOL',  'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKH', 'mainnet'),
  ('usdt-trc', 'USDT (TRC-20)',           'USDT', 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', 'tron'),
  ('bnb',      'BNB Smart Chain (BEP-20)','BNB',  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', 'bsc'),
  ('usdc',     'USDC (ERC-20)',           'USDC', '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', 'mainnet')
ON CONFLICT (chain_id) DO NOTHING;

-- ─── INVESTMENT PLANS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.investment_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  min_investment  NUMERIC(18,2) NOT NULL DEFAULT 100,
  max_investment  NUMERIC(18,2),
  expected_return_min NUMERIC(5,2) NOT NULL,
  expected_return_max NUMERIC(5,2) NOT NULL,
  duration_days   INTEGER NOT NULL,
  risk_level      TEXT NOT NULL CHECK (risk_level IN ('Low','Moderate','Moderate-High','Aggressive')),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default plans
INSERT INTO public.investment_plans (name, slug, description, min_investment, expected_return_min, expected_return_max, duration_days, risk_level, featured)
VALUES
  ('Conservative Crypto', 'conservative', 'Stable yields through stablecoin strategies and blue-chip crypto lending.', 100, 15, 25, 90, 'Low', false),
  ('Balanced Growth',     'balanced',     'Diversified across top 20 crypto assets with dynamic rebalancing.', 500, 40, 70, 180, 'Moderate', true),
  ('AI Alpha Fund',       'ai-alpha',     'AI-driven momentum trading across 200+ crypto pairs.', 1000, 120, 200, 365, 'Aggressive', true),
  ('DeFi Yield Optimizer','defi-yield',   'Auto-routes capital to highest-yielding DeFi protocols.', 250, 60, 100, 180, 'Moderate-High', false)
ON CONFLICT (slug) DO NOTHING;

-- ─── USER INVESTMENTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.investments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id         UUID NOT NULL REFERENCES public.investment_plans(id),
  amount          NUMERIC(18,2) NOT NULL,
  current_value   NUMERIC(18,2),
  auto_compound   BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','matured','withdrawn','cancelled')),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  matures_at      TIMESTAMPTZ NOT NULL,
  withdrawn_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── TRANSACTIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('deposit','withdrawal','yield','buy','sell','bonus','referral')),
  amount          NUMERIC(18,2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'USD',
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','processing','completed','failed','cancelled')),
  description     TEXT,
  reference       TEXT,          -- external tx hash or bank reference
  chain_id        TEXT,          -- which chain for crypto txns
  wallet_address  TEXT,          -- destination for withdrawals
  fee             NUMERIC(18,2) DEFAULT 0,
  metadata        JSONB,
  confirmed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PRICE ALERTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,
  condition       TEXT NOT NULL CHECK (condition IN ('above','below')),
  target_price    NUMERIC(18,8) NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  triggered_at    TIMESTAMPTZ,
  notification_method TEXT NOT NULL DEFAULT 'email'
                    CHECK (notification_method IN ('email','push','both')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── AUDIT LOG ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.profiles(id),
  action     TEXT NOT NULL,
  entity     TEXT,
  entity_id  TEXT,
  changes    JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT,
  type       TEXT NOT NULL DEFAULT 'info'
               CHECK (type IN ('info','success','warning','error','kyc','transaction','investment')),
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── REFERRALS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id     UUID NOT NULL REFERENCES public.profiles(id),
  referred_id     UUID NOT NULL REFERENCES public.profiles(id),
  bonus_amount    NUMERIC(18,2) DEFAULT 0,
  bonus_paid      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referred_id)
);

-- ─── ANNOUNCEMENTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'info'
               CHECK (type IN ('info','warning','success','maintenance')),
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at  TIMESTAMPTZ,
  ends_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log         ENABLE ROW LEVEL SECURITY;

-- Profiles: users see/edit their own; admins see all
CREATE POLICY "users_own_profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "admins_all_profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transactions: users see own only
CREATE POLICY "users_own_transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admins_all_transactions" ON public.transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Investments: users see own only
CREATE POLICY "users_own_investments" ON public.investments
  FOR ALL USING (auth.uid() = user_id);

-- KYC docs: users see own; admins see all
CREATE POLICY "users_own_kyc" ON public.kyc_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admins_all_kyc" ON public.kyc_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Price alerts: users see own
CREATE POLICY "users_own_alerts" ON public.price_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Notifications: users see own
CREATE POLICY "users_own_notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Public reads for deposit addresses and plans
CREATE POLICY "public_deposit_addresses" ON public.deposit_addresses
  FOR SELECT USING (TRUE);

CREATE POLICY "public_investment_plans" ON public.investment_plans
  FOR SELECT USING (TRUE);

CREATE POLICY "public_announcements" ON public.announcements
  FOR SELECT USING (TRUE);

-- ─── FUNCTIONS & TRIGGERS ─────────────────────────────────────

-- Auto-create profile on auth.users INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_transactions_user_id   ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created   ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_user_id    ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status     ON public.investments(status);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active    ON public.price_alerts(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_unread   ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_log_user         ON public.audit_log(user_id, created_at DESC);
