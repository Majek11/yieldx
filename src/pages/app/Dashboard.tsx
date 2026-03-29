import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowUpRight, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    totalBalance, investedAmount, totalPnL, pnlPercent,
    holdings, recentTransactions, getChartData, timeframes,
} from '@/lib/mockData';
import OnboardingTour, { useOnboardingTour } from '@/components/OnboardingTour';
import PriceAlerts from '@/components/PriceAlerts';

/* -------------------------------- helpers ---------------------------------- */
const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const txIcon: Record<string, string> = {
    deposit: '↓',
    buy: '⇄',
    yield: '★',
    withdrawal: '↑',
};

const txColor: Record<string, string> = {
    deposit: 'text-emerald-400',
    yield: 'text-emerald-400',
    buy: 'text-foreground',
    withdrawal: 'text-red-400',
};

/* ----------------------------- Custom tooltip ------------------------------ */
const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-xl text-xs">
            <p className="text-muted-foreground mb-1">{label}</p>
            <p className="font-heading font-semibold text-foreground text-base">{fmt(payload[0].value)}</p>
        </div>
    );
};

/* ============================== Dashboard ================================== */
export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [balanceHidden, setBalanceHidden] = useState(false);
    const [activeTimeframe, setActiveTimeframe] = useState<typeof timeframes[number]>('3M');
    const { show: showTour, complete: completeTour } = useOnboardingTour();

    const chartData = getChartData(activeTimeframe);
    const pnlPositive = pnlPercent > 0;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const pieData = holdings.map((h) => ({ name: h.symbol, value: h.allocation, color: h.color }));

    return (
        <>
            {showTour && <OnboardingTour onClose={completeTour} />}
            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Greeting */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">{greeting},</p>
                        <h2 className="font-heading text-2xl font-semibold text-foreground">{user?.name} 👋</h2>
                    </div>
                    <button
                        onClick={() => navigate('/invest')}
                        className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                    >
                        Invest Now <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* KYC banner */}
                {user?.kycStatus !== 'approved' && (
                    <button
                        onClick={() => navigate('/settings?tab=kyc')}
                        className={`w-full flex items-center gap-3 rounded-xl px-5 py-3.5 text-left transition-colors group ${user?.kycStatus === 'pending'
                            ? 'bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15'
                            : 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/15'
                            }`}
                    >
                        <ShieldAlert className={`w-5 h-5 flex-shrink-0 ${user?.kycStatus === 'pending' ? 'text-amber-400' : 'text-red-400'}`} />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${user?.kycStatus === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>
                                {user?.kycStatus === 'pending' ? 'Verification Under Review' : '⚠️ Action Required: Complete Identity Verification'}
                            </p>
                            <p className="text-muted-foreground text-xs truncate mt-0.5">
                                {user?.kycStatus === 'pending'
                                    ? 'Your KYC submission is being reviewed — typically completed within 24 hours'
                                    : 'Withdrawals are disabled until you submit your KYC documents. Tap to complete now →'}
                            </p>
                        </div>
                        <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0 ${user?.kycStatus === 'pending' ? 'text-amber-400' : 'text-red-400'}`} />
                    </button>
                )}

                {/* Portfolio balance card */}
                <div className="relative bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 overflow-hidden">
                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-muted-foreground text-sm font-medium">Total Portfolio Value</p>
                            <button
                                onClick={() => setBalanceHidden(!balanceHidden)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Toggle balance visibility"
                            >
                                {balanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex items-end gap-4 flex-wrap">
                            <h3 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                                {balanceHidden ? '••••••' : fmt(totalBalance)}
                            </h3>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mb-1 ${pnlPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                                }`}>
                                {pnlPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                {pnlPositive ? '+' : ''}{pnlPercent.toFixed(2)}% all-time
                            </div>
                        </div>

                        <div className="flex gap-6 mt-4">
                            <div>
                                <p className="text-muted-foreground text-xs">Invested</p>
                                <p className="font-heading text-base font-semibold text-foreground mt-0.5">
                                    {balanceHidden ? '••••' : fmt(investedAmount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">Total Gain</p>
                                <p className={`font-heading text-base font-semibold mt-0.5 ${pnlPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {balanceHidden ? '••••' : `${pnlPositive ? '+' : ''}${fmt(totalPnL)}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: '24h Change', value: '+$2,341', sub: '+2.5%', positive: true },
                        { label: 'Best Performer', value: 'SOL', sub: '+5.2% today', positive: true },
                        { label: 'Active Strategies', value: '2', sub: 'AI Alpha, Balanced', positive: null },
                        { label: 'Pending', value: '$1,000', sub: 'Withdrawal', positive: null },
                    ].map((s) => (
                        <div key={s.label} className="bg-card/60 backdrop-blur-md border border-border/60 rounded-xl p-4">
                            <p className="text-muted-foreground text-xs">{s.label}</p>
                            <p className="font-heading text-xl font-bold text-foreground mt-1">{s.value}</p>
                            <p className={`text-xs mt-0.5 ${s.positive === true ? 'text-emerald-400' : s.positive === false ? 'text-red-400' : 'text-muted-foreground'
                                }`}>
                                {s.sub}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Chart + Allocation */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Area chart */}
                    <div className="xl:col-span-2 bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                            <div>
                                <h3 className="font-heading text-base font-semibold text-foreground">Portfolio Performance</h3>
                                <p className="text-muted-foreground text-xs mt-0.5">Historical portfolio value</p>
                            </div>
                            <div className="flex gap-1 bg-secondary rounded-xl p-1">
                                {timeframes.map((tf) => (
                                    <button
                                        key={tf}
                                        onClick={() => setActiveTimeframe(tf)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${activeTimeframe === tf
                                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(255 60% 68%)" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="hsl(255 60% 68%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 20% 15%)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: 'hsl(228 10% 55%)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tick={{ fill: 'hsl(228 10% 55%)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                                    width={52}
                                />
                                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(255 60% 68%)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(255 60% 68%)"
                                    strokeWidth={2}
                                    fill="url(#portfolioGradient)"
                                    dot={false}
                                    activeDot={{ r: 5, fill: 'hsl(255 60% 68%)', stroke: 'hsl(228 50% 4%)', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Allocation */}
                    <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6">
                        <h3 className="font-heading text-base font-semibold text-foreground mb-1">Allocation</h3>
                        <p className="text-muted-foreground text-xs mb-4">By asset</p>
                        <div className="flex justify-center mb-4">
                            <PieChart width={180} height={180}>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={54}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>
                        <div className="space-y-2">
                            {holdings.slice(0, 5).map((h) => (
                                <div key={h.symbol} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                                    <span className="text-foreground text-xs font-medium w-10">{h.symbol}</span>
                                    <div className="flex-1 h-1.5 bg-border/60 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${h.allocation}%`, backgroundColor: h.color }} />
                                    </div>
                                    <span className="text-muted-foreground text-xs w-10 text-right">{h.allocation}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Holdings + Recent Transactions */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Holdings Table */}
                    <div className="xl:col-span-2 bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                            <h3 className="font-heading text-base font-semibold text-foreground">Holdings</h3>
                            <button onClick={() => navigate('/portfolio')} className="flex items-center gap-1 text-primary text-xs hover:text-primary/80 transition-colors">
                                View all <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        {['Asset', 'Price', '24h', 'Value', 'Allocation'].map((h) => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {holdings.slice(0, 5).map((h) => (
                                        <tr key={h.symbol} className="border-b border-border/20 hover:bg-secondary/40 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: h.color + '22' }}>
                                                        <span className="text-xs font-bold" style={{ color: h.color }}>{h.symbol[0]}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-foreground font-medium">{h.symbol}</p>
                                                        <p className="text-muted-foreground text-xs">{h.amount.toFixed(4)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-foreground">{fmt(h.price)}</td>
                                            <td className={`px-5 py-3.5 font-medium ${h.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {h.change24h >= 0 ? '+' : ''}{h.change24h}%
                                            </td>
                                            <td className="px-5 py-3.5 text-foreground font-medium">{fmt(h.value)}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-border/60 rounded-full overflow-hidden">
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

                    {/* Recent Transactions */}
                    <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                            <h3 className="font-heading text-base font-semibold text-foreground">Recent Activity</h3>
                            <button onClick={() => navigate('/transactions')} className="flex items-center gap-1 text-primary text-xs hover:text-primary/80 transition-colors">
                                See all <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="divide-y divide-border/30">
                            {recentTransactions.slice(0, 5).map((tx) => (
                                <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/40 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm flex-shrink-0">
                                        {txIcon[tx.type]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-foreground text-xs font-medium truncate">{tx.description}</p>
                                        <p className="text-muted-foreground text-xs">{fmtDate(tx.date)}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-xs font-semibold ${tx.amount > 0 ? 'text-emerald-400' : txColor[tx.type]}`}>
                                            {tx.amount > 0 ? '+' : ''}{fmt(Math.abs(tx.amount))}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${tx.status === 'completed' ? 'text-emerald-400/70' : 'text-amber-400/70'}`}>
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Price Alerts widget */}
                <PriceAlerts />

            </div>
        </>
    );
}
