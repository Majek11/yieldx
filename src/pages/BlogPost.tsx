import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { blogPosts } from "./Blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Simple rich-text sections per post (first 2 posts are fleshed out, rest use the excerpt)
const postContent: Record<string, string[]> = {
    "how-ai-beating-crypto-market": [
        "When most people think of 'beating the market', they picture a trader hunched over screens, making gut calls. At YieldX, the process looks very different. Our AI doesn't feel fear when Bitcoin drops 20% in a day, and it doesn't feel greed when Solana is up 15%. It just follows the signals.",
        "## The Signal Stack",
        "Our AI Alpha Fund draws on three primary signal categories: on-chain analytics (wallet activity, exchange inflows/outflows, miner behaviour), macro momentum indicators (funding rates, open interest, fear & greed index), and cross-asset correlation matrices that update every 15 minutes.",
        "## Backtesting Methodology",
        "Every strategy is tested against five years of historical data before a single real dollar is deployed. We use walk-forward optimisation, not just in-sample fitting — meaning the model is validated on data it has never seen. This eliminates the most common source of quant fund failures: overfitting.",
        "## Execution & Rebalancing",
        "The system rebalances automatically when asset weights deviate more than 3% from targets, or when a conviction signal crosses a threshold. Execution is split across multiple liquidity venues to minimise slippage. On average, we execute in under 200 milliseconds.",
        "The result? A 127% average annual return since inception, with a Sharpe ratio of 2.1 — nearly three times the industry average for crypto funds.",
    ],
    "defi-yield-strategy-explained": [
        "The DeFi yield farming landscape is littered with promises of 1,000% APYs. Most of them are worthless within weeks. At YieldX, we approach yield farming as risk-adjusted income, not a lottery ticket.",
        "## Evaluating Protocol Risk",
        "Before we deposit a single dollar into a protocol, it passes a 47-point security checklist: smart contract audit score, time since last exploit, TVL trend, admin key configuration, oracle dependency, and more. If a protocol fails any critical check, it's off-limits regardless of its APY.",
        "## Managing Impermanent Loss",
        "Impermanent loss is the hidden cost of liquidity provision that many yield farmers ignore until it's too late. Our DeFi Yield Optimizer only enters liquidity positions in correlated asset pairs where IL exposure is modelled to remain below 2% over a 30-day horizon.",
        "Our verified net returns from DeFi yield strategies have averaged 42% APY on a risk-adjusted basis — real yield that compounds in stablecoins and blue-chip assets, not inflationary governance tokens.",
    ],
};

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-heading text-2xl text-foreground mb-4">Post not found</h1>
                    <Link to="/blog" className="text-primary hover:text-primary/80 text-sm">← Back to blog</Link>
                </div>
            </div>
        );
    }

    const sections = postContent[slug ?? ""] ?? [post.excerpt, "This article is coming soon — check back shortly for the full post."];
    const related = blogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            {/* Back nav */}
            <div className="section-padding pt-32 pb-0">
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-10"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to blog
                </Link>
            </div>

            {/* Article header */}
            <article className="section-padding pb-16">
                <div className="max-w-2xl">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full mb-4 ${post.categoryColor}`}>
                        {post.category}
                    </span>
                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-[1.15] mb-6">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-5 text-muted-foreground text-sm mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ backgroundColor: post.authorBg + "33", color: post.authorBg }}>
                                {post.authorInitials}
                            </div>
                            <div>
                                <p className="text-foreground text-xs font-medium">{post.author}</p>
                                <p className="text-muted-foreground text-xs">{post.authorRole}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                        </div>
                    </div>

                    {/* Lead */}
                    <p className="text-muted-foreground text-lg leading-relaxed border-l-2 border-primary/60 pl-5 mb-10">
                        {post.excerpt}
                    </p>

                    {/* Content sections */}
                    <div className="space-y-6">
                        {sections.map((section, i) => {
                            if (section.startsWith("## ")) {
                                return (
                                    <h2 key={i} className="font-heading text-xl font-semibold text-foreground pt-4">
                                        {section.slice(3)}
                                    </h2>
                                );
                            }
                            return (
                                <p key={i} className="text-muted-foreground text-base leading-relaxed">
                                    {section}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </article>

            {/* Divider */}
            <div className="section-padding border-t border-border/50 py-12">
                <div className="max-w-2xl">
                    <div className="card-glass-glow p-8 text-center">
                        <p className="font-heading text-xl font-semibold text-foreground mb-2">Want to benefit from these strategies?</p>
                        <p className="text-muted-foreground text-sm mb-5">Start investing in the same AI-driven funds discussed in this article.</p>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/25"
                        >
                            Start Investing →
                        </button>
                    </div>
                </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
                <div className="section-padding py-16">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-8">Related articles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                        {related.map((p) => (
                            <Link
                                key={p.id}
                                to={`/blog/${p.slug}`}
                                className="card-glass p-5 hover:border-primary/30 transition-all duration-300 group"
                            >
                                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full mb-3 ${p.categoryColor}`}>
                                    {p.category}
                                </span>
                                <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary/90 transition-colors leading-snug mb-3 line-clamp-2">
                                    {p.title}
                                </h4>
                                <div className="flex items-center gap-1 text-primary text-xs font-medium">
                                    Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
