import { useState } from 'react';
import { Download, FileText, Calendar, CheckCircle } from 'lucide-react';
import { recentTransactions } from '@/lib/mockData';

const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

function downloadCSV(year: string) {
    const txs = recentTransactions.filter(tx =>
        year === 'All' || new Date(tx.date).getFullYear().toString() === year
    );

    const rows = [
        ['Date', 'Description', 'Type', 'Amount (USD)', 'Status'],
        ...txs.map(tx => [
            new Date(tx.date).toLocaleDateString('en-US'),
            tx.description,
            tx.type,
            tx.amount.toFixed(2),
            tx.status,
        ]),
    ];

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yieldx_tax_report_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function TaxExport() {
    const [year, setYear] = useState('2026');
    const [downloaded, setDownloaded] = useState(false);

    const years = ['All', '2026', '2025', '2024'];

    const txsForYear = recentTransactions.filter(tx =>
        year === 'All' || new Date(tx.date).getFullYear().toString() === year
    );

    const totalDeposits = txsForYear.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
    const totalWithdrawals = txsForYear.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalYield = txsForYear.filter(t => t.type === 'yield').reduce((s, t) => s + t.amount, 0);
    const netGain = totalYield + (recentTransactions.filter(t => t.type === 'buy').reduce((s, t) => s + t.amount, 0));

    const handleDownload = () => {
        downloadCSV(year);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    };

    return (
        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-heading text-base font-semibold text-foreground">Tax Report Export</h3>
                    <p className="text-muted-foreground text-xs">Download your transaction history for tax filing</p>
                </div>
            </div>

            {/* Year selector */}
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground text-sm font-medium">Tax year:</span>
                <div className="flex gap-2 flex-wrap">
                    {years.map(y => (
                        <button
                            key={y}
                            onClick={() => setYear(y)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${year === y
                                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Deposits', value: fmt(totalDeposits), color: 'text-emerald-400' },
                    { label: 'Total Withdrawals', value: fmt(totalWithdrawals), color: 'text-red-400' },
                    { label: 'Yield Income', value: fmt(totalYield), color: 'text-teal-400' },
                    { label: 'Net Gain / Loss', value: fmt(netGain), color: netGain >= 0 ? 'text-emerald-400' : 'text-red-400' },
                ].map(s => (
                    <div key={s.label} className="bg-secondary/30 border border-border/40 rounded-xl p-3">
                        <p className="text-muted-foreground text-xs">{s.label}</p>
                        <p className={`font-heading text-base font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <p className="text-muted-foreground text-xs">{txsForYear.length} transactions found for {year === 'All' ? 'all years' : `tax year ${year}`}.</p>

            {/* Download button */}
            <button
                onClick={handleDownload}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${downloaded
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/25'
                    }`}
            >
                {downloaded ? (
                    <><CheckCircle className="w-4 h-4" /> Downloaded! Check your downloads folder</>
                ) : (
                    <><Download className="w-4 h-4" /> Download CSV Report ({year})</>
                )}
            </button>

            <p className="text-muted-foreground/60 text-xs text-center">
                Compatible with TurboTax, TaxBit, Koinly, and most tax software.
                PDF export available on Enterprise plan.
            </p>
        </div>
    );
}
