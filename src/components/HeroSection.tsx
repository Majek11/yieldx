import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import heroSphere from "@/assets/hero-sphere.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // fromTo keeps final opacity:1, so elements are never stuck invisible
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
      .fromTo(".hero-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.4")
      .fromTo(".hero-desc", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.6")
      .fromTo(".hero-buttons", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
      .fromTo(".hero-stat", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.4")
      .fromTo(".hero-image", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.3, ease: "power2.out" }, "-=1.1");

    // Parallax scroll — safe to keep as gsap.to (no opacity)
    gsap.to(".hero-image", {
      y: -60, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
    });
    gsap.to(".hero-text-block", {
      y: -30, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="min-h-screen section-padding pt-32 pb-20 flex items-center overflow-hidden relative">
      {/* Square-line background pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5" preserveAspectRatio="none">
        <defs>
          <pattern id="squares" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="5" y="5" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#squares)" className="text-primary" />
      </svg>

      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hero-text-block">
          <div className="hero-badge inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-primary text-xs font-medium">AI-Powered Crypto Investing</span>
          </div>
          <h1 className="hero-title font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.08] text-foreground">
            Smarter Crypto<br />
            Investing,<br />
            <span className="text-gradient">Powered by AI.</span>
          </h1>
          <p className="hero-desc mt-6 text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
            Let our AI-driven strategies manage your crypto portfolio. Optimized yields, automated rebalancing, and institutional-grade risk management — all on autopilot.
          </p>
          <div className="hero-buttons flex gap-4 mt-8 flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              Start Investing Free
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-7 py-3.5 rounded-full text-sm font-medium border border-border transition-all duration-300 hover:-translate-y-0.5"
            >
              View Pricing
            </button>
          </div>
          <div className="flex gap-8 mt-10 flex-wrap">
            {[
              { val: "$2.4B+", label: "Assets Managed" },
              { val: "+127%", label: "Avg. Annual Return", color: "text-emerald-400" },
              { val: "50K+", label: "Active Investors" },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <p className={`font-heading text-2xl font-semibold ${s.color ?? "text-foreground"}`}>{s.val}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-image flex justify-center lg:justify-end">
          <img
            src={heroSphere}
            alt="AI-Powered Investing"
            width={1024}
            height={1024}
            className="w-full max-w-lg xl:max-w-xl rounded-3xl shadow-2xl shadow-primary/10"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
