import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/* Partner data with colors for styled badges */
const partners = [
  { name: "Coinbase", color: "#0052FF" },
  { name: "Binance", color: "#F3BA2F" },
  { name: "CertiK", color: "#4E5DE4" },
  { name: "Chainalysis", color: "#2775CA" },
  { name: "Fireblocks", color: "#4B5563" },
  { name: "Ledger", color: "#000000" },
  { name: "Kraken", color: "#5741D9" },
  { name: "Consensys", color: "#E17726" },
];

const PartnersSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0, y: 30, duration: 0.8,
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="section-padding py-16 border-b border-border/50">
      <p className="text-center text-muted-foreground text-sm mb-10">
        Trusted by leading exchanges, auditors &amp; custodians worldwide
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {partners.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2.5 bg-card/40 border border-border/40 rounded-full px-5 py-2.5 hover:border-border/80 hover:bg-card/70 transition-all duration-300 cursor-default group"
          >
            {/* Color dot as logo stand-in */}
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="font-heading text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors tracking-wide uppercase">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;
