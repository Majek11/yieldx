import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Copy, Check, ArrowDown, ArrowUp, Plus, Trash2, Tag,
    Wallet as WalletIcon, QrCode, ChevronDown, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import CryptoIcon from '@/components/CryptoIcon';
import { useAuth } from '@/contexts/AuthContext';

/* ─── Chain config ─────────────────────────────────────────── */
const CHAINS = [
    { id: 'eth', name: 'Ethereum (ERC-20)', symbol: 'ETH', color: '#627EEA', warning: 'Only send ERC-20 tokens. Sending other assets may result in permanent loss.' },
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A', warning: 'Only send BTC to this address.' },
    { id: 'sol', name: 'Solana (SPL)', symbol: 'SOL', color: '#9945FF', warning: 'Only send SOL or SPL tokens to this address.' },
    { id: 'usdt-trc', name: 'USDT (TRC-20 / Tron)', symbol: 'USDT', color: '#26A17B', warning: 'Only send TRC-20 USDT. Do NOT send ERC-20 USDT here.' },
    { id: 'bnb', name: 'BNB Smart Chain (BEP-20)', symbol: 'BNB', color: '#F3BA2F', warning: 'Only send BEP-20 tokens to this address.' },
    { id: 'usdc', name: 'USDC (ERC-20)', symbol: 'USDC', color: '#2775CA', warning: 'Only send ERC-20 USDC to this address.' },
];

// Demo deposit addresses (admin-configured in real backend)
const DEPOSIT_ADDRESSES: Record<string, string> = {
    eth: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    sol: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKH',
    'usdt-trc': 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    bnb: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    usdc: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
};

/* ─── Wallet connect options ────────────────────────────────── */
const WALLET_CONNECTORS = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', chain: 'Ethereum / EVM' },
    { id: 'phantom', name: 'Phantom', icon: '👻', chain: 'Solana' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', chain: 'Multi-chain' },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️', chain: 'Multi-chain' },
];

interface SavedWallet {
    id: string;
    label: string;
    address: string;
    chain: string;
    chainId: string;
}

const INITIAL_WALLETS: SavedWallet[] = [
    { id: 'w1', label: 'My ETH Wallet', address: '0xAbc...4F92', chain: 'Ethereum (ERC-20)', chainId: 'eth' },
    { id: 'w2', label: 'BTC Cold Storage', address: 'bc1q...wlh', chain: 'Bitcoin', chainId: 'btc' },
];

// QR code via free API
const qrUrl = (data: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=0d0d1a&color=ffffff&data=${encodeURIComponent(data)}`;

const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(text).catch(() => { }); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000); }}
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
        >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
    );
}

export default function Wallet() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const kycApproved = user?.kycStatus === 'approved';

    const [tab, setTab] = useState<'deposit' | 'withdraw' | 'wallets'>('deposit');
    // Auto-switch to deposit tab if #deposit hash present
    useEffect(() => {
        if (location.hash === '#deposit') setTab('deposit');
    }, [location.hash]);

    // Deposit state
    const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
    const [showQr, setShowQr] = useState(false);
    // Withdraw state
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawChain, setWithdrawChain] = useState(CHAINS[0]);
    const [withdrawAddress, setWithdrawAddress] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);
    // Wallets state
    const [wallets, setWallets] = useState<SavedWallet[]>(INITIAL_WALLETS);
    const [addingWallet, setAddingWallet] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newChainId, setNewChainId] = useState('eth');
    const [editLabel, setEditLabel] = useState<string | null>(null);

    const address = DEPOSIT_ADDRESSES[selectedChain.id];
    const chain = CHAINS.find(c => c.id === selectedChain.id) ?? CHAINS[0];

    const handleWithdraw = async () => {
        if (!kycApproved) { toast.error('Complete KYC verification before withdrawing'); navigate('/settings'); return; }
        if (!withdrawAmount || Number(withdrawAmount) < 10) { toast.error('Minimum withdrawal is $10'); return; }
        if (!withdrawAddress.trim()) { toast.error('Enter a destination address'); return; }
        setWithdrawing(true);
        await new Promise(r => setTimeout(r, 1500));
        setWithdrawing(false);
        toast.success(`Withdrawal of $${withdrawAmount} submitted — processing in 1-2 business days`);
        setWithdrawAmount(''); setWithdrawAddress('');
    };

    const addWallet = () => {
        if (!newLabel.trim() || !newAddress.trim()) { toast.error('Fill in all fields'); return; }
        const c = CHAINS.find(c => c.id === newChainId)!;
        setWallets(p => [...p, { id: `w-${Date.now()}`, label: newLabel, address: newAddress, chain: c.name, chainId: newChainId }]);
        setNewLabel(''); setNewAddress(''); setAddingWallet(false);
        toast.success('Wallet saved');
    };

    const deleteWallet = (id: string) => { setWallets(p => p.filter(w => w.id !== id)); toast.success('Wallet removed'); };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Balance cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Available Balance', value: fmt(97478), color: 'text-foreground' },
                    { label: 'Invested', value: fmt(35000), color: 'text-primary' },
                    { label: 'Pending Withdrawal', value: fmt(1000), color: 'text-amber-400' },
                ].map(c => (
                    <div key={c.label} className="bg-card/60 backdrop-blur-md border border-border/60 rounded-xl p-4">
                        <p className="text-muted-foreground text-xs">{c.label}</p>
                        <p className={`font-heading text-lg font-bold mt-1 ${c.color}`}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Tab toggle */}
            <div className="flex gap-1 bg-secondary rounded-xl p-1 w-fit">
                {([
                    { key: 'deposit', icon: ArrowDown, label: 'Deposit' },
                    { key: 'withdraw', icon: ArrowUp, label: 'Withdraw' },
                    { key: 'wallets', icon: WalletIcon, label: 'My Wallets' },
                ] as const).map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Icon className="w-4 h-4" />{label}
                    </button>
                ))}
            </div>

            {/* ── DEPOSIT ── */}
            {tab === 'deposit' && (
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 space-y-5">
                    <div>
                        <h3 className="font-heading text-base font-semibold text-foreground mb-1">Crypto Deposit</h3>
                        <p className="text-muted-foreground text-sm">Select a chain and send funds to your deposit address</p>
                    </div>

                    {/* Chain selector */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Select Network / Currency</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {CHAINS.map(c => (
                                <button key={c.id} onClick={() => { setSelectedChain(c); setShowQr(false); }}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${selectedChain.id === c.id ? 'border-primary/60 bg-primary/5' : 'border-border/60 hover:border-border bg-secondary/20'}`}>
                                    <CryptoIcon symbol={c.symbol} size={28} />
                                    <div className="min-w-0">
                                        <p className="text-foreground text-xs font-semibold truncate">{c.symbol}</p>
                                        <p className="text-muted-foreground text-[10px] truncate">{c.name.split('(')[0].trim()}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Address + QR */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                            Your {chain.symbol} Deposit Address
                        </label>
                        <div className="flex items-center gap-2 bg-background/80 border border-border rounded-xl px-4 py-3">
                            <code className="text-xs text-muted-foreground font-mono flex-1 break-all">{address}</code>
                            <CopyBtn text={address} />
                            <button onClick={() => setShowQr(!showQr)}
                                className="p-1.5 text-muted-foreground hover:text-primary transition-colors flex-shrink-0" title="Show QR">
                                <QrCode className="w-4 h-4" />
                            </button>
                        </div>

                        {showQr && (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <div className="bg-white p-3 rounded-xl">
                                    <img src={qrUrl(address)} alt="QR Code" className="w-44 h-44" />
                                </div>
                                <p className="text-muted-foreground text-xs">Scan with your crypto wallet app</p>
                            </div>
                        )}

                        <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                            <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠</span>
                            <p className="text-amber-400/80 text-xs leading-relaxed">{chain.warning}</p>
                        </div>

                        <div className="bg-secondary/30 rounded-xl px-4 py-3 space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">Network</span><span className="text-foreground font-medium">{chain.name}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Min. deposit</span><span className="text-foreground font-medium">0.001 {chain.symbol}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Confirmations required</span><span className="text-foreground font-medium">{chain.id === 'btc' ? '3' : chain.id === 'sol' ? '32' : '12'}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Estimated time</span><span className="text-foreground font-medium">{chain.id === 'btc' ? '30-60 min' : chain.id === 'sol' ? '< 1 min' : '3-5 min'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── WITHDRAW ── */}
            {tab === 'withdraw' && (
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 space-y-5">
                    <div>
                        <h3 className="font-heading text-base font-semibold text-foreground mb-1">Withdraw Funds</h3>
                        <p className="text-muted-foreground text-sm">Send crypto to an external wallet address</p>
                    </div>

                    {/* KYC gate banner */}
                    {!kycApproved && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-4">
                            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-400 text-sm font-semibold">KYC Verification Required</p>
                                <p className="text-red-400/80 text-xs mt-0.5">
                                    You must complete identity verification before making withdrawals.
                                    {user?.kycStatus === 'pending' && ' Your submission is under review (typically 24h).'}
                                </p>
                                {user?.kycStatus !== 'pending' && (
                                    <button onClick={() => navigate('/settings')}
                                        className="mt-2 text-xs text-red-400 underline hover:text-red-300 transition-colors">
                                        Complete verification →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Network */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Network</label>
                        <div className="relative">
                            <select value={withdrawChain.id} onChange={e => setWithdrawChain(CHAINS.find(c => c.id === e.target.value)!)}
                                className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all appearance-none">
                                {CHAINS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label htmlFor="w-amount" className="block text-sm font-medium text-foreground mb-2">Amount (USD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <input id="w-amount" type="number" placeholder="500" value={withdrawAmount}
                                onChange={e => setWithdrawAmount(e.target.value)}
                                className="w-full bg-background/80 border border-border rounded-xl pl-8 pr-20 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all" />
                            <button onClick={() => setWithdrawAmount('97478')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs font-medium hover:text-primary/80 transition-colors">MAX</button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {[500, 1000, 5000, 10000].map(v => (
                                <button key={v} onClick={() => setWithdrawAmount(String(v))}
                                    className="flex-1 bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs px-2 py-1.5 rounded-lg transition-colors">${v.toLocaleString()}</button>
                            ))}
                        </div>
                    </div>

                    {/* Destination */}
                    <div>
                        <label htmlFor="w-dest" className="block text-sm font-medium text-foreground mb-2">Destination Address</label>
                        <input id="w-dest" type="text" placeholder={`Your ${withdrawChain.symbol} wallet address`} value={withdrawAddress}
                            onChange={e => setWithdrawAddress(e.target.value)}
                            className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all" />
                        {wallets.filter(w => w.chainId === withdrawChain.id).length > 0 && (
                            <div className="mt-2 space-y-1">
                                <p className="text-muted-foreground text-xs mb-1">Saved wallets:</p>
                                {wallets.filter(w => w.chainId === withdrawChain.id).map(w => (
                                    <button key={w.id} onClick={() => setWithdrawAddress(w.address)}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/80 text-left transition-colors">
                                        <WalletIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                        <span className="text-foreground text-xs font-medium">{w.label}</span>
                                        <span className="text-muted-foreground text-xs font-mono ml-auto">{w.address}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Fee summary */}
                    <div className="bg-secondary/30 rounded-xl px-4 py-3 text-xs space-y-1">
                        {[
                            ['Amount', `$${withdrawAmount || '0.00'}`],
                            ['Network fee', `~$${withdrawChain.id === 'btc' ? '3.50' : withdrawChain.id === 'sol' ? '0.01' : '1.80'}`],
                            ['You receive', `$${withdrawAmount ? (Number(withdrawAmount) - (withdrawChain.id === 'btc' ? 3.5 : withdrawChain.id === 'sol' ? 0.01 : 1.8)).toFixed(2) : '0.00'}`],
                        ].map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                                <span className="text-muted-foreground">{k}</span>
                                <span className={`font-medium ${k === 'You receive' ? 'text-foreground' : 'text-muted-foreground'}`}>{v}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleWithdraw} disabled={withdrawing}
                        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-4 py-3.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2">
                        {withdrawing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowUp className="w-4 h-4" /> Submit Withdrawal</>}
                    </button>
                </div>
            )}

            {/* ── MY WALLETS ── */}
            {tab === 'wallets' && (
                <div className="space-y-4">
                    {/* Wallet Connect */}
                    <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-5">
                        <h3 className="font-heading text-sm font-semibold text-foreground mb-3">Connect Wallet</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {WALLET_CONNECTORS.map(w => (
                                <button key={w.id}
                                    onClick={() => toast.info(`${w.name} — Web3 provider connection requires backend integration`)}
                                    className="flex flex-col items-center gap-2 p-4 bg-secondary/30 hover:bg-secondary/60 border border-border/40 hover:border-primary/30 rounded-xl transition-all group">
                                    <span className="text-2xl">{w.icon}</span>
                                    <p className="text-foreground text-xs font-semibold">{w.name}</p>
                                    <p className="text-muted-foreground text-[10px]">{w.chain}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Saved wallets */}
                    <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                            <h3 className="font-heading text-sm font-semibold text-foreground">Saved Wallets</h3>
                            <button onClick={() => setAddingWallet(true)}
                                className="flex items-center gap-1.5 text-primary text-xs font-medium hover:text-primary/80 transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add Wallet
                            </button>
                        </div>

                        {addingWallet && (
                            <div className="px-5 py-4 border-b border-border/40 bg-secondary/10 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Label</label>
                                        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="My ETH Wallet"
                                            className="w-full bg-background/80 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Network</label>
                                        <select value={newChainId} onChange={e => setNewChainId(e.target.value)}
                                            className="w-full bg-background/80 border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all">
                                            {CHAINS.map(c => <option key={c.id} value={c.id}>{c.symbol} — {c.name.split('(')[0].trim()}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Wallet Address</label>
                                    <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="0x... or bc1q... or T..."
                                        className="w-full bg-background/80 border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setAddingWallet(false)} className="flex-1 py-2 rounded-xl text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 transition-all">Cancel</button>
                                    <button onClick={addWallet} className="flex-1 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">Save Wallet</button>
                                </div>
                            </div>
                        )}

                        <div className="divide-y divide-border/30">
                            {wallets.map(w => {
                                const c = CHAINS.find(c => c.id === w.chainId);
                                return (
                                    <div key={w.id} className="flex items-center gap-3 px-5 py-3.5 group hover:bg-secondary/20 transition-colors">
                                        <CryptoIcon symbol={c?.symbol ?? w.chainId} size={32} />
                                        <div className="flex-1 min-w-0">
                                            {editLabel === w.id ? (
                                                <input autoFocus defaultValue={w.label} onBlur={e => { setWallets(p => p.map(x => x.id === w.id ? { ...x, label: e.target.value } : x)); setEditLabel(null); }}
                                                    className="bg-background/80 border border-primary/60 rounded-lg px-2 py-0.5 text-xs text-foreground focus:outline-none w-full" />
                                            ) : (
                                                <p className="text-foreground text-xs font-semibold">{w.label}</p>
                                            )}
                                            <p className="text-muted-foreground text-xs font-mono truncate">{w.address}</p>
                                            <p className="text-muted-foreground text-[10px]">{w.chain}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                            <CopyBtn text={w.address} />
                                            <button onClick={() => setEditLabel(w.id)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Rename">
                                                <Tag className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => deleteWallet(w.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors" title="Delete">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {wallets.length === 0 && (
                                <div className="py-10 text-center">
                                    <WalletIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                                    <p className="text-muted-foreground text-sm">No wallets saved yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
