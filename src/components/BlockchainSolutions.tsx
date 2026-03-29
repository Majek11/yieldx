import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Brain, RefreshCw, Layers, Zap } from "lucide-react";
import blockchainImg from "@/assets/blockchain-blocks.jpg";

const features = [
  { icon: Brain, title: "AI-Driven Strategies", desc: "Machine learning models analyze 10,000+ data points to identify optimal entry and exit positions across markets." },
  { icon: RefreshCw, title: "Auto-Rebalancing", desc: "Your portfolio is continuously rebalanced to maintain target allocations and maximize risk-adjusted returns." },
  { icon: Layers, title: "Multi-Chain Support", desc: "Access opportunities on Ethereum, Solana, Avalanche, Polygon, and 15+ chains simultaneously." },
  { icon: Zap, title: "Real-Time Execution", desc: "Trades execute in under 200ms across 50+ liquidity venues for minimal slippage and maximum returns." },
];

const BlockchainSolutions = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".solutions-image",
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    gsap.fromTo(".solutions-text",
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    gsap.fromTo(".feature-card",
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".features-grid", start: "top 85%" },
      });
  }, { scope: ref });

  return (
    <section ref={ref} className="section-padding py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="solutions-image overflow-hidden rounded-2xl shadow-xl shadow-primary/10 max-w-md">
          <img src={blockchainImg} alt="AI Portfolio Management" loading="lazy" width={800} height={800} className="w-full" />
        </div>
        <div className="solutions-text">
          <span className="text-primary text-sm font-medium">Why YieldX</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mt-3">
            Intelligent Portfolio Management
          </h2>
          <p className="text-muted-foreground text-sm mt-4 leading-relaxed max-w-md">
            We combine institutional quantitative research with cutting-edge AI to deliver strategies that were previously only available to hedge funds and family offices.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { val: "200ms", label: "Trade execution" },
              { val: "50+", label: "Assets supported" },
              { val: "24/7", label: "AI monitoring" },
              { val: "99.9%", label: "Platform uptime" },
            ].map((s) => (
              <div key={s.label} className="bg-card/50 border border-border/50 rounded-xl p-4">
                <p className="font-heading text-2xl font-bold text-primary">{s.val}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards below */}
      <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f) => (
          <div key={f.title} className="feature-card card-glass p-5 group hover:border-primary/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlockchainSolutions;
