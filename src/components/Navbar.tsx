import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, Menu, X, TrendingUp, Shield, Bot, FileText } from "lucide-react";

const products = [
  { icon: Bot, label: "AI Alpha Fund", desc: "Aggressive AI-driven growth", href: "/#performance" },
  { icon: TrendingUp, label: "Balanced Growth", desc: "Steady, diversified returns", href: "/#performance" },
  { icon: Shield, label: "Conservative Crypto", desc: "Capital preservation first", href: "/#performance" },
];

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useGSAP(() => {
    gsap.fromTo(navRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className={`fixed top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 md:left-8 md:right-8 lg:left-12 lg:right-12 z-50 px-3 sm:px-6 md:px-8 py-3.5 flex items-center justify-between rounded-2xl transition-all duration-500 overflow-x-hidden ${scrolled
        ? "bg-background/80 backdrop-blur-xl border border-border/60 shadow-lg shadow-background/50"
        : "bg-background/40 backdrop-blur-md border border-border/20"
        }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <svg width="32" height="32" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          {/* Purple Circle Ring */}
          <circle cx="120" cy="120" r="95" fill="none" stroke="#7C3AED" strokeWidth="24" strokeLinecap="round"/>
          
          {/* S-Curve Arrow Path */}
          <g transform="translate(120, 120)">
            {/* Smooth S-curve line */}
            <path d="M -50 30 Q -30 0 0 -15 Q 30 -25 50 -35" 
                  fill="none" 
                  stroke="#7C3AED" 
                  strokeWidth="14" 
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
          </g>
          
          {/* Emerald Green Dot at curve endpoint */}
          <circle cx="170" cy="85" r="12" fill="#10B981"/>
        </svg>
        <span className="font-heading text-xl font-semibold text-foreground tracking-wide">YieldX</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        {/* Products dropdown */}
        <div className="relative">
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            onBlur={() => setTimeout(() => setProductsOpen(false), 150)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Products <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
          </button>
          {productsOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl p-3 min-w-[260px] shadow-xl shadow-background/60">
              {products.map(({ icon: Icon, label, desc, href }) => (
                <a key={label} href={href}
                  onClick={() => setProductsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">{label}</p>
                    <p className="text-muted-foreground text-xs">{desc}</p>
                  </div>
                </a>
              ))}
              <div className="h-px bg-border/50 mx-3 my-2" />
              <Link to="/pricing" onClick={() => setProductsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">Pricing</p>
                  <p className="text-muted-foreground text-xs">Simple, transparent fees</p>
                </div>
              </Link>
            </div>
          )}
        </div>

        <a href="#performance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Performance</a>
        <a href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</a>
        <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
        <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/login')}
          className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
        >
          Log In
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
        >
          Start Investing
        </button>
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 md:hidden">
          <div className="flex flex-col gap-2">
            <a href="#performance" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Performance</a>
            <a href="#security" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Security</a>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">About</Link>
            <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Blog</Link>
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">Pricing</Link>
            <div className="h-px bg-border/50 my-1" />
            <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-left">Log In</button>
            <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-full text-sm font-medium mt-1">
              Start Investing
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
