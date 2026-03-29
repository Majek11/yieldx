import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const funds = [
  { name: "AI Alpha Fund", risk: "Aggressive", ytd: "+184.2%", allTime: "+412%", aum: "$890M", badge: "Top Performer", badgeColor: "bg-emerald-500/15 text-emerald-400" },
  { name: "Balanced Growth", risk: "Moderate", ytd: "+67.5%", allTime: "+215%", aum: "$1.1B", badge: "Most Popular", badgeColor: "bg-primary/15 text-primary" },
  { name: "DeFi Yield Optimizer", risk: "Moderate-High", ytd: "+93.1%", allTime: "+328%", aum: "$340M", badge: "High Yield", badgeColor: "bg-teal-500/15 text-teal-400" },
  { name: "Conservative Crypto", risk: "Low", ytd: "+24.8%", allTime: "+89%", aum: "$620M", badge: "Capital Safe", badgeColor: "bg-amber-500/15 text-amber-400" },
];

const InvestmentPerformance = () => {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.fromTo(".perf-card", { y: 50 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".perf-grid", start: "top 85%" },
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="performance" className="section-padding py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
        <div>
          <span className="text-primary text-sm font-medium">Fund Performance</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mt-3">
            Proven Returns,<br />Transparent Results.
          </h2>
        </div>
        <button
          onClick={() => navigate("/invest")}
          className="flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-300 flex-shrink-0"
        >
          View all strategies <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="perf-grid grid grid-cols-1 md:grid-cols-2 gap-5">
        {funds.map((f) => (
          <div
            key={f.name}
            className="perf-card card-glass p-6 group hover:border-primary/30 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/invest")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading text-lg font-medium text-foreground">{f.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.badgeColor}`}>{f.badge}</span>
                </div>
                <span className="text-muted-foreground text-xs">{f.risk} Risk</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/40">
              <div>
                <p className="font-heading text-xl font-bold text-emerald-400">{f.ytd}</p>
                <p className="text-muted-foreground text-xs mt-0.5">YTD Return</p>
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-foreground">{f.allTime}</p>
                <p className="text-muted-foreground text-xs mt-0.5">All-Time</p>
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-foreground">{f.aum}</p>
                <p className="text-muted-foreground text-xs mt-0.5">AUM</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground text-xs text-center mt-6">
        Past performance is not indicative of future results. Crypto investments carry risk.
      </p>
    </section>
  );
};

export default InvestmentPerformance;
