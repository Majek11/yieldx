import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Users, Target, Globe, Award, ArrowRight, Linkedin, Twitter } from "lucide-react";
import peopleTeam from "@/assets/people-team.jpg";
import peopleHero from "@/assets/people-hero.jpg";

const team = [
    { name: "Alexandra Chen", role: "CEO & Co-Founder", bg: "#7C3AED", initials: "AC", bio: "Former quant at Goldman Sachs, 12 years in algorithmic trading.", linkedin: "#", twitter: "#" },
    { name: "Marcus Webb", role: "CTO & Co-Founder", bg: "#2563EB", initials: "MW", bio: "Ex-Google DeepMind engineer, PhD in Machine Learning from MIT.", linkedin: "#", twitter: "#" },
    { name: "Priya Patel", role: "Chief Risk Officer", bg: "#059669", initials: "PP", bio: "20 years at JP Morgan Risk Management, CFA charterholder.", linkedin: "#", twitter: "#" },
    { name: "David Kim", role: "Head of DeFi", bg: "#D97706", initials: "DK", bio: "Early Ethereum contributor, built protocols with $500M+ TVL.", linkedin: "#", twitter: "#" },
    { name: "Sarah Johnson", role: "Chief Compliance Officer", bg: "#DC2626", initials: "SJ", bio: "Former SEC examiner, specialises in digital asset regulation.", linkedin: "#", twitter: "#" },
    { name: "Omar Hassan", role: "Head of Growth", bg: "#7C3AED", initials: "OH", bio: "Scaled three fintechs from $0 to $100M ARR, Forbes 30 Under 30.", linkedin: "#", twitter: "#" },
];

const milestones = [
    { year: "2022", event: "YieldX founded by three ex-Goldman Sachs quants in San Francisco." },
    { year: "2023", event: "Launched Beta with 500 users. $10M in assets under management within 3 months." },
    { year: "2023", event: "Raised $18M Series A led by Andreessen Horowitz. CertiK audit completed with 97/100 score." },
    { year: "2024", event: "Crossed $500M AUM. Expanded to Europe with full MiCA compliance. 15,000+ active investors." },
    { year: "2025", event: "Surpassed $1B AUM milestone. Launched DeFi Yield Optimizer and multi-chain support." },
    { year: "2026", event: "Now serving 50,000+ investors in 80 countries with $2.4B+ under management." },
];

const values = [
    { icon: Target, title: "Performance Obsessed", desc: "Every decision we make is driven by delivering real, verifiable returns to our investors." },
    { icon: Globe, title: "Radically Transparent", desc: "Full audit trails, real-time data, and public performance records — we hide nothing." },
    { icon: Users, title: "Investor First", desc: "Our incentives are aligned with yours. We only earn when you earn." },
    { icon: Award, title: "Security Without Compromise", desc: "Institutional-grade infrastructure, CertiK audited, $250M insured — non-negotiable." },
];

export default function About() {
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useGSAP(() => {
        gsap.fromTo(".about-hero-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
        gsap.fromTo(".about-value",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: ".about-values", start: "top 82%" }
            });
        gsap.fromTo(".team-card",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: ".team-grid", start: "top 82%" }
            });
        gsap.fromTo(".milestone",
            { x: -30, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
                scrollTrigger: { trigger: ".timeline", start: "top 82%" }
            });
    }, { scope: ref });

    return (
        <div ref={ref} className="min-h-screen bg-background">
            <Navbar />

            {/* Hero — two-column with people image */}
            <div className="section-padding pt-36 pb-0 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] glow-blob glow-primary opacity-40 pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="about-hero-text">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                            <span className="text-primary text-xs font-medium">Our Story</span>
                        </div>
                        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.08] mb-6">
                            We build AI that<br />
                            <span className="text-gradient">works for you.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-10">
                            YieldX was built by quants, engineers, and DeFi experts frustrated that institutional-grade investment technology was only available to the ultra-wealthy. We fixed that.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={() => navigate("/register")}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                            >
                                Start Investing <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link
                                to="/pricing"
                                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
                            >
                                See Pricing
                            </Link>
                        </div>
                    </div>
                    {/* People image */}
                    <div className="hidden lg:block overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 h-[480px]">
                        <img src={peopleHero} alt="YieldX investors" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="section-padding py-16 mt-16 border-y border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "$2.4B+", label: "Assets Under Management" },
                        { value: "50K+", label: "Active Investors" },
                        { value: "80", label: "Countries Served" },
                        { value: "97/100", label: "CertiK Security Score" },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="font-heading text-3xl md:text-4xl font-bold text-foreground">{s.value}</p>
                            <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Values */}
            <div className="section-padding py-24">
                <div className="text-center mb-14">
                    <span className="text-primary text-sm font-medium">What We Believe</span>
                    <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mt-3">Our core values</h2>
                </div>
                <div className="about-values grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v) => (
                        <div key={v.title} className="about-value card-glass p-6 hover:border-primary/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                                <v.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-heading text-base font-semibold text-foreground mb-2">{v.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team image banner */}
            <div className="section-padding pb-0">
                <div className="overflow-hidden rounded-2xl h-72 md:h-96 shadow-xl shadow-primary/10">
                    <img src={peopleTeam} alt="YieldX team" className="w-full h-full object-cover object-top" />
                </div>
            </div>

            {/* Timeline */}
            <div className="section-padding py-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mb-14">Our journey</h2>
                    <div className="timeline relative">
                        <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-border/60" />
                        <div className="space-y-8">
                            {milestones.map((m, i) => (
                                <div key={i} className="milestone flex gap-8 items-start relative">
                                    <div className="w-16 text-right flex-shrink-0">
                                        <span className="font-heading text-sm font-bold text-primary">{m.year}</span>
                                    </div>
                                    <div className="flex-shrink-0 relative z-10">
                                        <div className="w-3 h-3 rounded-full bg-primary mt-1 ring-4 ring-background" />
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 pb-2">{m.event}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Team */}
            <div className="section-padding py-24 bg-card/20 border-y border-border/40">
                <div className="text-center mb-14">
                    <span className="text-primary text-sm font-medium">The Team</span>
                    <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mt-3">
                        Built by the best in the business
                    </h2>
                    <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
                        Bringing together decades of experience in quantitative finance, AI research, and decentralised systems.
                    </p>
                </div>
                <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map((member) => (
                        <div key={member.name} className="team-card card-glass p-6 hover:border-primary/30 transition-all duration-300 group">
                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm"
                                    style={{ backgroundColor: member.bg + "33", border: `1px solid ${member.bg}55`, color: member.bg }}
                                >
                                    {member.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-heading text-base font-semibold text-foreground">{member.name}</h3>
                                    <p className="text-primary text-xs font-medium">{member.role}</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed mb-4">{member.bio}</p>
                            <div className="flex gap-2">
                                <a href={member.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a href={member.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="section-padding py-16">
                <div className="card-glass-glow p-10 md:p-14 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/5 pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mb-4">
                            Join 50,000+ investors
                        </h2>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8">
                            Start with as little as $100. No lock-ups, no hidden fees. Just AI-powered returns.
                        </p>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                        >
                            Get Started Free →
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
