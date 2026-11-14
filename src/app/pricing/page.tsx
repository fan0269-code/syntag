import type { Metadata } from "next";
import { StaticPage } from "@/components/content/StaticPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, entityMetadata } from "@/lib/seo";

const description = "Syrtag Free covers published navigation. Pro and Scholar are planned and not available for purchase.";

// Editorial contraction for a non-purchasable page: noindex, follow.
// This is not a claim that Google requires every pricing URL to be noindex.
export const metadata: Metadata = {
  ...entityMetadata({
    title: "Pricing — Free navigation; Pro planned | Syrtag",
    description,
    path: "/pricing",
    type: "website",
  }),
  robots: { index: false, follow: true },
};

const plans = [
  {
    name: "Free",
    availability: "Available now",
    access: "No account or payment required",
    details: "Search, trust pages, and any catalog page that is actually published",
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
      lede="Reading published Syrtag pages does not require an account or a payment. Pro and Scholar are listed so their status is clear: they are not available."
      adScreen="pricing"
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
      <h2>What stays open</h2>
      <p>Published pages stay free to read, including trust pages and entity pages that pass the publication boundary. Free is the current access state. It is not a paid tier, and it does not describe the catalog as empty. Pro and Scholar cannot be purchased. This page has no checkout and no registration form.</p>
    </StaticPage>
  );
}
