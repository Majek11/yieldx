import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart2, Activity, Target, AlertTriangle, ArrowRight } from 'lucide-react';
import { getChartData, holdings, totalBalance, investedAmount, totalPnL } from '@/lib/mockData';

/* ─── Analytics helpers ──────────────────────────────────────── */
function calcSharpe(returns: number[], riskFreeRate = 0.05): number {
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((s, r) => s + Math.pow(r - avg, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    return stdDev === 0 ? 0 : ((avg - riskFreeRate / 365) / stdDev) * Math.sqrt(365);
}

function calcMaxDrawdown(values: number[]): number {
    let peak = -Infinity, maxDD = 0;
    for (const v of values) {
        if (v > peak) peak = v;
        const dd = (peak - v) / peak;
        if (dd > maxDD) maxDD = dd;
    }
    return maxDD * 100;
}

function calcVolatility(values: number[]): number {
    const returns = values.slice(1).map((v, i) => (v - values[i]) / values[i]);
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((s, r) => s + Math.pow(r - avg, 2), 0) / returns.length;
    return Math.sqrt(variance * 365) * 100;
}

// Benchmark: BTC ~+142% YTD, S&P 500 ~+24%
const BENCHMARKS = [
    { label: 'BTC', color: '#F7931A', multiplier: 1.42 },
    { label: 'ETH', color: '#627EEA', multiplier: 0.95 },
    { label: 'S&P 500', color: '#10B981', multiplier: 0.24 },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
const fmtPct = (n: number, decimals = 2) => `${n >= 0 ? '+' : ''}${n.toFixed(decimals)}%`;

function StatCard({ label, value, sub, color, icon: Icon }: { label: string; value: string; sub?: string; color: string; icon: React.ElementType }) {
    return (
        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-muted-foreground text-xs mb-1">{label}</p>
                <p className="font-heading text-xl font-bold text-foreground">{value}</p>
                {sub && <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-2xl text-xs">
            <p className="text-muted-foreground mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
                    {p.name}: {typeof p.value === 'number' && p.value > 100 ? fmt(p.value) : `${p.value?.toFixed?.(2) ?? p.value}%`}
                </p>
            ))}
        </div>
    );
};

export default function Analytics() {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y');
    const chartData = getChartData(timeframe);
    const values = chartData.map(d => d.value);

    // Compute daily returns for stats
    const dailyReturns = values.slice(1).map((v, i) => (v - values[i]) / values[i]);

    const sharpe = calcSharpe(dailyReturns);
    const maxDD = calcMaxDrawdown(values);
    const volatility = calcVolatility(values);
    const pnlPct = ((totalPnL / investedAmount) * 100);
    const winDays = dailyReturns.filter(r => r > 0).length;
    const winRate = (winDays / dailyReturns.length) * 100;

    // Benchmark comparison chart
    const startValue = values[0] ?? 1;
    const benchmarkData = chartData.map((d, i) => {
        const portfolioPct = ((d.value - startValue) / startValue) * 100;
        const fraction = i / (chartData.length - 1);
        return {
            date: d.date,
            'YieldX': +portfolioPct.toFixed(2),
            'BTC': +(BENCHMARKS[0].multiplier * fraction * 100).toFixed(2),
            'ETH': +(BENCHMARKS[1].multiplier * fraction * 100).toFixed(2),
            'S&P 500': +(BENCHMARKS[2].multiplier * fraction * 100).toFixed(2),
        };
    });

    // Monthly returns bar chart
    const monthlyReturns = [
        { month: 'Oct', return: 8.2 }, { month: 'Nov', return: -3.4 }, { month: 'Dec', return: 12.1 },
        { month: 'Jan', return: 18.4 }, { month: 'Feb', return: -1.8 }, { month: 'Mar', return: 22.3 },
    ];

    // Drawdown chart
    let peak = values[0] ?? 1;
    const drawdownData = chartData.map((d) => {
        if (d.value > peak) peak = d.value;
        const dd = -((peak - d.value) / peak) * 100;
        return { date: d.date, drawdown: +dd.toFixed(2) };
    });

    // Sector breakdown
    const sectors = [
        { label: 'Layer 1 (ETH, SOL, ADA)', pct: 42, color: '#7C3AED' },
        { label: 'DeFi Protocols', pct: 28, color: '#059669' },
        { label: 'Stablecoins', pct: 15, color: '#2775CA' },
        { label: 'Bitcoin', pct: 10, color: '#F7931A' },
        { label: 'NFT/Gaming', pct: 5, color: '#EC4899' },
    ];

    const riskScore = sharpe > 2 ? 'Low' : sharpe > 1 ? 'Moderate' : 'High';
    const riskColor = riskScore === 'Low' ? 'text-emerald-400' : riskScore === 'Moderate' ? 'text-amber-400' : 'text-red-400';

    return (
        <div className="space-y-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">Portfolio Analytics</h2>
                    <p className="text-muted-foreground text-sm mt-1">Advanced performance metrics and risk analysis</p>
                </div>
                <div className="flex gap-1 bg-secondary/40 border border-border/40 p-1 rounded-xl">
                    {(['1M', '3M', '6M', '1Y'] as const).map(tf => (
                        <button key={tf} onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${timeframe === tf ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Sharpe Ratio" value={sharpe.toFixed(2)} sub={`Risk-adjusted return · ${riskScore} risk`} color="bg-primary/10 text-primary" icon={Activity} />
                <StatCard label="Max Drawdown" value={`-${maxDD.toFixed(2)}%`} sub="Largest peak-to-trough loss" color="bg-red-500/10 text-red-400" icon={TrendingDown} />
                <StatCard label="Annualised Volatility" value={`${volatility.toFixed(1)}%`} sub="Standard deviation of daily returns" color="bg-amber-500/10 text-amber-400" icon={BarChart2} />
                <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} sub={`${winDays} profitable days / ${dailyReturns.length} total`} color="bg-emerald-500/10 text-emerald-400" icon={Target} />
            </div>

            {/* Benchmark comparison */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-heading text-sm font-semibold text-foreground">Performance vs Benchmarks</h3>
                    <div className="flex items-center gap-4">
                        {[{ label: 'YieldX', color: '#7C3AED' }, ...BENCHMARKS].map(b => (
                            <div key={b.label} className="flex items-center gap-1.5">
                                <div className="w-3 h-1 rounded-full" style={{ background: b.color }} />
                                <span className="text-xs text-muted-foreground">{b.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={benchmarkData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                        <Line dataKey="YieldX" stroke="#7C3AED" strokeWidth={2.5} dot={false} />
                        <Line dataKey="BTC" stroke="#F7931A" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                        <Line dataKey="ETH" stroke="#627EEA" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                        <Line dataKey="S&P 500" stroke="#10B981" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Monthly returns + Drawdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Monthly returns */}
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                    <h3 className="font-heading text-sm font-semibold text-foreground mb-5">Monthly Returns</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyReturns} barSize={28}>
                            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                            <Tooltip content={<ChartTooltip />} />
                            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                            <Bar dataKey="return" name="Return"
                                fill="#7C3AED"
                                radius={[4, 4, 0, 0]}
                                // Color bars individually
                                label={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Drawdown chart */}
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                    <h3 className="font-heading text-sm font-semibold text-foreground mb-5">Drawdown History</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={drawdownData}>
                            <defs>
                                <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area dataKey="drawdown" name="Drawdown" stroke="#ef4444" strokeWidth={1.5} fill="url(#ddGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sector breakdown + Risk metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Sector allocation */}
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                    <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Sector Allocation</h3>
                    <div className="space-y-3">
                        {sectors.map(s => (
                            <div key={s.label}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">{s.label}</span>
                                    <span className="text-foreground font-semibold">{s.pct}%</span>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk metrics */}
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                    <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Risk Metrics</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Sharpe Ratio', value: sharpe.toFixed(2), note: '> 1 is good, > 2 is excellent' },
                            { label: 'Max Drawdown', value: `-${maxDD.toFixed(2)}%`, note: 'Largest peak-to-trough loss' },
                            { label: 'Annualised Vol', value: `${volatility.toFixed(1)}%`, note: 'Lower = more stable returns' },
                            { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, note: 'Days with positive returns' },
                            { label: 'Total Return', value: fmtPct(pnlPct), note: 'Since inception' },
                            { label: 'Overall Risk Score', value: riskScore, note: 'Based on Sharpe + volatility', valueClass: riskColor },
                        ].map(m => (
                            <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                                <div>
                                    <p className="text-foreground text-sm font-medium">{m.label}</p>
                                    <p className="text-muted-foreground text-xs">{m.note}</p>
                                </div>
                                <span className={`font-heading font-bold text-sm ${m.valueClass ?? 'text-foreground'}`}>{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tax report banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-foreground text-sm font-semibold">Generate Tax Report</p>
                        <p className="text-muted-foreground text-xs mt-0.5">Export a full capital gains / income report for your accountant. Supports FIFO, LIFO, and HIFO cost basis methods.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/transactions')}
                    className="flex-shrink-0 flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
                >
                    Export <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
