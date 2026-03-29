import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowRight, Calendar, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { holdings, totalBalance, investedAmount, totalPnL, pnlPercent, getChartData, timeframes } from '@/lib/mockData';
import { toast } from 'sonner';

const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

/* ─── Active investments mock ─────────────────────────────── */
const activeInvestments = [
    { id: 'inv-1', fund: 'AI Alpha Fund', invested: 10000, currentValue: 18420, startDate: new Date('2026-01-01'), maturityDate: new Date('2026-12-31'), color: '#7C3AED', risk: 'Aggressive', status: 'active' },
    { id: 'inv-2', fund: 'Balanced Growth', invested: 5000, currentValue: 6837, startDate: new Date('2026-01-15'), maturityDate: new Date('2026-07-15'), color: '#2563EB', risk: 'Moderate', status: 'active' },
    { id: 'inv-3', fund: 'DeFi Yield Optimizer', invested: 3500, currentValue: 4655, startDate: new Date('2025-10-01'), maturityDate: new Date('2026-04-01'), color: '#059669', risk: 'Moderate-High', status: 'active' },
    { id: 'inv-4', fund: 'Conservative Crypto', invested: 2000, currentValue: 2248, startDate: new Date('2026-02-01'), maturityDate: new Date('2026-05-01'), color: '#D97706', risk: 'Low', status: 'matured' },
];

function daysRemaining(maturity: Date): number {
    return Math.max(0, Math.ceil((maturity.getTime() - Date.now()) / 86400000));
}

function progressPct(start: Date, maturity: Date): number {
    const total = maturity.getTime() - start.getTime();
    const elapsed = Date.now() - start.getTime();
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-xl text-xs">
            <p className="text-muted-foreground mb-1">{label}</p>
            <p className="font-heading font-semibold text-foreground text-base">{fmt(payload[0].value)}</p>
        </div>
    );
};

export default function Portfolio() {
    const [balanceHidden, setBalanceHidden] = useState(false);
    const [activeTimeframe, setActiveTimeframe] = useState<typeof timeframes[number]>('1Y');
    const navigate = useNavigate();
    const chartData = getChartData(activeTimeframe);
    const pnlPositive = pnlPercent > 0;

    // Auto-compound state (persisted in localStorage)
    const [autoCompound, setAutoCompound] = useState<Record<string, boolean>>(() => {
        try { return JSON.parse(localStorage.getItem('yieldx_autocompound') ?? '{}'); }
        catch { return {}; }
    });

    const toggleAutoCompound = (id: string) => {
        setAutoCompound(prev => {
            const next = { ...prev, [id]: !prev[id] };
            localStorage.setItem('yieldx_autocompound', JSON.stringify(next));
            toast.success(next[id] ? 'Auto-compound enabled — yields will reinvest automatically' : 'Auto-compound disabled — yields paid to wallet');
            return next;
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-muted-foreground text-sm">Portfolio Value</p>
                            <button onClick={() => setBalanceHidden(!balanceHidden)} className="text-muted-foreground hover:text-foreground transition-colors">
                                {balanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <h2 className="font-heading text-4xl font-bold text-foreground mb-3">
                            {balanceHidden ? '••••••' : fmt(totalBalance)}
                        </h2>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${pnlPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                            {pnlPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            {pnlPositive ? '+' : ''}{pnlPercent.toFixed(2)}% ({pnlPositive ? '+' : ''}{fmt(totalPnL)}) all-time
                        </div>
                        <div className="flex gap-6 mt-4">
                            <div><p className="text-muted-foreground text-xs">Invested</p><p className="font-heading text-lg font-semibold text-foreground">{balanceHidden ? '••••' : fmt(investedAmount)}</p></div>
                            <div><p className="text-muted-foreground text-xs">Assets</p><p className="font-heading text-lg font-semibold text-foreground">{holdings.length}</p></div>
                        </div>
                    </div>
                </div>
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 space-y-3">
                    <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
                    {[
                        { label: 'Deposit Funds', onClick: () => navigate('/wallet') },
                        { label: 'Withdraw', onClick: () => navigate('/wallet') },
                        { label: 'Invest More', onClick: () => navigate('/invest'), primary: true },
                    ].map((a) => (
                        <button key={a.label} onClick={a.onClick} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${a.primary ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'}`}>
                            {a.label} <ArrowRight className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h3 className="font-heading text-base font-semibold text-foreground">Performance History</h3>
                    <div className="flex gap-1 bg-secondary rounded-xl p-1">
                        {timeframes.map((tf) => (
                            <button key={tf} onClick={() => setActiveTimeframe(tf)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTimeframe === tf ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(255 60% 68%)" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="hsl(255 60% 68%)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 20% 15%)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: 'hsl(228 10% 55%)', fontSize: 11 }} axisLine={false} tickLine={false}
                            tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: 'hsl(228 10% 55%)', fontSize: 11 }} axisLine={false} tickLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={52} />
                        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(255 60% 68%)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area type="monotone" dataKey="value" stroke="hsl(255 60% 68%)" strokeWidth={2} fill="url(#grad2)" dot={false}
                            activeDot={{ r: 5, fill: 'hsl(255 60% 68%)', stroke: 'hsl(228 50% 4%)', strokeWidth: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* ── Active Investments ── */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-heading text-base font-semibold text-foreground">Active Investments</h3>
                    <button onClick={() => navigate('/invest')} className="text-primary text-sm hover:text-primary/80 flex items-center gap-1 transition-colors">
                        Invest more <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="divide-y divide-border/30">
                    {activeInvestments.map(inv => {
                        const returns = inv.currentValue - inv.invested;
                        const returnsPct = ((returns / inv.invested) * 100).toFixed(1);
                        const progress = progressPct(inv.startDate, inv.maturityDate);
                        const days = daysRemaining(inv.maturityDate);
                        const matured = inv.status === 'matured' || days === 0;
                        return (
                            <div key={inv.id} className="px-6 py-4 hover:bg-secondary/20 transition-colors">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: inv.color + '22' }}>
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: inv.color }} />
                                        </div>
                                        <div>
                                            <p className="text-foreground text-sm font-semibold">{inv.fund}</p>
                                            <p className="text-muted-foreground text-xs">{inv.risk} Risk</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-heading text-base font-bold text-foreground">{fmt(inv.currentValue)}</p>
                                        <p className={`text-xs font-medium ${returns >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {returns >= 0 ? '+' : ''}{fmt(returns)} ({returns >= 0 ? '+' : ''}{returnsPct}%)
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress: {progress}%</span>
                                        <span className="flex items-center gap-1">
                                            {matured
                                                ? <><CheckCircle className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Matured</span></>
                                                : <><Clock className="w-3 h-3" />{days} days remaining</>}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: matured ? '#10b981' : inv.color }} />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground/70">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{inv.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{inv.maturityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Invested: <span className="text-foreground font-medium">{fmt(inv.invested)}</span></p>

                                {/* Auto-compound toggle */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                                    <div className="flex items-center gap-1.5">
                                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Auto-compound yields</span>
                                    </div>
                                    <button
                                        onClick={() => toggleAutoCompound(inv.id)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${autoCompound[inv.id] ? 'bg-primary' : 'bg-border/60'}`}
                                        aria-label="Toggle auto-compound"
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${autoCompound[inv.id] ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Holdings Table */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50">
                    <h3 className="font-heading text-base font-semibold text-foreground">All Holdings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/30">
                                {['Asset', 'Amount', 'Price', '24h Change', 'Value', 'Allocation'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((h) => (
                                <tr key={h.symbol} className="border-b border-border/20 hover:bg-secondary/40 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: h.color + '22' }}>
                                                <span className="text-sm font-bold" style={{ color: h.color }}>{h.symbol[0]}</span>
                                            </div>
                                            <div>
                                                <p className="text-foreground font-medium">{h.symbol}</p>
                                                <p className="text-muted-foreground text-xs">{h.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-foreground">{h.amount.toFixed(4)}</td>
                                    <td className="px-5 py-4 text-foreground">{fmt(h.price)}</td>
                                    <td className={`px-5 py-4 font-medium ${h.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {h.change24h >= 0 ? '+' : ''}{h.change24h}%
                                    </td>
                                    <td className="px-5 py-4 text-foreground font-semibold">{fmt(h.value)}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 bg-border/60 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${h.allocation}%`, backgroundColor: h.color }} />
                                            </div>
                                            <span className="text-muted-foreground text-xs">{h.allocation}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
