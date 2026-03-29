import Navbar from "@/components/Navbar";
import MarketTicker from "@/components/MarketTicker";
import HeroSection from "@/components/HeroSection";
import PartnersSection from "@/components/PartnersSection";
import HowItWorks from "@/components/HowItWorks";
import InvestmentPerformance from "@/components/InvestmentPerformance";
import BlockchainSolutions from "@/components/BlockchainSolutions";
import SmartContractSections from "@/components/SmartContractSections";
import SecurityCompliance from "@/components/SecurityCompliance";
import StatsAndValues from "@/components/StatsAndValues";
import CaseStudies from "@/components/CaseStudies";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MarketTicker />
      <PartnersSection />
      <HowItWorks />
      <InvestmentPerformance />
      <BlockchainSolutions />
      <SmartContractSections />
      <SecurityCompliance />
      <StatsAndValues />
      <CaseStudies />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
      <Footer />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
};

export default Index;
