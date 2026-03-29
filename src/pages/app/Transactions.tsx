import { useState } from 'react';
import { Search, Filter, Download, FileText, X } from 'lucide-react';
import { recentTransactions } from '@/lib/mockData';
import TaxExport from '@/components/TaxExport';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const typeColors: Record<string, string> = {
    deposit: 'bg-emerald-500/15 text-emerald-400',
    buy: 'bg-primary/15 text-primary',
    yield: 'bg-teal-500/15 text-teal-400',
    withdrawal: 'bg-red-500/15 text-red-400',
};

const statusColors: Record<string, string> = {
    completed: 'bg-emerald-500/15 text-emerald-400',
    pending: 'bg-amber-500/15 text-amber-400',
    failed: 'bg-red-500/15 text-red-400',
};

const filterOptions = ['All', 'Deposit', 'Buy', 'Yield', 'Withdrawal'];

/* ─── Professional PDF Receipt generator ────────────────────── */
async function downloadReceipt(tx: (typeof recentTransactions)[number]) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const W = doc.internal.pageSize.getWidth();
    const sign = tx.amount > 0 ? '+' : '';
    const absAmount = Math.abs(tx.amount);
    const fmtAmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(absAmount);
    const dateStr = new Date(tx.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const isCredit = tx.amount > 0;

    // ── Background ──────────────────────────────────────────────
    // Dark header band
    doc.setFillColor(13, 17, 35);
    doc.rect(0, 0, W, 180, 'F');

    // Subtle purple glow circle top-right
    doc.setFillColor(100, 60, 200);
    doc.circle(W - 30, 0, 120, 'F');
    doc.setFillColor(13, 17, 35);
    doc.circle(W - 50, 20, 100, 'F');

    // Body background
    doc.setFillColor(18, 22, 42);
    doc.rect(0, 180, W, doc.internal.pageSize.getHeight() - 180, 'F');

    // ── Logo hexagon ────────────────────────────────────────────
    const cx = 50, cy = 55, r = 20;
    doc.setFillColor(100, 60, 200);
    const hexPts: [number, number][] = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    });
    doc.lines(hexPts.map(([x, y], i) => {
        const [nx, ny] = hexPts[(i + 1) % 6];
        return [nx - x, ny - y];
    }), hexPts[0][0], hexPts[0][1], [1, 1], 'F');

    // Logo text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('YieldX', 80, 62);

    // Tagline
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 150, 190);
    doc.text('AI-Powered Crypto Investment Platform', 80, 76);

    // "RECEIPT" label — top right
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(130, 100, 240);
    doc.text('TRANSACTION RECEIPT', W - 40, 45, { align: 'right' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 110, 150);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, W - 40, 58, { align: 'right' });

    // ── Amount hero ─────────────────────────────────────────────
    if (isCredit) {
        doc.setTextColor(52, 211, 153);  // emerald
    } else {
        doc.setTextColor(248, 113, 113); // red
    }
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sign}${fmtAmt}`, W / 2, 138, { align: 'center' });

    // Description
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 185, 220);
    doc.text(tx.description, W / 2, 158, { align: 'center' });

    // ── Divider line ────────────────────────────────────────────
    doc.setDrawColor(40, 46, 80);
    doc.setLineWidth(1);
    doc.line(40, 192, W - 40, 192);

    // ── Status pill ─────────────────────────────────────────────
    const statusColors: Record<string, [number, number, number]> = {
        completed: [52, 211, 153],
        pending: [251, 191, 36],
        failed: [239, 68, 68],
    };
    const typeColors: Record<string, [number, number, number]> = {
        deposit: [52, 211, 153],
        withdrawal: [239, 68, 68],
        buy: [139, 92, 246],
        yield: [45, 212, 191],
    };
    const sColor = statusColors[tx.status] ?? [150, 150, 150];
    const tColor = typeColors[tx.type] ?? [150, 150, 150];

    // Type badge
    doc.setFillColor(...tColor);
    doc.roundedRect(40, 204, 80, 20, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(tx.type.toUpperCase(), 80, 218, { align: 'center' });

    // Status badge
    doc.setFillColor(...sColor);
    doc.roundedRect(130, 204, 80, 20, 10, 10, 'F');
    doc.text(tx.status.toUpperCase(), 170, 218, { align: 'center' });

    // ── Details section ─────────────────────────────────────────
    const detailsY = 250;
    const rows: [string, string][] = [
        ['Transaction ID', tx.id],
        ['Date & Time', dateStr],
        ['Transaction Type', tx.type.charAt(0).toUpperCase() + tx.type.slice(1)],
        ['Status', tx.status.charAt(0).toUpperCase() + tx.status.slice(1)],
        ['Amount', `${sign}${fmtAmt} USD`],
    ];

    rows.forEach(([label, value], i) => {
        const y = detailsY + i * 42;

        // Row background (alternating)
        if (i % 2 === 0) {
            doc.setFillColor(24, 30, 55);
        } else {
            doc.setFillColor(20, 25, 46);
        }
        doc.roundedRect(40, y - 12, W - 80, 36, 4, 4, 'F');

        // Label
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 115, 160);
        doc.text(label.toUpperCase(), 55, y + 4);

        // Value
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 225, 255);
        if (label === 'Transaction ID') {
            doc.setFont('courier', 'bold');
            doc.setFontSize(9);
        }
        doc.text(value, W - 55, y + 4, { align: 'right', maxWidth: W - 240 });
        doc.setFont('helvetica', 'bold');
    });

    // ── Barcode-style verification band ─────────────────────────
    const bandY = detailsY + rows.length * 42 + 20;
    doc.setFillColor(22, 27, 50);
    doc.roundedRect(40, bandY, W - 80, 54, 6, 6, 'F');

    // Mini bar pattern (purely decorative)
    const barWidths = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2];
    let bx = 55;
    barWidths.forEach((bw, i) => {
        doc.setFillColor(i % 3 === 0 ? 110 : 80, i % 3 === 0 ? 70 : 50, i % 3 === 0 ? 220 : 170);
        doc.rect(bx, bandY + 10, bw, 22, 'F');
        bx += bw + 2;
    });

    doc.setFontSize(8);
    doc.setFont('courier', 'normal');
    doc.setTextColor(130, 140, 190);
    doc.text(`REF: ${tx.id} • YIELDX-${Date.now().toString(36).toUpperCase()}`, 55, bandY + 41);
    doc.setTextColor(80, 90, 150);
    doc.text('✓ VERIFIED TRANSACTION', W - 55, bandY + 28, { align: 'right' });
    doc.setFontSize(7);
    doc.text('Cryptographically signed by YieldX Platform', W - 55, bandY + 41, { align: 'right' });

    // ── Legal footer ─────────────────────────────────────────────
    const footerY = bandY + 80;
    doc.setDrawColor(35, 42, 72);
    doc.line(40, footerY, W - 40, footerY);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 90, 140);
    doc.text('YieldX Financial Services Ltd. • support@yieldx.io • yieldx.io', W / 2, footerY + 16, { align: 'center' });
    doc.text('This document is an official transaction confirmation issued by YieldX. Keep this receipt for your records.', W / 2, footerY + 30, { align: 'center' });
    doc.text('For disputes or queries, contact support within 30 days of the transaction date.', W / 2, footerY + 44, { align: 'center' });

    // ── Border decoration ────────────────────────────────────────
    doc.setDrawColor(70, 50, 160);
    doc.setLineWidth(2);
    doc.roundedRect(15, 15, W - 30, doc.internal.pageSize.getHeight() - 30, 8, 8);

    // ── Save ─────────────────────────────────────────────────────
    doc.save(`YieldX-Receipt-${tx.id}.pdf`);
    toast.success(`PDF receipt saved — YieldX-Receipt-${tx.id}.pdf`);
}

/* ─── Receipt preview modal ──────────────────────────────── */
function ReceiptModal({ tx, onClose }: { tx: (typeof recentTransactions)[number]; onClose: () => void }) {
    const sign = tx.amount > 0 ? '+' : '';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-heading text-sm font-semibold text-foreground">Transaction Receipt</span>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Amount */}
                    <div className="text-center py-4 bg-secondary/30 rounded-xl">
                        <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">Amount</p>
                        <p className={`font-heading text-3xl font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-foreground'}`}>
                            {sign}{fmt(Math.abs(tx.amount))}
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">{tx.description}</p>
                    </div>
                    {/* Details */}
                    <div className="space-y-3">
                        {[
                            { label: 'Transaction ID', value: tx.id, mono: true },
                            { label: 'Type', value: tx.type },
                            { label: 'Status', value: tx.status },
                            { label: 'Date', value: fmtDate(tx.date) },
                        ].map(r => (
                            <div key={r.label} className="flex justify-between items-center py-2 border-b border-border/30">
                                <span className="text-muted-foreground text-xs">{r.label}</span>
                                <span className={`text-foreground text-xs font-semibold ${r.mono ? 'font-mono' : ''} capitalize`}>{r.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm bg-secondary text-muted-foreground hover:text-foreground transition-all">Close</button>
                        <button onClick={() => downloadReceipt(tx)}
                            className="flex-1 py-2.5 rounded-xl text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Transactions() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [receiptTx, setReceiptTx] = useState<(typeof recentTransactions)[number] | null>(null);

    const filtered = recentTransactions.filter((tx) => {
        const matchesType = filter === 'All' || tx.type.toLowerCase() === filter.toLowerCase();
        const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {receiptTx && <ReceiptModal tx={receiptTx} onClose={() => setReceiptTx(null)} />}

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Deposited', value: '$13,800', color: 'text-emerald-400' },
                    { label: 'Total Withdrawn', value: '$1,000', color: 'text-red-400' },
                    { label: 'Yield Earned', value: '$328.50', color: 'text-teal-400' },
                    { label: 'Trades Made', value: '3', color: 'text-primary' },
                ].map((s) => (
                    <div key={s.label} className="bg-card/60 backdrop-blur-md border border-border/60 rounded-xl p-4">
                        <p className="text-muted-foreground text-xs">{s.label}</p>
                        <p className={`font-heading text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search transactions…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background/80 border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {filterOptions.map((opt) => (
                            <button key={opt} onClick={() => setFilter(opt)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === opt ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <Filter className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground text-sm">No transactions match your filters</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/30">
                                    {['Description', 'Type', 'Date', 'Amount', 'Status', ''].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((tx) => (
                                    <tr key={tx.id} className="border-b border-border/20 hover:bg-secondary/40 transition-colors group">
                                        <td className="px-5 py-4">
                                            <p className="text-foreground font-medium">{tx.description}</p>
                                            <p className="text-muted-foreground text-xs font-mono">{tx.id}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${typeColors[tx.type]}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground text-xs">{fmtDate(tx.date)}</td>
                                        <td className={`px-5 py-4 font-semibold font-heading ${tx.amount > 0 ? 'text-emerald-400' : 'text-foreground'}`}>
                                            {tx.amount > 0 ? '+' : ''}{fmt(Math.abs(tx.amount))}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[tx.status]}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setReceiptTx(tx)}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all bg-secondary/60 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg"
                                                title="View / Download Receipt"
                                            >
                                                <FileText className="w-3.5 h-3.5" /> Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Tax export */}
            <TaxExport />
        </div>
    );
}
