import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import sc1 from "@/assets/smart-contract-1.jpg";
import sc2 from "@/assets/smart-contract-2.jpg";
import sc3 from "@/assets/smart-contract-3.jpg";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    img: sc1,
    label: "DeFi Yield Farming",
    title: "Automated yield optimization across 200+ protocols",
    desc: "Our AI scans Aave, Compound, Curve, Uniswap and hundreds more in real time. Funds auto-allocate and rebalance daily to capture the highest risk-adjusted yields while avoiding over-exposed positions.",
    reverse: false,
    stat1: { val: "42% APY", label: "Average DeFi yield" },
    stat2: { val: "200+", label: "Protocols scanned" },
  },
  {
    img: sc2,
    label: "Multi-Chain Support",
    title: "Invest across every major blockchain, simultaneously",
    desc: "Access opportunities on Ethereum, Solana, Avalanche, Polygon, Arbitrum, and 15+ chains. Our cross-chain infrastructure handles bridges and routing automatically — you just collect the returns.",
    reverse: true,
    stat1: { val: "15+", label: "Chains supported" },
    stat2: { val: "<1s", label: "Cross-chain execution" },
  },
  {
    img: sc3,
    label: "Risk Management",
    title: "Institutional-grade hedging and downside protection",
    desc: "Advanced stop-loss algorithms, portfolio insurance via options strategies, and dynamic exposure adjustment automatically protect your capital during market downturns — without you lifting a finger.",
    reverse: false,
    stat1: { val: "-12%", label: "Max drawdown (2025)" },
    stat2: { val: "2.1x", label: "Sharpe ratio" },
  },
];

const SmartContractSections = () => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const items = ref.current?.querySelectorAll(".sc-row");
    items?.forEach((item) => {
      const isReverse = item.classList.contains("sc-reverse");
      gsap.fromTo(item.querySelector(".sc-img"),
        { x: isReverse ? 80 : -80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 78%" },
        });
      gsap.fromTo(item.querySelector(".sc-text"),
        { x: isReverse ? -80 : 80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 78%" },
        });
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="section-padding py-12 space-y-32">
      {sections.map((s, i) => (
        <div key={i} className={`sc-row ${s.reverse ? "sc-reverse" : ""} grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
          <div className={`sc-img overflow-hidden rounded-2xl shadow-xl shadow-primary/10 max-w-md ${s.reverse ? "lg:order-2" : ""}`}>
            <img src={s.img} alt={s.title} loading="lazy" width={800} height={800} className="w-full" />
          </div>
          <div className={`sc-text ${s.reverse ? "lg:order-1" : ""}`}>
            <span className="text-primary text-sm font-medium">{s.label}</span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mt-3 leading-tight">{s.title}</h2>
            <p className="text-muted-foreground text-sm mt-4 leading-relaxed">{s.desc}</p>

            {/* Stat pills */}
            <div className="flex gap-4 mt-6">
              <div className="bg-card/60 border border-border/50 rounded-xl px-4 py-3 min-w-[100px]">
                <p className="font-heading text-xl font-bold text-primary">{s.stat1.val}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.stat1.label}</p>
              </div>
              <div className="bg-card/60 border border-border/50 rounded-xl px-4 py-3 min-w-[100px]">
                <p className="font-heading text-xl font-bold text-foreground">{s.stat2.val}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.stat2.label}</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/register")}
              className="mt-6 flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-300 group"
            >
              Explore this strategy <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartContractSections;
