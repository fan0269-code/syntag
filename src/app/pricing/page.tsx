import { StaticPage } from "@/components/content/StaticPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, entityMetadata } from "@/lib/seo";

const description = "See what is available free on Syrtag today and the status of future access plans.";

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
    details: "Public graph, search, and every public entity and index page",
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
      lede="Syrtag's public research knowledge base is available free today. Future plans are listed only to clarify their current status."
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
      <p>The public graph, search, all entity detail pages, and every public page listed in the sitemap remain freely accessible.</p>
    </StaticPage>
  );
}
