import { useState } from 'react';
import { TrendingUp, Check, ArrowRight, Shield, Zap } from 'lucide-react';
import { investmentFunds } from '@/lib/mockData';
import { toast } from 'sonner';
import AutoInvest from '@/components/AutoInvest';

const riskColors = ['', 'text-emerald-400', 'text-teal-400', 'text-amber-400', 'text-orange-400', 'text-red-400'];
const riskLabels = ['', 'Low', 'Low-Med', 'Moderate', 'Mod-High', 'Aggressive'];

export default function Invest() {
    const [selected, setSelected] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [success, setSuccess] = useState(false);

    const fund = investmentFunds.find((f) => f.id === selected);

    const handleInvest = async () => {
        if (!amount || Number(amount) < (fund?.minDeposit ?? 100)) {
            toast.error(`Minimum deposit is $${fund?.minDeposit}`);
            return;
        }
        setConfirming(true);
        await new Promise((r) => setTimeout(r, 1500));
        setConfirming(false);
        setSuccess(true);
        toast.success(`Invested $${amount} in ${fund?.name}!`);
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/30">
                        <Check className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Investment Placed!</h2>
                    <p className="text-muted-foreground text-sm mb-2">
                        ${amount} has been allocated to <strong className="text-foreground">{fund?.name}</strong>.
                    </p>
                    <p className="text-muted-foreground text-xs mb-8">Your AI strategy is now active and will begin optimising immediately.</p>
                    <button
                        onClick={() => { setSuccess(false); setSelected(null); setAmount(''); }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25"
                    >
                        Invest in Another Fund
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">Choose a Strategy</h2>
                <p className="text-muted-foreground text-sm mt-1">Select an AI-powered fund that matches your risk appetite</p>
            </div>

            {/* Fund grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investmentFunds.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setSelected(f.id === selected ? null : f.id)}
                        className={`text-left bg-card/60 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 ${selected === f.id
                            ? 'border-primary/60 shadow-lg shadow-primary/20 bg-primary/5'
                            : 'border-border/60 hover:border-border'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-heading text-lg font-semibold text-foreground">{f.name}</h3>
                                    {selected === f.id && (
                                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium ${riskColors[f.riskLevel]}`}>{f.risk} Risk</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <div key={n} className={`w-4 h-1.5 rounded-full ${n <= f.riskLevel ? riskColors[f.riskLevel].replace('text-', 'bg-') : 'bg-border'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-heading text-xl font-bold text-emerald-400">{f.ytd}</p>
                                <p className="text-muted-foreground text-xs">YTD Return</p>
                            </div>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.description}</p>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-secondary/60 rounded-lg p-2.5">
                                <p className="text-foreground text-sm font-semibold">{f.allTime}</p>
                                <p className="text-muted-foreground text-xs">All-Time</p>
                            </div>
                            <div className="bg-secondary/60 rounded-lg p-2.5">
                                <p className="text-foreground text-sm font-semibold">{f.aum}</p>
                                <p className="text-muted-foreground text-xs">AUM</p>
                            </div>
                            <div className="bg-secondary/60 rounded-lg p-2.5">
                                <p className="text-foreground text-sm font-semibold">${f.minDeposit}</p>
                                <p className="text-muted-foreground text-xs">Min. Deposit</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {f.features.map((feat) => (
                                <span key={feat} className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/60 rounded-full px-3 py-1">
                                    <Check className="w-3 h-3 text-primary" /> {feat}
                                </span>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {/* Investment panel */}
            {selected && fund && (
                <div className="bg-card/60 backdrop-blur-md border border-primary/30 rounded-2xl p-6 shadow-lg shadow-primary/10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-heading text-base font-semibold text-foreground">Invest in {fund.name}</h3>
                            <p className="text-muted-foreground text-xs">Min. ${fund.minDeposit} · No lock-up period</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label htmlFor="invest-amount" className="block text-sm font-medium text-foreground mb-2">Investment Amount (USD)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                <input
                                    id="invest-amount"
                                    type="number"
                                    min={fund.minDeposit}
                                    placeholder={String(fund.minDeposit)}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-background/80 border border-border rounded-xl pl-8 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground mb-2">Estimated Annual Return</p>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 font-heading font-bold text-lg">
                                    {amount ? `+$${((Number(amount) * parseFloat(fund.ytd)) / 100).toFixed(0)}` : '--'}
                                </span>
                                <span className="text-muted-foreground text-xs">estimated YTD</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 bg-secondary/40 rounded-xl px-4 py-3">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>Your funds are protected by $250M insurance via Lloyd's of London. CertiK audited smart contracts.</span>
                    </div>

                    <button
                        id="confirm-invest-btn"
                        onClick={handleInvest}
                        disabled={confirming}
                        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-4 py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                    >
                        {confirming ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Confirm Investment <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            )}

            {/* Auto-Invest DCA */}
            <AutoInvest />

            {/* Enterprise Plan */}
            <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/30 rounded-2xl p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/20 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/30">Enterprise</span>
                            <span className="bg-amber-500/15 text-amber-400 text-xs font-medium px-2.5 py-0.5 rounded-full">Custom Returns</span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-foreground mb-1">Institutional &amp; Enterprise Plans</h3>
                        <p className="text-muted-foreground text-sm max-w-lg">
                            For investments above $1M. Get a dedicated portfolio manager, custom yield strategies, OTC desk access, and white-glove onboarding tailored to your institution's needs.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3">
                            {['Dedicated Portfolio Manager', 'Custom Yield Targets', 'OTC Desk Access', 'Priority Support', 'Custom Reporting'].map(f => (
                                <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Check className="w-3 h-3 text-primary" />{f}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <a href="mailto:enterprise@yieldx.io"
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 whitespace-nowrap">
                            Contact Us <ArrowRight className="w-4 h-4" />
                        </a>
                        <p className="text-muted-foreground text-xs text-center mt-2">enterprise@yieldx.io</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
