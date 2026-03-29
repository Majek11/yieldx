import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BarChart3, Eye, Shield, Fingerprint } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import valuesArt from "@/assets/values-art.jpg";

const values = [
  { icon: BarChart3, title: "Performance First", desc: "Every strategy is backtested against 5+ years of market data before going live." },
  { icon: Eye, title: "Full Transparency", desc: "Real-time dashboards, daily reports, and public audit trails for every fund." },
  { icon: Shield, title: "Uncompromising Security", desc: "Multi-sig wallets, cold storage, and $250M insurance coverage." },
  { icon: Fingerprint, title: "Your Keys, Your Crypto", desc: "Non-custodial options available. You always retain full ownership of your assets." },
];

/* Individual animated stat */
function AnimatedStat({
  target, prefix, suffix, label,
}: { target: number; prefix?: string; suffix?: string; label: string }) {
  const [ref, display] = useCountUp(target, 1800, prefix, suffix);
  return (
    <div className="stat-item text-center">
      <p ref={ref as React.RefObject<HTMLParagraphElement>}
        className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground count-up">
        {display}
      </p>
      <p className="text-muted-foreground text-sm mt-1">{label}</p>
    </div>
  );
}

const StatsAndValues = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".stat-item",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".stats-row", start: "top 85%" },
      });
    gsap.fromTo(".values-title",
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".values-section", start: "top 80%" },
      });
    gsap.fromTo(".values-art",
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".values-section", start: "top 80%" },
      });
    gsap.fromTo(".value-item",
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".values-grid", start: "top 85%" },
      });
  }, { scope: ref });

  return (
    <section ref={ref} className="section-padding py-28">
      {/* Animated stats row */}
      <div className="stats-row flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-28 border-b border-border/50 pb-16">
        <p className="stat-item font-heading text-xl md:text-2xl font-medium text-foreground max-w-[220px]">
          Trusted by investors worldwide
        </p>
        <AnimatedStat target={2400} prefix="$" suffix="M+" label="Assets Under Management" />
        <AnimatedStat target={127} suffix="%" label="Avg. Annual Return" />
        <AnimatedStat target={50000} suffix="+" label="Active Investors" />
      </div>

      {/* Values */}
      <div className="values-section">
        <h2 className="values-title font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-14">
          Built on Principles That Matter
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="values-art overflow-hidden rounded-2xl">
            <img src={valuesArt} alt="Our Values" loading="lazy" width={640} height={640} className="w-full max-w-xs" />
          </div>
          <div className="values-grid lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {values.map((v) => (
              <div key={v.title} className="value-item flex gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-medium text-foreground mb-1">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsAndValues;
