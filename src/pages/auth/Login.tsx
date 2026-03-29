import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LogoLoader from '@/components/LogoLoader';

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

const stats = [
    { label: 'Assets Under Management', value: '$2.4B+' },
    { label: 'Active Investors', value: '50K+' },
    { label: 'Avg. Annual Return', value: '+127%' },
];

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            await login(data.email, data.password);
            toast.success('Welcome back!');
            // Admins go to /admin, regular users to /dashboard
            const redirectTo = data.email.toLowerCase() === 'admin@yieldx.io' ? '/admin' : from;
            navigate(redirectTo, { replace: true });
        } catch {
            toast.error('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left brand panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                </div>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 relative z-10">
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

                {/* Hero quote */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-primary text-xs font-medium">AI-Powered Crypto Investing</span>
                    </div>
                    <h1 className="font-heading text-5xl font-semibold text-foreground leading-[1.1] mb-6">
                        Smarter returns,<br />
                        <span className="text-gradient">every single day.</span>
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                        Join 50,000+ investors letting our AI work 24/7 to grow their crypto portfolios with institutional-grade strategies.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-8 mt-10">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature chips */}
                <div className="flex flex-wrap gap-3 relative z-10">
                    {[
                        { icon: Shield, label: 'CertiK Audited' },
                        { icon: Zap, label: 'Instant Withdrawals' },
                        { icon: TrendingUp, label: 'Proven Returns' },
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 bg-card/60 border border-border/60 rounded-full px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm">
                            <Icon className="w-3.5 h-3.5 text-primary" />
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                        <svg width="32" height="32" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
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
                        <span className="font-heading text-lg font-semibold text-foreground">YieldX</span>
                    </Link>

                    {/* Card */}
                    <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-8">
                        <div className="mb-8">
                            <h2 className="font-heading text-2xl font-semibold text-foreground">Welcome back</h2>
                            <p className="text-muted-foreground text-sm mt-1">Sign in to your YieldX account</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-2">Email address</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="login-password" className="block text-sm font-medium text-foreground">Password</label>
                                    <Link to="/forgot-password" className="text-primary text-xs hover:text-primary/80 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                id="login-submit"
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <LogoLoader size="sm" showText={false} inline />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-border/60" />
                            <span className="text-muted-foreground text-xs">or continue with</span>
                            <div className="flex-1 h-px bg-border/60" />
                        </div>

                        {/* OAuth placeholder buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            {['Google', 'Apple'].map((provider) => (
                                <button
                                    key={provider}
                                    type="button"
                                    className="flex items-center justify-center gap-2 bg-background/80 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
                                >
                                    {provider === 'Google' ? (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.05 1.2-2.03 3.58.03 2.85 2.5 3.8 2.52 3.81z" />
                                            <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                    )}
                                    {provider}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-center text-muted-foreground text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                            Create one free
                        </Link>
                    </p>

                    {/* Demo credentials hint */}
                    <div className="mt-5 bg-primary/5 border border-primary/15 rounded-xl p-4 space-y-1.5">
                        <p className="text-primary text-xs font-semibold mb-2">🔑 Demo Credentials</p>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">User login</span>
                            <span className="text-foreground font-mono">user@yieldx.io / User1234!</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Admin login</span>
                            <span className="text-foreground font-mono">admin@yieldx.io / Admin1234!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
