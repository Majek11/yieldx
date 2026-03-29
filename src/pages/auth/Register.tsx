import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LogoLoader from '@/components/LogoLoader';

/* -------------------------------------------------------------------------- */
/*                               Step schemas                                  */
/* -------------------------------------------------------------------------- */

const step1Schema = z
    .object({
        email: z.string().email('Enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

const step2Schema = z.object({
    name: z.string().min(2, 'Enter your full name'),
    phone: z
        .string()
        .min(7, 'Enter a valid phone number')
        .regex(/^[+]?[0-9\s\-().]{7,20}$/, 'Enter a valid phone number (e.g. +1 555 000 0000)'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

/* -------------------------------------------------------------------------- */
/*                           Password strength bar                             */
/* -------------------------------------------------------------------------- */

const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

/* -------------------------------------------------------------------------- */
/*                                Component                                    */
/* -------------------------------------------------------------------------- */

export default function Register() {
    const [step, setStep] = useState(1);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    const { register: authRegister, isLoading } = useAuth();
    const navigate = useNavigate();

    /* Step 1 form */
    const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
    const password = form1.watch('password', '');
    const strength = getStrength(password);

    /* Step 2 form */
    const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });

    const handleStep1 = (data: Step1Data) => {
        setStep1Data(data);
        setStep(2);
    };

    const handleStep2 = (_data: Step2Data) => {
        setStep(3);
        startResendCooldown();
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((c) => {
                if (c <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
    };

    const handleVerify = async () => {
        if (otp.length !== 6) {
            setOtpError('Enter the 6-digit code');
            return;
        }
        if (otp !== '123456') {
            setOtpError('Incorrect code. (Hint: use 123456 for demo)');
            return;
        }
        setOtpError('');
        const s2 = form2.getValues();
        await authRegister({
            email: step1Data!.email,
            password: step1Data!.password,
            name: s2.name,
            phone: s2.phone,
        });
        toast.success('Account created! Welcome to YieldX 🎉');
        setStep(4);
        setTimeout(() => navigate('/settings?tab=kyc'), 1500);
    };

    const steps = ['Account', 'Details', 'Verify'];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
                    <svg width="36" height="36" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                        {/* Purple Circle Ring */}
                        <circle cx="120" cy="120" r="95" fill="none" stroke="#7C3AED" strokeWidth="24" strokeLinecap="round"/>
                        {/* S-Curve Arrow Path */}
                        <g transform="translate(120, 120)">
                            <path d="M -50 30 Q -30 0 0 -15 Q 30 -25 50 -35" 
                                  fill="none" stroke="#7C3AED" strokeWidth="14" 
                                  strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        {/* Emerald Green Dot */}
                        <circle cx="170" cy="85" r="12" fill="#10B981"/>
                    </svg>
                    <span className="font-heading text-xl font-semibold text-foreground tracking-wide">YieldX</span>
                </Link>

                {/* Progress stepper */}
                {step < 4 && (
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {steps.map((label, i) => {
                            const idx = i + 1;
                            const isComplete = step > idx;
                            const isActive = step === idx;
                            return (
                                <div key={label} className="flex items-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${isComplete
                                                ? 'bg-emerald-500 text-white'
                                                : isActive
                                                    ? 'bg-primary text-white'
                                                    : 'bg-border text-muted-foreground'
                                                }`}
                                        >
                                            {isComplete ? <Check className="w-4 h-4" /> : idx}
                                        </div>
                                        <span
                                            className={`text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div
                                            className={`w-16 h-px mx-2 mb-5 transition-all duration-500 ${step > idx ? 'bg-emerald-500' : 'bg-border'
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Card */}
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-8">

                    {/* ---- STEP 1: Account ---- */}
                    {step === 1 && (
                        <>
                            <div className="mb-6">
                                <h2 className="font-heading text-2xl font-semibold text-foreground">Create your account</h2>
                                <p className="text-muted-foreground text-sm mt-1">Start your crypto investment journey</p>
                            </div>
                            <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-4">
                                <div>
                                    <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-2">Email address</label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...form1.register('email')}
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                    {form1.formState.errors.email && (
                                        <p className="text-red-400 text-xs mt-1.5">{form1.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            id="reg-password"
                                            type={showPw ? 'text' : 'password'}
                                            placeholder="Min. 8 characters"
                                            {...form1.register('password')}
                                            className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                        />
                                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="mt-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((n) => (
                                                    <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: n <= strength ? strengthColor[strength] : 'hsl(var(--border))' }} />
                                                ))}
                                            </div>
                                            <p className="text-xs mt-1" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</p>
                                        </div>
                                    )}
                                    {form1.formState.errors.password && (
                                        <p className="text-red-400 text-xs mt-1.5">{form1.formState.errors.password.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="reg-confirm" className="block text-sm font-medium text-foreground mb-2">Confirm password</label>
                                    <div className="relative">
                                        <input
                                            id="reg-confirm"
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Repeat your password"
                                            {...form1.register('confirmPassword')}
                                            className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {form1.formState.errors.confirmPassword && (
                                        <p className="text-red-400 text-xs mt-1.5">{form1.formState.errors.confirmPassword.message}</p>
                                    )}
                                </div>
                                <button type="submit" id="register-step1-next" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 mt-2">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}

                    {/* ---- STEP 2: Details ---- */}
                    {step === 2 && (
                        <>
                            <div className="mb-6">
                                <h2 className="font-heading text-2xl font-semibold text-foreground">Your details</h2>
                                <p className="text-muted-foreground text-sm mt-1">Help us personalise your experience</p>
                            </div>
                            <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-4">
                                <div>
                                    <label htmlFor="reg-name" className="block text-sm font-medium text-foreground mb-2">Full name</label>
                                    <input
                                        id="reg-name"
                                        type="text"
                                        placeholder="John Doe"
                                        {...form2.register('name')}
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                    {form2.formState.errors.name && (
                                        <p className="text-red-400 text-xs mt-1.5">{form2.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="reg-phone" className="block text-sm font-medium text-foreground mb-2">
                                        Phone number
                                    </label>
                                    <input
                                        id="reg-phone"
                                        type="tel"
                                        placeholder="+1 555 000 0000"
                                        {...form2.register('phone')}
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                    {form2.formState.errors.phone && (
                                        <p className="text-red-400 text-xs mt-1.5">{form2.formState.errors.phone.message}</p>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button type="submit" id="register-step2-next" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* ---- STEP 3: Verify ---- */}
                    {step === 3 && (
                        <>
                            <div className="mb-6">
                                <h2 className="font-heading text-2xl font-semibold text-foreground">Verify your email</h2>
                                <p className="text-muted-foreground text-sm mt-1">
                                    We sent a 6-digit code to <span className="text-foreground font-medium">{step1Data?.email}</span>
                                </p>
                                <p className="text-primary text-xs mt-2">(Demo: use code 123456)</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="otp-input" className="block text-sm font-medium text-foreground mb-2">Verification code</label>
                                    <input
                                        id="otp-input"
                                        type="text"
                                        maxLength={6}
                                        inputMode="numeric"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] text-foreground placeholder:text-muted-foreground/30 placeholder:tracking-normal focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                    {otpError && <p className="text-red-400 text-xs mt-1.5">{otpError}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setStep(2)} className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button
                                        type="button"
                                        id="register-verify"
                                        onClick={handleVerify}
                                        disabled={isLoading}
                                        className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <LogoLoader size="sm" showText={false} inline />
                                        ) : (
                                            <>Verify & Create Account</>
                                        )}
                                    </button>
                                </div>

                                <p className="text-center text-muted-foreground text-xs">
                                    Didn't receive it?{' '}
                                    {resendCooldown > 0 ? (
                                        <span className="text-muted-foreground">Resend in {resendCooldown}s</span>
                                    ) : (
                                        <button type="button" onClick={startResendCooldown} className="text-primary hover:text-primary/80 font-medium transition-colors">
                                            Resend code
                                        </button>
                                    )}
                                </p>
                            </div>
                        </>
                    )}

                    {/* ---- STEP 4: Success ---- */}
                    {step === 4 && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                <Check className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">You're all set!</h2>
                            <p className="text-muted-foreground text-sm mb-6">Your account has been created. Redirecting to your dashboard…</p>
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    )}
                </div>

                {step < 4 && (
                    <p className="text-center text-muted-foreground text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
