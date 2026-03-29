import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Clock } from "lucide-react";
import peopleBlog1 from "@/assets/people-blog1.jpg";
import peopleBlog2 from "@/assets/people-blog2.jpg";
import peopleTeam from "@/assets/people-team.jpg";
import { useNavigate } from "react-router-dom";

const posts = [
  {
    title: "How Our AI Is Consistently Beating the Crypto Market",
    date: "March 21, 2026",
    readTime: "8 min",
    img: peopleBlog1,
    desc: "We break down the quantitative signals, backtesting methodology, and real-time rebalancing triggers behind our AI Alpha Fund's 127% annual return.",
    slug: "how-ai-beating-crypto-market",
    category: "AI & Strategy",
  },
  {
    title: "DeFi Yield Farming: Chasing APY vs. Managing Real Risk",
    date: "March 14, 2026",
    readTime: "6 min",
    img: peopleBlog2,
    desc: "Not all yield is created equal. Learn how we evaluate protocol risk, smart contract exposure, and impermanent loss to deliver sustainable DeFi returns.",
    slug: "defi-yield-strategy-explained",
    category: "DeFi",
  },
  {
    title: "Bitcoin Halving 2024: How We Positioned Our Portfolios",
    date: "March 1, 2026",
    readTime: "7 min",
    img: peopleTeam,
    desc: "We share the exact strategy adjustments we made ahead of the most anticipated event in crypto — and the returns they delivered.",
    slug: "bitcoin-halving-portfolio",
    category: "Market Analysis",
  },
];

const BlogSection = () => {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.fromTo(".blog-section-card",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".blog-section-grid", start: "top 85%" },
      });
  }, { scope: ref });

  return (
    <section ref={ref} className="section-padding py-28">
      <div className="flex items-end justify-between mb-14">
        <div>
          <span className="text-primary text-sm font-medium">YieldX Insights</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mt-3">
            Market Insights &<br />Research
          </h2>
        </div>
        <button
          onClick={() => navigate("/blog")}
          className="hidden md:flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-300"
        >
          View all posts <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="blog-section-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <div
            key={i}
            className="blog-section-card card-glass flex flex-col group hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/blog/${p.slug}`)}
          >
            {/* Image */}
            <div className="overflow-hidden h-44 flex-shrink-0">
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                width={640}
                height={512}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary text-xs font-semibold bg-primary/10 rounded-full px-2.5 py-0.5">
                  {p.category}
                </span>
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-2 leading-snug group-hover:text-primary/90 transition-colors line-clamp-2">
                {p.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{p.desc}</p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Clock className="w-3.5 h-3.5" /> {p.readTime} read
                </div>
                <div className="flex items-center gap-1 text-primary text-xs font-medium group-hover:gap-2 transition-all">
                  Read <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 md:hidden">
        <button
          onClick={() => navigate("/blog")}
          className="text-primary text-sm font-medium flex items-center gap-2 mx-auto"
        >
          View all posts <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default BlogSection;
