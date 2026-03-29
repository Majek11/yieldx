import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Wallet, Bot, BarChart3, Coins } from "lucide-react";

const steps = [
  { icon: Wallet, step: "01", title: "Connect & Deposit", desc: "Link your wallet or deposit funds via bank transfer. Start with as little as $100." },
  { icon: Bot, step: "02", title: "Choose a Strategy", desc: "Select from AI-curated strategies: Conservative, Balanced, Aggressive, or DeFi Yield." },
  { icon: BarChart3, step: "03", title: "AI Manages Your Portfolio", desc: "Our algorithms rebalance, hedge, and optimize your holdings 24/7 across 50+ assets." },
  { icon: Coins, step: "04", title: "Earn & Withdraw Anytime", desc: "Watch your portfolio grow. Withdraw profits or reinvest — no lock-ups, no hidden fees." },
];

const HowItWorks = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".hiw-title", { y: 40 }, {
      y: 0, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 80%" },
    });
    gsap.fromTo(".hiw-step", { y: 50 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: ".hiw-grid", start: "top 85%" },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="section-padding py-28">
      <div className="text-center mb-16">
        <span className="text-primary text-sm font-medium">How It Works</span>
        <h2 className="hiw-title font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mt-3">
          Start Earning in 4 Simple Steps
        </h2>
      </div>
      <div className="hiw-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.step} className="hiw-step card-glass p-6 group hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
            <span className="absolute top-4 right-4 font-heading text-4xl font-bold text-border/60">{s.step}</span>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-medium text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
