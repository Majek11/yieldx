import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";
import peopleSuccess from "@/assets/people-success.jpg";
import peopleInstitutional from "@/assets/people-institutional.jpg";
import { useNavigate } from "react-router-dom";

const cases = [
  {
    img: peopleSuccess,
    category: "Retail Investor",
    title: "How Marcus turned $5,000 into $28,400 in 14 months",
    desc: "Using the Balanced Growth Fund, Marcus automated his crypto investing and achieved 168% returns — beating the S&P 500 by 6x while sleeping.",
    stats: [
      { icon: DollarSign, val: "+$23,400", label: "profit generated" },
      { icon: TrendingUp, val: "168%", label: "total return" },
    ],
  },
  {
    img: peopleInstitutional,
    category: "Family Office",
    title: "Meridian Capital: $2M AUM, 94% annual return",
    desc: "A London family office moved $2M into YieldX's AI Alpha Fund and DeFi strategies. Our institutional team delivered 94% annual return on risk-adjusted capital.",
    stats: [
      { icon: Users, val: "$2M", label: "assets deployed" },
      { icon: TrendingUp, val: "94%", label: "annual return" },
    ],
  },
];

const CaseStudies = () => {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.fromTo(".case-title-block",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    gsap.fromTo(".case-card",
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: ".case-cards-grid", start: "top 85%" },
      });
  }, { scope: ref });

  return (
    <section ref={ref} className="section-padding py-28">
      <div className="case-title-block mb-14">
        <span className="text-primary text-sm font-medium">Success Stories</span>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mt-3 mb-4">
          Real Investors,<br />Real Returns.
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          From first-time retail investors to institutional family offices — our AI strategies consistently deliver across every portfolio size.
        </p>
      </div>
      <div className="case-cards-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c, i) => (
          <div key={i} className="case-card card-glass overflow-hidden group hover:border-primary/30 transition-all duration-300 flex flex-col">
            {/* Image */}
            <div className="overflow-hidden h-40 flex-shrink-0">
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                width={640}
                height={512}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <span className="text-primary text-xs font-semibold bg-primary/10 rounded-full px-3 py-1 self-start mb-3">
                {c.category}
              </span>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3 leading-snug">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{c.desc}</p>

              {/* Stats */}
              <div className="flex gap-4 mb-5">
                {c.stats.map((s) => (
                  <div key={s.label} className="bg-card/60 border border-border/40 rounded-xl px-4 py-3 flex items-center gap-2.5">
                    <s.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-heading text-lg font-bold text-foreground">{s.val}</p>
                      <p className="text-muted-foreground text-xs">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-300 group-hover:text-primary/80"
              >
                Start your story <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;
