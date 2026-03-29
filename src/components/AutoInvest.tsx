import { useState } from 'react';
import { Repeat, DollarSign, CalendarDays, CheckCircle, PauseCircle, PlayCircle, Trash2, Plus } from 'lucide-react';

const funds = [
    { id: 'ai-alpha', name: 'AI Alpha Fund', risk: 'Aggressive', ytd: '+184.2%', color: '#7C3AED' },
    { id: 'balanced', name: 'Balanced Growth', risk: 'Moderate', ytd: '+67.5%', color: '#2563EB' },
    { id: 'defi-yield', name: 'DeFi Yield Optimizer', risk: 'Moderate-High', ytd: '+93.1%', color: '#059669' },
    { id: 'conservative', name: 'Conservative Crypto', risk: 'Low', ytd: '+24.8%', color: '#D97706' },
];

const frequencies = ['Weekly', 'Bi-weekly', 'Monthly'];

interface Plan {
    id: string;
    fund: string;
    amount: number;
    frequency: string;
    nextDate: string;
    active: boolean;
}

const initialPlans: Plan[] = [
    { id: '1', fund: 'Balanced Growth', amount: 500, frequency: 'Monthly', nextDate: 'Apr 1, 2026', active: true },
];

export default function AutoInvest() {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [showNew, setShowNew] = useState(false);
    const [newFund, setNewFund] = useState(funds[1].name);
    const [newAmount, setNewAmount] = useState('100');
    const [newFreq, setNewFreq] = useState('Monthly');
    const [saved, setSaved] = useState(false);

    const toggle = (id: string) =>
        setPlans(p => p.map(plan => plan.id === id ? { ...plan, active: !plan.active } : plan));

    const remove = (id: string) =>
        setPlans(p => p.filter(plan => plan.id !== id));

    const save = () => {
        if (Number(newAmount) < 10) return;
        const next = new Date();
        next.setDate(next.getDate() + (newFreq === 'Weekly' ? 7 : newFreq === 'Bi-weekly' ? 14 : 30));
        setPlans(p => [...p, {
            id: Date.now().toString(),
            fund: newFund,
            amount: Number(newAmount),
            frequency: newFreq,
            nextDate: next.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            active: true,
        }]);
        setSaved(true);
        setTimeout(() => { setSaved(false); setShowNew(false); }, 2000);
    };

    const totalMonthly = plans
        .filter(p => p.active)
        .reduce((s, p) => s + (p.frequency === 'Weekly' ? p.amount * 4 : p.frequency === 'Bi-weekly' ? p.amount * 2 : p.amount), 0);

    return (
        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Repeat className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-heading text-base font-semibold text-foreground">Auto-Invest</h3>
                        <p className="text-muted-foreground text-xs">Recurring investments (DCA)</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-heading text-lg font-bold text-foreground">${totalMonthly.toLocaleString()}</p>
                    <p className="text-muted-foreground text-xs">per month</p>
                </div>
            </div>

            {/* Active plans */}
            {plans.length > 0 && (
                <div className="space-y-3">
                    {plans.map(plan => {
                        const fund = funds.find(f => f.name === plan.fund);
                        return (
                            <div key={plan.id} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${plan.active ? 'bg-secondary/20 border-border/40' : 'bg-secondary/10 border-border/20 opacity-60'}`}>
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: fund?.color ?? '#7C3AED' }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-foreground text-xs font-semibold truncate">{plan.fund}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-emerald-400 text-xs font-medium">${plan.amount.toLocaleString()}</span>
                                        <span className="text-muted-foreground text-xs">· {plan.frequency}</span>
                                        <span className="text-muted-foreground text-xs">· Next: {plan.nextDate}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                    <button onClick={() => toggle(plan.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title={plan.active ? 'Pause' : 'Resume'}>
                                        {plan.active ? <PauseCircle className="w-4 h-4 text-amber-400" /> : <PlayCircle className="w-4 h-4 text-emerald-400" />}
                                    </button>
                                    <button onClick={() => remove(plan.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* New plan form */}
            {showNew && (
                <div className="bg-secondary/20 border border-border/40 rounded-xl p-4 space-y-4">
                    <p className="text-foreground text-sm font-semibold">New Auto-Invest Plan</p>

                    <div>
                        <label className="block text-xs text-muted-foreground mb-2">Fund</label>
                        <div className="grid grid-cols-2 gap-2">
                            {funds.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setNewFund(f.name)}
                                    className={`p-2.5 rounded-lg border text-left transition-all ${newFund === f.name ? 'border-primary/60 bg-primary/10' : 'border-border/40 hover:border-border'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                                        <p className="text-foreground text-xs font-medium truncate">{f.name}</p>
                                    </div>
                                    <p className="text-xs text-emerald-400 font-medium mt-0.5 ml-4">{f.ytd} YTD</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-2">Amount (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <input
                                    type="number"
                                    min="10"
                                    value={newAmount}
                                    onChange={e => setNewAmount(e.target.value)}
                                    className="w-full bg-background/80 border border-border rounded-xl pl-8 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-2">Frequency</label>
                            <select
                                value={newFreq}
                                onChange={e => setNewFreq(e.target.value)}
                                className="w-full bg-background/80 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all"
                            >
                                {frequencies.map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 transition-all">Cancel</button>
                        <button
                            onClick={save}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                        >
                            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save Plan'}
                        </button>
                    </div>
                </div>
            )}

            {!showNew && (
                <button
                    onClick={() => setShowNew(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 text-sm transition-all duration-200"
                >
                    <Plus className="w-4 h-4" /> Add Auto-Invest Plan
                </button>
            )}

            <p className="text-muted-foreground/60 text-xs text-center">
                Funds are automatically drawn from your wallet on the scheduled date.
            </p>
        </div>
    );
}
