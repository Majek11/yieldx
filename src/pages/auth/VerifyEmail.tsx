import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

export default function VerifyEmail() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md text-center">
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
                    <span className="font-heading text-xl font-semibold text-foreground">YieldX</span>
                </Link>
                <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Verify your email</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        We've sent a verification link to your email address. Click the link to activate your account.
                    </p>
                    <p className="text-muted-foreground text-xs mt-4">
                        Didn't receive it? Check spam or{' '}
                        <button className="text-primary hover:text-primary/80 font-medium">resend</button>
                    </p>
                </div>
                <Link to="/login" className="flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors mt-6">
                    <ArrowLeft className="w-4 h-4" /> Back to sign in
                </Link>
            </div>
        </div>
    );
}
