import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
    {
        id: "starter",
        name: "Starter",
        fee: "0%",
        feeSub: "management fee",
        perfFee: "20% of profits",
        minDeposit: "$100",
        description: "Perfect for first-time investors looking to dip their toes in crypto.",
        color: "border-border/60",
        badge: null,
        features: [
            "Access to Balanced Growth fund",
            "Access to Conservative fund",
            "Real-time dashboard",
            "Weekly performance reports",
            "Standard support",
            "Instant withdrawals",
        ],
        cta: "Get Started Free",
    },
    {
        id: "pro",
        name: "Pro",
        fee: "1%",
        feeSub: "annual management fee",
        perfFee: "15% of profits",
        minDeposit: "$1,000",
        description: "For serious investors who want access to all strategies and priority features.",
        color: "border-primary/60",
        badge: "Most Popular",
        features: [
            "All Starter features",
            "Access to AI Alpha Fund",
            "Access to DeFi Yield Optimizer",
            "Daily performance reports",
            "Priority support (24h SLA)",
            "API access",
            "Tax report export",
            "Multi-wallet support",
        ],
        cta: "Start Pro Trial",
    },
    {
        id: "institutional",
        name: "Institutional",
        fee: "Custom",
        feeSub: "negotiated fee",
        perfFee: "Custom",
        minDeposit: "$250,000+",
        description: "Custom solutions for family offices, hedge funds and corporate treasuries.",
        color: "border-border/60",
        badge: null,
        features: [
            "All Pro features",
            "Dedicated relationship manager",
            "Custom strategy development",
            "White-glove onboarding",
            "Regulatory & compliance support",
            "Sub-account management",
            "SLA-backed uptime commitment",
            "Monthly strategy reviews",
        ],
        cta: "Contact Sales",
    },
];

const faqs = [
    {
        q: "Are there any hidden fees?",
        a: "No. YieldX charges only the management fee and performance fee listed above. Gas costs on DeFi strategies are optimised by our system but are reflected transparently in your dashboard.",
    },
    {
        q: "When is the performance fee charged?",
        a: "Performance fees are charged at the end of each calendar quarter, only on positive returns above the high-water mark. If you lose money in a quarter, no performance fee is charged.",
    },
    {
        q: "Can I switch plans?",
        a: "Yes. You can upgrade or downgrade your plan at any time from your settings. Changes take effect at the start of your next billing cycle.",
    },
    {
        q: "Is there a lock-up period?",
        a: "Never. You can withdraw your principal and profits at any time with no penalty. Withdrawals are processed within 1–3 business days.",
    },
    {
        q: "Is my money safe?",
        a: "95% of assets are held in institutional cold storage via Fireblocks MPC. All smart contracts are CertiK audited. Assets are covered up to $250M by Lloyd's of London.",
    },
];

export default function Pricing() {
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useGSAP(() => {
        gsap.fromTo(".pricing-card",
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: ".pricing-grid", start: "top 82%" }
            });
        gsap.fromTo(".faq-item",
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: ".faq-list", start: "top 82%" }
            });
    }, { scope: ref });

    const handleCta = (plan: typeof plans[0]) => {
        if (plan.id === "institutional") {
            window.location.href = "mailto:sales@yieldx.io?subject=Institutional Inquiry";
        } else {
            navigate("/register");
        }
    };

    return (
        <div ref={ref} className="min-h-screen bg-background">
            <Navbar />
            {/* Hero */}
            <div className="section-padding pt-32 pb-20 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] glow-blob glow-primary opacity-60 pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary text-xs font-medium">Simple, transparent pricing</span>
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1] mb-4">
                        Pay only for<br />
                        <span className="text-gradient">real results</span>
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                        No hidden fees, no lock-ups. Our performance fee model means we only win when you win.
                    </p>
                </div>
            </div>

            {/* Pricing grid */}
            <div className="section-padding pb-24">
                <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`pricing-card card-glass border ${plan.color} p-6 relative flex flex-col ${plan.badge ? "shadow-lg shadow-primary/15" : ""
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full shadow-lg shadow-primary/30">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                                <p className="text-muted-foreground text-sm">{plan.description}</p>
                            </div>

                            {/* Fees */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-secondary/60 rounded-xl p-3">
                                    <p className="font-heading text-2xl font-bold text-foreground">{plan.fee}</p>
                                    <p className="text-muted-foreground text-xs mt-0.5">{plan.feeSub}</p>
                                </div>
                                <div className="bg-secondary/60 rounded-xl p-3">
                                    <p className="font-heading text-lg font-bold text-foreground">{plan.perfFee}</p>
                                    <p className="text-muted-foreground text-xs mt-0.5">performance fee</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-foreground text-sm">Min. deposit <strong>{plan.minDeposit}</strong></span>
                            </div>

                            <div className="flex-1 space-y-2.5 mb-8">
                                {plan.features.map((feat) => (
                                    <div key={feat} className="flex items-start gap-2.5">
                                        <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-2.5 h-2.5 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground text-sm">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleCta(plan)}
                                className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${plan.badge
                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
                                    : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                                    }`}
                            >
                                {plan.cta} <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Trust row */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-14 max-w-3xl mx-auto">
                    {[
                        { icon: Shield, label: "CertiK Audited" },
                        { icon: Zap, label: "Instant withdrawals" },
                        { icon: TrendingUp, label: "No performance fee on losses" },
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Icon className="w-4 h-4 text-primary" />
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="section-padding py-20 border-t border-border/50">
                <div className="max-w-2xl mx-auto">
                    <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground text-center mb-14">
                        Frequently asked questions
                    </h2>
                    <div className="faq-list space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="faq-item card-glass p-6">
                                <h3 className="font-heading text-base font-semibold text-foreground mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground text-sm mb-4">Still have questions?</p>
                        <a href="mailto:hello@yieldx.io" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm">
                            Contact our team →
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
