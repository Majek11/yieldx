import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from 'lucide-react';

interface Message {
    role: 'assistant' | 'user';
    text: string;
    ts: Date;
}

// Pre-baked smart responses keyed on keywords
const respond = (input: string): string => {
    const q = input.toLowerCase();

    if (/portfolio|balance|value|worth/.test(q))
        return "Your portfolio is currently valued at $93,241.82, up +127.6% since inception. Your best performer this month is SOL (+15.2%). Would you like a detailed breakdown by fund?";
    if (/bitcoin|btc/.test(q))
        return "BTC is currently trading at ~$94,210 (+2.3% today). Our AI Alpha Fund holds 42% BTC allocation. Based on current on-chain signals (increasing exchange outflows, rising miner HODLing), our model maintains a bullish bias for the next 30 days.";
    if (/ethereum|eth/.test(q))
        return "ETH is at ~$3,512 (+1.9% today). Our DeFi Yield Optimizer is actively providing liquidity on Uniswap v3 ETH/USDC with a current APY of 18.4%, net of IL risk.";
    if (/defi|yield|apy|apr/.test(q))
        return "Our DeFi strategies are currently generating 42% average APY across Aave, Curve, and Uniswap v3 positions. All protocols pass our 47-point security checklist. Would you like to allocate more to the DeFi Yield Optimizer?";
    if (/ai alpha|alpha fund/.test(q))
        return "The AI Alpha Fund is our flagship strategy. It uses 3 signal layers — on-chain analytics, macro momentum, and cross-asset correlations — updating every 15 minutes. Current YTD: +184.2%. Sharpe ratio: 2.1.";
    if (/risk|strategy|safe/.test(q))
        return "Based on your profile settings (Moderate risk), you're in the Balanced Growth Fund. If you'd like to shift to more conservative (Conservative Crypto, ~25% YTD) or aggressive (AI Alpha Fund, ~184% YTD), you can do so from the Invest page.";
    if (/withdraw|withdrawal/.test(q))
        return "Withdrawals process in 1-3 business days for bank transfers, or instantly for stablecoin withdrawals. You currently have $92,241.82 available to withdraw. Go to the Wallet page to initiate a withdrawal.";
    if (/deposit|add money|invest more/.test(q))
        return "You can deposit via bank transfer (1-2 days), card (instant, 1.5% fee), or crypto (instant, no fee). Go to Wallet → Deposit to get started. Minimum deposit is $100.";
    if (/kyc|verify|verification/.test(q))
        return "Your KYC is currently approved ✅. You have full access to all deposit, withdrawal, and investment features with no limits.";
    if (/tax|report|export/.test(q))
        return "You can export your tax report (CSV/PDF) from the Transactions page using the 'Export' button. It includes all capital gains, income, and losses for the selected year — compatible with most tax software.";
    if (/fee|cost|charge/.test(q))
        return "YieldX fees: 0.5% management fee (Pro plan) + 20% performance fee on profits above the high-water mark. There are no deposit fees. Withdrawal fees depend on method (free for bank, 0.1% for crypto).";
    if (/referral|refer|invite/.test(q))
        return "Your referral program earns you 10% of referred users' management fees for 12 months, plus a $50 bonus per referral. Check the Referral page for your unique link and earnings.";
    if (/help|what can you do|support/.test(q))
        return "I can help you with: portfolio performance, market analysis, fund explanations, deposit/withdrawal questions, fees, KYC, referrals, and strategy recommendations. What would you like to know?";
    if (/hello|hi|hey/.test(q))
        return "Hey! 👋 I'm your YieldX AI advisor. I can explain your portfolio performance, answer market questions, and guide you through investing decisions. What's on your mind?";

    return "That's a great question. Based on current market conditions and your portfolio allocation, I'd recommend reviewing your risk settings in the Invest page. For more specific guidance, our support team is available 24/7 at hello@yieldx.io. Is there anything else I can help you with?";
};

export default function AIChatWidget() {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            text: "Hi! I'm your YieldX AI Portfolio Advisor 🤖 Ask me anything about your portfolio, market conditions, or investment strategies.",
            ts: new Date(),
        },
    ]);
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open, minimized]);

    const send = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMsg: Message = { role: 'user', text: trimmed, ts: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        // Simulate AI thinking delay
        await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

        const reply = respond(trimmed);
        setMessages(prev => [...prev, { role: 'assistant', text: reply, ts: new Date() }]);
        setTyping(false);
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };

    const suggestions = ['How is my portfolio doing?', 'Tell me about BTC', 'What are the fees?', 'How do I withdraw?'];

    return (
        <>
            {/* Floating button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 group"
                    aria-label="Open AI advisor"
                >
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping absolute" />
                        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    </span>
                </button>
            )}

            {/* Chat window */}
            {open && (
                <div
                    className={`fixed bottom-6 right-6 z-50 w-[360px] bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/40 flex flex-col transition-all duration-300 ${minimized ? 'h-14' : 'h-[520px]'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-foreground text-sm font-semibold">YieldX AI Advisor</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                <p className="text-muted-foreground text-xs">Online</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setMinimized(!minimized)}
                                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-all"
                            >
                                <Minimize2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {!minimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant'
                                            ? 'bg-primary/15 border border-primary/20'
                                            : 'bg-secondary border border-border/60'
                                            }`}>
                                            {msg.role === 'assistant'
                                                ? <Bot className="w-3.5 h-3.5 text-primary" />
                                                : <User className="w-3.5 h-3.5 text-muted-foreground" />
                                            }
                                        </div>
                                        <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                            <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'assistant'
                                                ? 'bg-secondary/60 text-foreground rounded-tl-sm'
                                                : 'bg-primary text-primary-foreground rounded-tr-sm'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-muted-foreground text-[10px]">
                                                {msg.ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {typing && (
                                    <div className="flex gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div className="bg-secondary/60 px-4 py-3 rounded-2xl rounded-tl-sm">
                                            <div className="flex gap-1.5">
                                                {[0, 1, 2].map(i => (
                                                    <div key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                                                        style={{ animationDelay: `${i * 0.15}s` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Suggestions */}
                            {messages.length <= 1 && (
                                <div className="px-4 pb-2 flex flex-wrap gap-2">
                                    {suggestions.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setInput(s); }}
                                            className="text-xs px-3 py-1.5 bg-secondary/60 border border-border/40 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div className="px-4 pb-4 pt-2 flex gap-2 flex-shrink-0 border-t border-border/50">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    placeholder="Ask anything about your portfolio…"
                                    className="flex-1 bg-background/80 border border-border/60 rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all"
                                />
                                <button
                                    onClick={send}
                                    disabled={!input.trim() || typing}
                                    className="w-9 h-9 bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
