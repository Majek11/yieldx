import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Shield, TrendingUp, Wallet, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TOUR_KEY = 'yieldx_tour_completed';

const steps = [
    {
        id: 'welcome',
        icon: Sparkles,
        iconColor: 'text-primary',
        iconBg: 'bg-primary/15',
        title: 'Welcome to YieldX 🎉',
        body: "You're joining 52,000+ investors growing their wealth with AI-powered crypto strategies. Let's take a 60-second tour to get you started.",
        cta: "Let's Go",
        tip: null,
    },
    {
        id: 'kyc',
        icon: Shield,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-400/15',
        title: 'Complete Identity Verification',
        body: 'Before you can withdraw funds, we need to verify your identity. This protects you and ensures regulatory compliance. It takes less than 3 minutes.',
        cta: 'Next',
        tip: 'Your documents are encrypted and never shared with third parties.',
        action: { label: 'Start KYC Now', href: '/settings?tab=kyc' },
    },
    {
        id: 'deposit',
        icon: Wallet,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-400/15',
        title: 'Fund Your Account',
        body: 'Deposit crypto to your YieldX wallet. We support BTC, ETH, SOL, USDT, BNB, and USDC. Minimum deposit is just $10.',
        cta: 'Next',
        tip: 'Deposits are credited within 3 confirmations (usually under 10 minutes).',
        action: { label: 'Make a Deposit', href: '/wallet' },
    },
    {
        id: 'invest',
        icon: TrendingUp,
        iconColor: 'text-primary',
        iconBg: 'bg-primary/15',
        title: 'Choose an Investment Plan',
        body: 'From stable 15–25% yields to AI-powered funds returning 120–200%, there\'s a plan for every risk appetite. Start with as little as $100.',
        cta: 'Next',
        tip: 'Diversify across multiple plans to reduce risk.',
        action: { label: 'Explore Plans', href: '/invest' },
    },
    {
        id: 'alerts',
        icon: Bell,
        iconColor: 'text-teal-400',
        iconBg: 'bg-teal-400/15',
        title: 'Set Price Alerts',
        body: "Never miss an opportunity. Set custom price alerts for any crypto and we'll notify you the moment your target is hit.",
        cta: 'Next',
        tip: 'You can set unlimited price alerts from your Dashboard.',
        action: { label: 'Set an Alert', href: '/dashboard' },
    },
    {
        id: 'done',
        icon: Sparkles,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-400/15',
        title: "You're All Set!",
        body: "Your YieldX journey starts now. Complete your KYC, make your first deposit, and watch your wealth grow. We're here if you need help.",
        cta: 'Go to Dashboard',
        tip: null,
    },
];

export function useOnboardingTour() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const done = localStorage.getItem(TOUR_KEY);
        if (!done) {
            // Small delay so the page renders first
            const t = setTimeout(() => setShow(true), 1500);
            return () => clearTimeout(t);
        }
    }, []);

    const complete = () => {
        localStorage.setItem(TOUR_KEY, 'true');
        setShow(false);
    };

    const reset = () => {
        localStorage.removeItem(TOUR_KEY);
        setShow(true);
    };

    return { show, complete, reset };
}

interface Props {
    onClose: () => void;
}

export default function OnboardingTour({ onClose }: Props) {
    const [step, setStep] = useState(0);
    const [exiting, setExiting] = useState(false);
    const navigate = useNavigate();
    const current = steps[step];
    const Icon = current.icon;
    const isLast = step === steps.length - 1;

    const close = () => {
        setExiting(true);
        setTimeout(onClose, 300);
    };

    const next = () => {
        if (isLast) { close(); return; }
        setStep(s => s + 1);
    };

    const prev = () => setStep(s => Math.max(0, s - 1));

    const handleAction = (href: string) => {
        close();
        navigate(href);
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${exiting ? 'opacity-0 scale-95' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

            {/* Card */}
            <div className="relative bg-card border border-border/60 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md overflow-hidden">

                {/* Top gradient strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-teal-400 to-emerald-400" />

                {/* Close */}
                <button onClick={close} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-xl hover:bg-secondary/60">
                    <X className="w-4 h-4" />
                </button>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 px-6 pt-6 pb-2">
                    {steps.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'bg-primary w-6' : i < step ? 'bg-primary/40 w-3' : 'bg-border w-3'}`} />
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground">{step + 1}/{steps.length}</span>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${current.iconBg} flex items-center justify-center mb-4 border border-white/5`}>
                        <Icon className={`w-7 h-7 ${current.iconColor}`} />
                    </div>

                    <h2 className="font-heading text-xl font-bold text-foreground mb-2">{current.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{current.body}</p>

                    {/* Tip */}
                    {current.tip && (
                        <div className="mt-4 flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2.5">
                            <span className="text-primary text-xs mt-0.5">💡</span>
                            <p className="text-primary/80 text-xs">{current.tip}</p>
                        </div>
                    )}

                    {/* Action button */}
                    {current.action && (
                        <button
                            onClick={() => handleAction(current.action!.href)}
                            className="mt-4 w-full flex items-center justify-between bg-secondary/60 hover:bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground font-medium transition-all group"
                        >
                            {current.action.label}
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 px-6 pb-6 pt-2">
                    {step > 0 && (
                        <button onClick={prev} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors px-3 py-2.5 rounded-xl hover:bg-secondary/60">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}
                    <button
                        onClick={next}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                    >
                        {current.cta}
                        {!isLast && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
