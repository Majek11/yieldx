import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShieldCheck, Lock, FileCheck, Globe } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "CertiK Audited", desc: "All smart contracts are audited by CertiK with a 97/100 security score. Full audit reports are public." },
  { icon: Lock, title: "Cold Storage Custody", desc: "95% of assets are held in institutional-grade cold storage with Fireblocks multi-party computation." },
  { icon: FileCheck, title: "Regulatory Compliant", desc: "Licensed and regulated in multiple jurisdictions. Full KYC/AML compliance with SOC 2 Type II certification." },
  { icon: Globe, title: "Insurance Coverage", desc: "Up to $250M in insurance coverage through Lloyd's of London, protecting against hacks and operational failures." },
];

const SecurityCompliance = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".sec-card", { y: 40 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: ".sec-grid", start: "top 85%" },
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="security" className="section-padding py-28">
      <div className="text-center mb-16">
        <span className="text-primary text-sm font-medium">Security &amp; Compliance</span>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mt-3">
          Your Assets, Fully Protected.
        </h2>
        <p className="text-muted-foreground text-base mt-4 max-w-lg mx-auto">
          Institutional-grade security infrastructure trusted by over 50,000 investors worldwide.
        </p>
      </div>

      <div className="sec-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.title} className="sec-card card-glass p-6 group hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-medium text-foreground mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Trust badges row */}
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {["SOC 2 Type II", "ISO 27001", "MiCA Compliant", "GDPR Compliant", "CertiK 97/100"].map((badge) => (
          <div key={badge} className="flex items-center gap-2 bg-card/50 border border-border/50 rounded-full px-4 py-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-muted-foreground text-xs font-medium">{badge}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SecurityCompliance;
