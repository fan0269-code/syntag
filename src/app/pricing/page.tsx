import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, entityMetadata } from "@/lib/seo";

const description = "Syrtag has no paid plans today. Free access applies to whatever is published; it does not mean every catalog is filled.";

export const metadata = entityMetadata({
  title: "Pricing",
  description,
  path: "/pricing",
  type: "website",
});

const plans = [
  {
    name: "Free",
    availability: "Available now",
    access: "No account or payment required",
    details: "No paywall on published pages, search, or the graph when a published graph exists. An empty catalog is still free access, not a product limit.",
  },
  {
    name: "Pro",
    availability: "Planned — not available",
    access: "No purchase or subscription is available today.",
    details: "Future access details have not been announced.",
  },
  {
    name: "Scholar",
    availability: "Planned — not available",
    access: "No purchase or subscription is available today.",
    details: "Future access details have not been announced.",
  },
] as const;

export default function PricingPage() {
  return (
    <StaticPage
      title="Pricing"
      eyebrow="Access and roadmap"
      description={description}
      lede="Free means there is no purchase or account gate today. It does not claim that published theories, scholars, or a public graph are already available."
    >
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Syrtag Pricing",
        description,
        url: absoluteUrl("/pricing"),
        isPartOf: { "@type": "WebSite", name: "Syrtag", url: absoluteUrl("/") },
      }} />
      <div className="responsive-table pricing-table" aria-label="Syrtag access status">
        {plans.map((plan) => (
          <article key={plan.name}>
            <strong>{plan.name}</strong>
            <span><b>Status</b>{plan.availability}</span>
            <span><b>Access</b>{plan.access}</span>
            <span><b>Details</b>{plan.details}</span>
          </article>
        ))}
      </div>
      <h2>What Free covers</h2>
      <p>Free covers the public site with no account and no payment. Search, trust pages, and index routes stay reachable. A published entity page or published graph appears only when its record status is published. The current authored corpus keeps entity records in draft or archived state, so a database seeded from that corpus has no public entity pages.</p>
      <p>Advertising is off. See the <Link href="/privacy">privacy page</Link> and the <Link href="/about">about page</Link> for the advertising and publication boundaries.</p>
    </StaticPage>
  );
}
