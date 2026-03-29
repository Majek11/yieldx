import { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

const COINS = [
    { symbol: 'BTC', name: 'Bitcoin', price: 71240.50, color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', price: 3842.10, color: '#627EEA' },
    { symbol: 'SOL', name: 'Solana', price: 182.40, color: '#9945FF' },
    { symbol: 'BNB', name: 'BNB', price: 608.30, color: '#F3BA2F' },
    { symbol: 'USDT', name: 'Tether', price: 1.00, color: '#26A17B' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, color: '#2775CA' },
    { symbol: 'XRP', name: 'Ripple', price: 0.5842, color: '#346AA9' },
    { symbol: 'ADA', name: 'Cardano', price: 0.4621, color: '#0033AD' },
    { symbol: 'AVAX', name: 'Avalanche', price: 38.42, color: '#E84142' },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.1742, color: '#C2A633' },
];

interface Alert {
    id: string;
    symbol: string;
    name: string;
    condition: 'above' | 'below';
    targetPrice: number;
    currentPrice: number;
    isActive: boolean;
    createdAt: Date;
}

const STORAGE_KEY = 'yieldx_price_alerts';

function loadAlerts(): Alert[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch { return []; }
}

function saveAlerts(alerts: Alert[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

function fmtPrice(n: number) {
    if (n >= 1000) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
    if (n >= 1) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 }).format(n);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 6 }).format(n);
}

export default function PriceAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>(loadAlerts);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
    const [condition, setCondition] = useState<'above' | 'below'>('above');
    const [targetPrice, setTargetPrice] = useState('');

    const persist = (next: Alert[]) => { setAlerts(next); saveAlerts(next); };

    const addAlert = () => {
        const price = parseFloat(targetPrice);
        if (!price || price <= 0) { toast.error('Enter a valid target price'); return; }

        const newAlert: Alert = {
            id: crypto.randomUUID(),
            symbol: selectedCoin.symbol,
            name: selectedCoin.name,
            condition,
            targetPrice: price,
            currentPrice: selectedCoin.price,
            isActive: true,
            createdAt: new Date(),
        };
        persist([newAlert, ...alerts]);
        setTargetPrice('');
        setShowForm(false);
        toast.success(`Alert set: ${selectedCoin.symbol} ${condition} ${fmtPrice(price)}`);
    };

    const deleteAlert = (id: string) => {
        persist(alerts.filter(a => a.id !== id));
        toast.success('Alert removed');
    };

    const toggleAlert = (id: string) => {
        persist(alerts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    };

    const pctDiff = (current: number, target: number, condition: 'above' | 'below') => {
        const diff = ((target - current) / current) * 100;
        return { pct: Math.abs(diff).toFixed(2), up: condition === 'above' };
    };

    return (
        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">Price Alerts</h3>
                    {alerts.filter(a => a.isActive).length > 0 && (
                        <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                            {alerts.filter(a => a.isActive).length} active
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-xl font-medium transition-all"
                >
                    {showForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> New Alert</>}
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="px-5 py-4 border-b border-border/30 bg-secondary/20 space-y-3">
                    {/* Coin selector */}
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Cryptocurrency</label>
                        <div className="flex flex-wrap gap-1.5">
                            {COINS.map(coin => (
                                <button
                                    key={coin.symbol}
                                    onClick={() => { setSelectedCoin(coin); setTargetPrice(''); }}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${selectedCoin.symbol === coin.symbol
                                            ? 'border-primary/60 bg-primary/10 text-foreground'
                                            : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                                        }`}
                                >
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: coin.color }} />
                                    {coin.symbol}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current price display */}
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Current {selectedCoin.symbol} price:</span>
                        <span className="text-foreground font-semibold">{fmtPrice(selectedCoin.price)}</span>
                    </div>

                    {/* Condition + price */}
                    <div className="flex gap-2">
                        <div className="flex border border-border/50 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setCondition('above')}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${condition === 'above' ? 'bg-emerald-500/15 text-emerald-400 border-r border-border/50' : 'text-muted-foreground hover:text-foreground border-r border-border/50'
                                    }`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" /> Above
                            </button>
                            <button
                                onClick={() => setCondition('below')}
                                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${condition === 'below' ? 'bg-red-500/15 text-red-400' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <TrendingDown className="w-3.5 h-3.5" /> Below
                            </button>
                        </div>
                        <input
                            type="number"
                            value={targetPrice}
                            onChange={e => setTargetPrice(e.target.value)}
                            placeholder={`Target price (USD)`}
                            className="flex-1 bg-background/80 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all"
                        />
                    </div>

                    <button
                        onClick={addAlert}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl text-sm font-semibold transition-all"
                    >
                        <Check className="w-4 h-4" /> Set Alert
                    </button>
                </div>
            )}

            {/* Alert list */}
            <div className="divide-y divide-border/30">
                {alerts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                        <Bell className="w-8 h-8 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm">No price alerts yet</p>
                        <p className="text-muted-foreground/60 text-xs mt-1">Tap "New Alert" to get notified when prices hit your target</p>
                    </div>
                )}
                {alerts.map(alert => {
                    const coin = COINS.find(c => c.symbol === alert.symbol);
                    const { pct, up } = pctDiff(alert.currentPrice, alert.targetPrice, alert.condition);
                    return (
                        <div key={alert.id} className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${alert.isActive ? 'hover:bg-secondary/20' : 'opacity-50'}`}>
                            {/* Coin dot */}
                            <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                                style={{ background: coin?.color ?? '#666' }}>
                                {alert.symbol.slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground text-sm font-semibold">{alert.symbol}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${alert.condition === 'above' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                        {alert.condition === 'above' ? '↑' : '↓'} {alert.condition} {fmtPrice(alert.targetPrice)}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    {up ? '+' : '-'}{pct}% from current price · {new Date(alert.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {/* Toggle */}
                            <button onClick={() => toggleAlert(alert.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                                {alert.isActive
                                    ? <ToggleRight className="w-5 h-5 text-primary" />
                                    : <ToggleLeft className="w-5 h-5" />}
                            </button>
                            {/* Delete */}
                            <button onClick={() => deleteAlert(alert.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
