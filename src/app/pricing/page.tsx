import { StaticPage } from "@/components/content/StaticPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, entityMetadata } from "@/lib/seo";

const description = "Published Syrtag pages are free to read. Pro and Scholar plans are not for sale.";

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
      <p>Pages that Syrtag has published stay free to read, including trust pages and any entity page that passes the publication boundary. An empty catalog is still free to read. It is not a paid tier, and it is not a promise that entity pages already exist. Pro and Scholar cannot be purchased.</p>
    </StaticPage>
  );
}
