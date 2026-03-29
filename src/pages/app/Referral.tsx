import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Check, Gift, Users, TrendingUp, Share2, Twitter, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

const tiers = [
    { invites: 1, reward: "$25", label: "First invite" },
    { invites: 5, reward: "$150", label: "5 referrals" },
    { invites: 10, reward: "$500", label: "10 referrals" },
    { invites: 25, reward: "1% AUM fee waived for 1 year", label: "25 referrals" },
];

const mockReferrals = [
    { name: "Jordan M.", status: "invested", reward: "$25", date: "2026-03-20" },
    { name: "Lisa K.", status: "pending", reward: "—", date: "2026-03-24" },
];

export default function Referral() {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

    const code = `YLDX-${user?.id?.toUpperCase() ?? "DEMO"}`;
    const link = `https://yieldx.io/register?ref=${code}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Referral link copied!");
    };

    const shareTwitter = () => {
        const text = encodeURIComponent(
            `I've been growing my crypto portfolio with YieldX's AI-powered funds. Join with my link and we both get a bonus! 🚀`
        );
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(link)}`, "_blank");
    };

    const inviteCount = mockReferrals.filter((r) => r.status === "invested").length;
    const nextTier = tiers.find((t) => t.invites > inviteCount);
    const progress = Math.min((inviteCount / (nextTier?.invites ?? 1)) * 100, 100);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Hero card */}
            <div className="relative bg-card/60 backdrop-blur-md border border-primary/30 rounded-2xl p-8 overflow-hidden shadow-lg shadow-primary/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Invite &amp; Earn</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Share your unique link. When a friend registers and makes their first investment, you both receive a cash reward — credited instantly.
                        </p>
                    </div>
                    <div className="text-center md:text-right flex-shrink-0">
                        <p className="font-heading text-4xl font-bold text-emerald-400">$25</p>
                        <p className="text-muted-foreground text-xs mt-0.5">per successful referral</p>
                    </div>
                </div>
            </div>

            {/* Referral link */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                <h3 className="font-heading text-base font-semibold text-foreground mb-4">Your Referral Link</h3>
                <div className="flex items-center gap-2 bg-background/80 border border-border rounded-xl px-4 py-3 mb-4">
                    <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground font-mono flex-1 truncate">{link}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors flex-shrink-0 ml-2"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={shareTwitter}
                        className="flex items-center gap-2 bg-[#1DA1F2]/15 hover:bg-[#1DA1F2]/25 border border-[#1DA1F2]/30 text-[#1DA1F2] px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
                    >
                        <Twitter className="w-4 h-4" /> Share on X
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
                    >
                        <Share2 className="w-4 h-4" /> Copy Link
                    </button>
                </div>
            </div>

            {/* Progress to next tier */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-base font-semibold text-foreground">Your Progress</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-foreground font-semibold">{inviteCount}</span>
                        <span className="text-muted-foreground">/ {nextTier?.invites ?? "∞"} invited</span>
                    </div>
                </div>

                <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden mb-3">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {nextTier && (
                    <p className="text-muted-foreground text-xs">
                        <span className="text-primary font-medium">{nextTier.invites - inviteCount} more</span> referrals to unlock{" "}
                        <span className="text-foreground font-medium">{nextTier.reward}</span>
                    </p>
                )}

                {/* Tier grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    {tiers.map((t) => {
                        const reached = inviteCount >= t.invites;
                        return (
                            <div
                                key={t.invites}
                                className={`p-3 rounded-xl border text-center transition-all ${reached
                                        ? "border-emerald-500/40 bg-emerald-500/8"
                                        : "border-border/40 bg-secondary/30 opacity-60"
                                    }`}
                            >
                                <p className={`font-heading text-sm font-bold ${reached ? "text-emerald-400" : "text-foreground"}`}>
                                    {t.reward}
                                </p>
                                <p className="text-muted-foreground text-xs mt-0.5">{t.label}</p>
                                {reached && (
                                    <div className="mt-1.5 inline-flex items-center gap-1 text-emerald-400 text-xs">
                                        <Check className="w-3 h-3" /> Unlocked
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Referral history */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                    <h3 className="font-heading text-base font-semibold text-foreground">Your Referrals</h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Users className="w-4 h-4" />
                        {mockReferrals.length} total
                    </div>
                </div>
                {mockReferrals.length === 0 ? (
                    <div className="py-12 text-center">
                        <Gift className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No referrals yet — share your link to get started!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/30">
                        {mockReferrals.map((r, i) => (
                            <div key={i} className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span className="font-heading text-xs font-bold text-primary">{r.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="text-foreground text-sm font-medium">{r.name}</p>
                                        <p className="text-muted-foreground text-xs">{new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${r.status === "invested" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                                        }`}>
                                        {r.status}
                                    </span>
                                    <span className={`font-heading text-sm font-semibold ${r.reward !== "—" ? "text-emerald-400" : "text-muted-foreground"}`}>
                                        {r.reward !== "—" ? `+${r.reward}` : r.reward}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
