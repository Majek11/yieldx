import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Calendar } from "lucide-react";
import { toast } from "sonner";

const CTASection = () => {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.fromTo(".cta-content",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" }
      });
  }, { scope: ref });

  return (
    <section ref={ref} className="section-padding py-28">
      <div className="cta-content card-glass-glow p-12 md:p-16 text-center relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Orbiting dots */}
        <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
        <div className="absolute bottom-8 right-12 w-1.5 h-1.5 rounded-full bg-emerald-400/40 animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/2 right-6 w-1 h-1 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: '1.4s' }} />

        <div className="relative z-10">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-primary text-xs font-medium">Join 50,000+ investors worldwide</span>
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4">
            Ready to Grow Your<br />
            <span className="text-gradient">Crypto Wealth?</span>
          </h2>
          <p className="text-muted-foreground text-base mt-4 max-w-md mx-auto leading-relaxed">
            Let our AI work 24/7 to optimise your portfolio. Proven returns, zero lock-ups, institutional-grade security — start with just $100.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              id="cta-start-investing"
              onClick={() => navigate('/register')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center gap-2 justify-center"
            >
              Start Investing Now <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="cta-schedule-demo"
              onClick={() => toast.success('We\'ll be in touch!')}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-8 py-3.5 rounded-full text-sm font-medium border border-border/60 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 justify-center"
            >
              <Calendar className="w-4 h-4" /> Schedule a Demo
            </button>
          </div>

          {/* Social proof row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {[
              { label: 'No lock-up period', icon: '✓' },
              { label: 'Instant withdrawals', icon: '✓' },
              { label: 'CertiK audited', icon: '✓' },
              { label: '$250M insured', icon: '✓' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <span className="text-emerald-400 font-bold">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
