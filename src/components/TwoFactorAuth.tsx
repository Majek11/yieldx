import { useState } from 'react';
import { Shield, Smartphone, Copy, CheckCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';

// Mock TOTP secret (in production, generate server-side)
const MOCK_SECRET = 'JBSWY3DPEHPK3PXP';
const MOCK_QR = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/YieldX:user@yieldx.io?secret=${MOCK_SECRET}&issuer=YieldX`;

type Phase = 'disabled' | 'setup' | 'verify' | 'enabled';

export default function TwoFactorAuth() {
    const [phase, setPhase] = useState<Phase>('disabled');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [backupCodes] = useState(['8X4K-PQ2W', 'M9TR-LN7A', 'C3BV-YE5D', 'RJ6H-ZS8F', 'WG1P-DF4T', 'UB2N-KM0E']);
    const [showBackup, setShowBackup] = useState(false);

    const copySecret = () => {
        navigator.clipboard.writeText(MOCK_SECRET).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const verify = () => {
        // Demo: accept '123456' or any 6-digit code for testing
        if (code.length !== 6) { setError('Enter the 6-digit code from your authenticator app.'); return; }
        setError('');
        setPhase('enabled');
        setShowBackup(true);
    };

    const disable = () => {
        setPhase('disabled');
        setCode('');
        setError('');
        setShowBackup(false);
    };

    return (
        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-heading text-base font-semibold text-foreground">Two-Factor Authentication</h3>
                        <p className="text-muted-foreground text-xs">Add an extra layer of security to your account</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${phase === 'enabled' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-secondary text-muted-foreground'}`}>
                    {phase === 'enabled' ? '✓ Enabled' : 'Disabled'}
                </span>
            </div>

            {/* DISABLED state */}
            {phase === 'disabled' && (
                <div className="space-y-4">
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground text-xs leading-relaxed">2FA is not enabled. Your account is protected only by your password. We strongly recommend enabling 2FA for all accounts.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { step: '1', title: 'Download App', desc: 'Install Google Authenticator or Authy on your phone.' },
                            { step: '2', title: 'Scan QR Code', desc: 'Scan the QR code we generate with your authenticator app.' },
                            { step: '3', title: 'Verify Code', desc: 'Enter the 6-digit code to confirm setup.' },
                        ].map(s => (
                            <div key={s.step} className="bg-secondary/20 border border-border/30 rounded-xl p-3.5">
                                <div className="w-6 h-6 bg-primary/15 rounded-lg flex items-center justify-center text-primary text-xs font-bold mb-2">{s.step}</div>
                                <p className="text-foreground text-xs font-semibold mb-1">{s.title}</p>
                                <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setPhase('setup')}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                    >
                        <Smartphone className="w-4 h-4" /> Enable 2FA
                    </button>
                </div>
            )}

            {/* SETUP state */}
            {phase === 'setup' && (
                <div className="space-y-5">
                    <p className="text-foreground text-sm font-medium">Step 1: Scan this QR code with your authenticator app</p>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="bg-white p-3 rounded-xl flex-shrink-0">
                            <img src={MOCK_QR} alt="2FA QR Code" className="w-44 h-44" />
                        </div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <p className="text-muted-foreground text-xs mb-2">Or enter this secret key manually:</p>
                                <div className="flex items-center gap-2 bg-background/80 border border-border/60 rounded-xl px-3 py-2.5">
                                    <code className="text-foreground text-sm font-mono flex-1 tracking-widest">
                                        {showSecret ? MOCK_SECRET : '••••••••••••••••'}
                                    </code>
                                    <button onClick={() => setShowSecret(!showSecret)} className="text-muted-foreground hover:text-foreground transition-colors">
                                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button onClick={copySecret} className="text-muted-foreground hover:text-primary transition-colors">
                                        {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p><span className="text-foreground font-medium">Account:</span> user@yieldx.io</p>
                                <p><span className="text-foreground font-medium">Issuer:</span> YieldX</p>
                                <p><span className="text-foreground font-medium">Algorithm:</span> TOTP (SHA-1)</p>
                                <p><span className="text-foreground font-medium">Digits:</span> 6</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-foreground text-sm font-medium">Step 2: Enter the 6-digit code to confirm</p>
                    <input
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="000000"
                        value={code}
                        onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/60 transition-all"
                    />
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <p className="text-muted-foreground text-xs">(Demo: enter any 6 digits to activate)</p>

                    <div className="flex gap-2">
                        <button onClick={() => setPhase('disabled')} className="flex-1 py-3 rounded-xl text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 transition-all">Cancel</button>
                        <button onClick={verify} className="flex-1 py-3 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25">
                            Confirm & Enable
                        </button>
                    </div>
                </div>
            )}

            {/* ENABLED state */}
            {phase === 'enabled' && (
                <div className="space-y-4">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground text-xs leading-relaxed">2FA is active. Your account is now protected with time-based one-time passwords. You'll be asked for a 2FA code when logging in from a new device.</p>
                    </div>

                    {showBackup && (
                        <div className="bg-secondary/20 border border-border/40 rounded-xl p-4 space-y-3">
                            <p className="text-foreground text-sm font-semibold">⚠️ Save your backup codes</p>
                            <p className="text-muted-foreground text-xs">Store these in a safe place. Each code can be used once if you lose access to your authenticator app.</p>
                            <div className="grid grid-cols-3 gap-2">
                                {backupCodes.map(code => (
                                    <code key={code} className="bg-background/80 border border-border/60 rounded-lg px-3 py-2 text-xs text-foreground font-mono text-center">{code}</code>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={disable} className="w-full py-3 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
                        Disable 2FA
                    </button>
                </div>
            )}
        </div>
    );
}
