import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Send } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Products",
      links: [
        { label: "AI Alpha Fund", href: "/#performance" },
        { label: "Balanced Growth", href: "/#performance" },
        { label: "DeFi Yield Optimizer", href: "/#performance" },
        { label: "Conservative Crypto", href: "/#performance" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "#" },
        { label: "Security", href: "/#security" },
        { label: "Contact", href: "mailto:hello@yieldx.io" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Centre", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Status", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Send, href: "#", label: "Telegram" },
  ];

  return (
    <footer className="section-padding py-16 border-t border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        {/* Brand column */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <svg width="36" height="36" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
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
            <span className="font-heading text-lg font-semibold text-foreground">YieldX</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
            AI-powered crypto investing for everyone. Institutional strategies, simplified — trusted by 50,000+ investors across 80 countries.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-y-0.5">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('/') ? (
                    <Link to={href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  ) : href.startsWith('mailto:') ? (
                    <a href={href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">{label}</a>
                  ) : (
                    <a href={href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">{label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-xs">
          © {year} YieldX Technologies Ltd. All rights reserved. Not financial advice.
        </p>
        <div className="flex gap-6">
          <Link to="/pricing" className="text-muted-foreground text-xs hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/privacy" className="text-muted-foreground text-xs hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-muted-foreground text-xs hover:text-foreground transition-colors">Terms of Service</Link>
          <Link to="/risk" className="text-muted-foreground text-xs hover:text-foreground transition-colors">Risk Disclosure</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
