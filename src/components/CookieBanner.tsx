import { useState, useEffect } from "react";
import { X, Cookie, Settings2, Check } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "yieldx_cookie_consent";

type Consent = "all" | "essential" | null;

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [analytics, setAnalytics] = useState(true);
    const [marketing, setMarketing] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Small delay so landing page loads first
            const t = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(t);
        }
    }, []);

    const accept = (consent: Consent) => {
        localStorage.setItem(STORAGE_KEY, consent ?? "essential");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 md:left-auto md:right-6 md:max-w-md z-[100]">
            <div className="bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl shadow-background/80 overflow-hidden">
                {/* Main banner */}
                {!showDetail ? (
                    <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Cookie className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="font-heading text-sm font-semibold text-foreground">We use cookies</h3>
                            </div>
                            <button onClick={() => accept("essential")} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                            We use cookies to improve your experience, analyse usage and deliver personalised content.
                            By clicking "Accept all" you consent to our use of cookies.{" "}
                            <Link to="/pricing" className="text-primary hover:underline">Learn more</Link>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => accept("all")}
                                className="flex-1 min-w-20 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                            >
                                Accept all
                            </button>
                            <button
                                onClick={() => accept("essential")}
                                className="flex-1 min-w-20 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border px-3 py-2 rounded-xl text-xs font-medium transition-all"
                            >
                                Essential only
                            </button>
                            <button
                                onClick={() => setShowDetail(true)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 flex-shrink-0"
                            >
                                <Settings2 className="w-3.5 h-3.5" /> Customise
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Detail panel */
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading text-sm font-semibold text-foreground">Cookie preferences</h3>
                            <button onClick={() => setShowDetail(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3 mb-4">
                            {[
                                { id: "essential", label: "Essential", desc: "Required for the site to function. Cannot be disabled.", forced: true, value: true },
                                { id: "analytics", label: "Analytics", desc: "Help us understand how visitors interact with the platform.", forced: false, value: analytics, set: setAnalytics },
                                { id: "marketing", label: "Marketing", desc: "Personalised ads and content based on your interests.", forced: false, value: marketing, set: setMarketing },
                            ].map((c) => (
                                <div key={c.id} className="flex items-start justify-between gap-3 p-3 bg-secondary/40 rounded-xl">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-foreground text-xs font-medium">{c.label}</p>
                                        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{c.desc}</p>
                                    </div>
                                    {c.forced ? (
                                        <div className="flex-shrink-0 w-10 h-5 bg-primary rounded-full flex items-center justify-end pr-0.5 cursor-not-allowed opacity-60">
                                            <div className="w-4 h-4 rounded-full bg-white" />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => c.set?.(!c.value)}
                                            className={`flex-shrink-0 relative w-10 h-5 rounded-full transition-colors duration-300 ${c.value ? "bg-primary" : "bg-border"}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${c.value ? "translate-x-5" : "translate-x-0"}`} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => accept(analytics && marketing ? "all" : "essential")}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                        >
                            <Check className="w-3.5 h-3.5" /> Save preferences
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
