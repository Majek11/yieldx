import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Check } from 'lucide-react';
import { toast } from 'sonner';
import LogoLoader from '@/components/LogoLoader';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
    const [sent, setSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setIsLoading(false);
        setSent(true);
        toast.success('Reset link sent!');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <Link to="/" className="flex items-center gap-2.5 mb-8 justify-center">
                    <svg width="36" height="36" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                        {/* Purple Circle Ring */}
                        <circle cx="120" cy="120" r="95" fill="none" stroke="#7C3AED" strokeWidth="24" strokeLinecap="round"/>
                        
                        {/* S-Curve Arrow Path */}
                        <g transform="translate(120, 120)">
                            {/* Smooth S-curve line */}
                            <path d="M -50 30 Q -30 0 0 -15 Q 30 -25 50 -35" 
                                  fill="none" 
                                  stroke="#7C3AED" 
                                  strokeWidth="14" 
                                  strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </g>
                        
                        {/* Emerald Green Dot at curve endpoint */}
                        <circle cx="170" cy="85" r="12" fill="#10B981"/>
                    </svg>
                    <span className="font-heading text-xl font-semibold text-foreground tracking-wide">YieldX</span>
                </Link>

                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-8">
                    {!sent ? (
                        <>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 border border-primary/20">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Forgot password?</h2>
                            <p className="text-muted-foreground text-sm mb-6">
                                No worries — enter your email and we'll send you a reset link.
                            </p>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-2">Email address</label>
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register('email')}
                                        className="w-full bg-background/80 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <LogoLoader size="sm" showText={false} inline /> : 'Send reset link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                <Check className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Check your inbox</h2>
                            <p className="text-muted-foreground text-sm mb-2">
                                We sent a password reset link to
                            </p>
                            <p className="text-foreground font-medium text-sm mb-6">{getValues('email')}</p>
                            <p className="text-muted-foreground text-xs">
                                Didn't get it? Check your spam folder or{' '}
                                <button onClick={() => setSent(false)} className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    try again
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                <Link to="/login" className="flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors mt-6">
                    <ArrowLeft className="w-4 h-4" /> Back to sign in
                </Link>
            </div>
        </div>
    );
}
