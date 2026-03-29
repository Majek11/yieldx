import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LegalPageProps {
    title: string;
    lastUpdated: string;
    sections: { heading: string; body: string[] }[];
}

function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="section-padding pt-32 pb-24 max-w-3xl mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-10"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to home
                </Link>

                <div className="mb-10">
                    <h1 className="font-heading text-4xl font-semibold text-foreground mb-2">{title}</h1>
                    <p className="text-muted-foreground text-sm">Last updated: {lastUpdated}</p>
                </div>

                <div className="space-y-8">
                    {sections.map((s, i) => (
                        <div key={i} className="card-glass p-6">
                            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
                                {i + 1}. {s.heading}
                            </h2>
                            <div className="space-y-3">
                                {s.body.map((para, j) => (
                                    <p key={j} className="text-muted-foreground text-sm leading-relaxed">
                                        {para}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-muted-foreground text-xs mt-12 text-center">
                    Questions? Contact us at{" "}
                    <a href="mailto:legal@yieldx.io" className="text-primary hover:underline">
                        legal@yieldx.io
                    </a>
                </p>
            </div>
            <Footer />
        </div>
    );
}

export function TermsPage() {
    return (
        <LegalPage
            title="Terms of Service"
            lastUpdated="March 1, 2026"
            sections={[
                {
                    heading: "Acceptance of Terms",
                    body: [
                        "By accessing or using the YieldX platform, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree with any of these terms, you are prohibited from using this service.",
                        "YieldX Technologies Ltd is registered in England & Wales (Company No. 14295821). These terms constitute a legally binding agreement between you and YieldX.",
                    ],
                },
                {
                    heading: "Eligibility",
                    body: [
                        "You must be at least 18 years of age to use our platform. By registering, you confirm that you meet this requirement and that the information you provide is accurate and complete.",
                        "YieldX is not available in certain restricted jurisdictions. You are responsible for ensuring that your use of our platform complies with local laws and regulations.",
                    ],
                },
                {
                    heading: "Investment Risk Disclaimer",
                    body: [
                        "Cryptocurrency investments are highly volatile. Past performance of any fund or strategy is not indicative of future results. You may lose some or all of your invested capital.",
                        "YieldX provides investment management services but does not guarantee any particular return. All investment decisions are made on your behalf by our AI systems in accordance with your selected strategy.",
                    ],
                },
                {
                    heading: "KYC & AML Compliance",
                    body: [
                        "In compliance with anti-money laundering (AML) regulations, we require identity verification (KYC) for all users seeking to deposit or withdraw funds above minimum thresholds.",
                        "You agree to provide accurate identification documents and consent to our verification processes. Providing false information is a breach of these terms and may result in account termination.",
                    ],
                },
                {
                    heading: "Fees",
                    body: [
                        "Management and performance fees are as described on our Pricing page. Fees may be updated with 30 days written notice. Continued use of the platform after such notice constitutes acceptance of new fee terms.",
                    ],
                },
                {
                    heading: "Account Security",
                    body: [
                        "You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorised use. YieldX will not be liable for losses arising from your failure to secure your account.",
                    ],
                },
                {
                    heading: "Termination",
                    body: [
                        "Either party may terminate the agreement at any time. Upon termination, we will return your assets within 5 business days, less any applicable fees. YieldX reserves the right to suspend accounts involved in suspicious or prohibited activity.",
                    ],
                },
            ]}
        />
    );
}

export function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            lastUpdated="March 1, 2026"
            sections={[
                {
                    heading: "Data We Collect",
                    body: [
                        "We collect information you provide directly: name, email address, phone number, identity documents (for KYC), and financial information necessary to operate your account.",
                        "We automatically collect usage data, device identifiers, IP addresses, and cookie data when you access our platform. This is used to improve platform performance and detect fraud.",
                    ],
                },
                {
                    heading: "How We Use Your Data",
                    body: [
                        "Your data is used to: administer your account, process transactions, verify your identity, comply with legal obligations, detect and prevent fraud, and improve our services.",
                        "We do not sell your personal data to third parties. We may share data with service providers (e.g., KYC verification partners, cloud infrastructure providers) under strict data processing agreements.",
                    ],
                },
                {
                    heading: "Data Retention",
                    body: [
                        "We retain your data for as long as your account is active, and for up to 7 years after closure to comply with financial regulations. KYC documents are retained as required by applicable AML laws.",
                    ],
                },
                {
                    heading: "Your Rights (GDPR)",
                    body: [
                        "If you are in the European Economic Area, you have rights to access, rectify, erase, restrict, and port your data. You may object to certain processing activities. To exercise these rights, contact privacy@yieldx.io.",
                    ],
                },
                {
                    heading: "Cookies",
                    body: [
                        "We use essential cookies necessary for the platform to function, and optional analytics/marketing cookies (with your consent). You can manage your preferences at any time via the cookie banner.",
                    ],
                },
                {
                    heading: "Security",
                    body: [
                        "We employ industry-standard encryption (TLS 1.3), access controls, and regular security audits to protect your data. Our infrastructure is CertiK audited and ISO 27001 aligned.",
                    ],
                },
            ]}
        />
    );
}

export function RiskPage() {
    return (
        <LegalPage
            title="Risk Disclosure"
            lastUpdated="March 1, 2026"
            sections={[
                {
                    heading: "Cryptocurrency Volatility",
                    body: [
                        "Cryptocurrency markets are highly volatile. Prices can change dramatically over short periods. You may experience significant gains or losses. Never invest more than you can afford to lose.",
                    ],
                },
                {
                    heading: "No Guarantee of Returns",
                    body: [
                        "All performance data shown on this platform is historical. Past returns do not guarantee future results. Our AI strategies are designed to optimise risk-adjusted returns, but cannot ensure profitability.",
                    ],
                },
                {
                    heading: "Regulatory Risk",
                    body: [
                        "The regulatory environment for cryptocurrencies is evolving rapidly. Changes in law may adversely affect the value of your investments or our ability to operate in certain jurisdictions.",
                    ],
                },
                {
                    heading: "Smart Contract Risk",
                    body: [
                        "DeFi strategies involve interaction with smart contracts. Despite CertiK audits, smart contracts may contain vulnerabilities that could result in loss of funds. We mitigate this risk through insurance and diversification.",
                    ],
                },
                {
                    heading: "Liquidity Risk",
                    body: [
                        "In certain market conditions, it may be difficult or impossible to execute trades at desired prices. This can occur in low-liquidity markets or during periods of extreme volatility.",
                    ],
                },
                {
                    heading: "Counterparty Risk",
                    body: [
                        "We use third-party exchanges, custodians and protocols. While we vet all partners thoroughly, their failure could impact your assets. 95% of assets are held in institutional cold storage to mitigate this risk.",
                    ],
                },
                {
                    heading: "Not Financial Advice",
                    body: [
                        "Nothing on this platform constitutes financial, investment, tax or legal advice. You should consult a qualified financial advisor before making investment decisions. YieldX is an investment manager, not a financial adviser.",
                    ],
                },
            ]}
        />
    );
}
