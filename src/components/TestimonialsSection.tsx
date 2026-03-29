import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const testimonials = [
  { text: "YieldX turned my $10K into $38K in under a year. The AI strategies are genuinely impressive — I've never seen this kind of consistency.", name: "Sarah Chen", role: "Early Adopter, Software Engineer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { text: "I was skeptical of automated crypto investing, but YieldX's track record speaks for itself. My conservative fund returned 24% last year.", name: "Marcus Webb", role: "Retired Fund Manager", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
  { text: "The DeFi yield optimizer found opportunities I never knew existed. My stablecoin yields went from 4% to 18% APY.", name: "Priya Patel", role: "DeFi Enthusiast", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
  { text: "What sold me was the insurance coverage and CertiK audit. Finally a platform where I feel safe keeping serious money.", name: "David Okonkwo", role: "HNWI Investor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
  { text: "The auto-rebalancing saved my portfolio during the last crash. While others panicked, YieldX had already hedged my positions.", name: "Elena Vasquez", role: "Crypto Trader", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" },
  { text: "I manage a family office and we allocated 15% to YieldX. The institutional-grade reporting makes compliance a breeze.", name: "James Hartley", role: "Family Office Director", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  { text: "Cross-chain investing used to be a nightmare. YieldX handles it all — Ethereum, Solana, Avalanche — seamlessly.", name: "Aiko Tanaka", role: "Blockchain Developer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face" },
  { text: "Started with the minimum $100 just to test it. Six months later I've moved my entire crypto portfolio to YieldX.", name: "Ryan Mitchell", role: "Marketing Director", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face" },
  { text: "The transparency is what keeps me here. Real-time dashboards, daily reports, and I can see exactly where my money is at all times.", name: "Nina Kowalski", role: "Financial Analyst", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face" },
  { text: "No lock-ups, instant withdrawals, and no hidden fees. YieldX is how crypto investing should have always been.", name: "Omar Al-Rashid", role: "Serial Entrepreneur", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&crop=face" },
  { text: "Their risk management algorithms detected the Terra/Luna collapse early and moved my funds to safety. That alone saved me $50K.", name: "Lena Bergström", role: "Tech Executive", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face" },
  { text: "I recommend YieldX to every client who asks about crypto exposure. Professional, regulated, and actually delivers returns.", name: "Carlos Mendez", role: "Wealth Advisor", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face" },
];

const TestimonialsSection = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".testimonials-heading",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
  }, { scope: ref });

  const row1 = testimonials.slice(0, 6);
  const row2 = testimonials.slice(6, 12);

  return (
    <section ref={ref} className="py-28 overflow-hidden">
      <h2 className="testimonials-heading font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground text-center mb-20 section-padding">
        What Our Investors<br />Have to Say
      </h2>
      <div className="mb-5 overflow-hidden">
        <div className="marquee-track gap-5">
          {[...row1, ...row1].map((c, i) => (
            <div key={i} className="flex-shrink-0 w-72 card-glass p-6 hover:border-primary/30 transition-colors duration-300">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed mb-5">"{c.text}"</p>
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt={c.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-foreground text-xs font-medium">{c.name}</p>
                  <p className="text-muted-foreground text-xs">{c.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track-reverse gap-5">
          {[...row2, ...row2].map((c, i) => (
            <div key={i} className="flex-shrink-0 w-72 card-glass p-6 hover:border-primary/30 transition-colors duration-300">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed mb-5">"{c.text}"</p>
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt={c.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-foreground text-xs font-medium">{c.name}</p>
                  <p className="text-muted-foreground text-xs">{c.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
