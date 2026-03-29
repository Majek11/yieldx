import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Clock, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const blogPosts = [
    {
        id: "1",
        slug: "how-ai-beating-crypto-market",
        category: "AI & Strategy",
        categoryColor: "text-primary bg-primary/10",
        title: "How Our AI Is Consistently Beating the Crypto Market",
        excerpt: "We break down the quantitative signals, backtesting methodology, and real-time rebalancing triggers behind our AI Alpha Fund's 127% annual return.",
        readTime: "8 min read",
        date: "March 21, 2026",
        author: "Alexandra Chen",
        authorRole: "CEO",
        authorBg: "#7C3AED",
        authorInitials: "AC",
    },
    {
        id: "2",
        slug: "defi-yield-strategy-explained",
        category: "DeFi",
        categoryColor: "text-teal-400 bg-teal-500/10",
        title: "DeFi Yield Farming: Chasing APY vs. Managing Real Risk",
        excerpt: "Not all yield is created equal. Learn how we evaluate protocol risk, smart contract exposure, and impermanent loss to deliver sustainable DeFi returns.",
        readTime: "6 min read",
        date: "March 14, 2026",
        author: "David Kim",
        authorRole: "Head of DeFi",
        authorBg: "#D97706",
        authorInitials: "DK",
    },
    {
        id: "3",
        slug: "crypto-tax-guide-2026",
        category: "Education",
        categoryColor: "text-emerald-400 bg-emerald-500/10",
        title: "Crypto Tax in 2026: A Practical Guide for Investors",
        excerpt: "Everything you need to know about crypto capital gains, wash-sale rules, and how to generate your tax report in YieldX with one click.",
        readTime: "10 min read",
        date: "March 7, 2026",
        author: "Sarah Johnson",
        authorRole: "Chief Compliance Officer",
        authorBg: "#DC2626",
        authorInitials: "SJ",
    },
    {
        id: "4",
        slug: "portfolio-rebalancing-ai",
        category: "AI & Strategy",
        categoryColor: "text-primary bg-primary/10",
        title: "Why Automated Rebalancing Outperforms Manual Strategies",
        excerpt: "Our research shows that emotion-free, rules-based rebalancing beats human intuition in crypto by an average of 34% over a 12-month horizon.",
        readTime: "5 min read",
        date: "March 1, 2026",
        author: "Marcus Webb",
        authorRole: "CTO",
        authorBg: "#2563EB",
        authorInitials: "MW",
    },
    {
        id: "5",
        slug: "bitcoin-halving-portfolio",
        category: "Market Analysis",
        categoryColor: "text-amber-400 bg-amber-500/10",
        title: "Bitcoin Halving 2024: How We Positioned Our Portfolios",
        excerpt: "We share the exact strategy adjustments we made ahead of the most anticipated event in crypto — and the returns they delivered.",
        readTime: "7 min read",
        date: "February 22, 2026",
        author: "Alexandra Chen",
        authorRole: "CEO",
        authorBg: "#7C3AED",
        authorInitials: "AC",
    },
    {
        id: "6",
        slug: "institutional-crypto-adoption",
        category: "Industry",
        categoryColor: "text-orange-400 bg-orange-500/10",
        title: "Institutional Crypto Adoption: What It Means for Retail Investors",
        excerpt: "BlackRock, Fidelity, and State Street have entered the crypto market. We analyse what this means for volatility, liquidity, and your returns.",
        readTime: "9 min read",
        date: "February 14, 2026",
        author: "Priya Patel",
        authorRole: "Chief Risk Officer",
        authorBg: "#059669",
        authorInitials: "PP",
    },
];

const categories = ["All", "AI & Strategy", "DeFi", "Education", "Market Analysis", "Industry"];

export default function Blog() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useGSAP(() => {
        gsap.fromTo(".blog-card",
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: ".blog-grid", start: "top 85%" }
            });
    }, { scope: ref });

    const posts = blogPosts.filter((p) => {
        const matchCat = filter === "All" || p.category === filter;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div ref={ref} className="min-h-screen bg-background">
            <Navbar />
            {/* Hero */}
            <div className="section-padding pt-36 pb-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] glow-blob glow-primary opacity-50 pointer-events-none" />
                <div className="text-center relative z-10 max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-medium">YieldX Insights</span>
                    <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mt-3 mb-4">
                        Research, Analysis &<br />Crypto Strategy
                    </h1>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        In-depth insights from our trading desks, risk team, and AI engineers — helping you understand every decision we make.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="section-padding pb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((c) => (
                            <button key={c} onClick={() => setFilter(c)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${filter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                                    }`}>
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search posts…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-card/60 border border-border/60 rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all w-48"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="section-padding pb-24">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm">No posts match your search.</p>
                    </div>
                ) : (
                    <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="blog-card card-glass group hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/blog/${post.slug}`)}
                            >
                                {/* Category band */}
                                <div className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-br-xl ${post.categoryColor}`}>
                                    {post.category}
                                </div>

                                <div className="p-6 pt-4">
                                    <h2 className="font-heading text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary/90 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                style={{ backgroundColor: post.authorBg + "33", color: post.authorBg }}>
                                                {post.authorInitials}
                                            </div>
                                            <div>
                                                <p className="text-foreground text-xs font-medium">{post.author}</p>
                                                <p className="text-muted-foreground text-xs">{post.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-border/40 px-6 py-3 flex items-center justify-between">
                                    <span className="text-primary text-xs font-medium">Read article</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
