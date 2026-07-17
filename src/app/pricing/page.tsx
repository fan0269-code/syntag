import { StaticPage } from "@/components/content/StaticPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, entityMetadata } from "@/lib/seo";

const description = "Compare Syrtag's permanently free public knowledge graph with planned Pro and Scholar tools for personal research workflows.";

export const metadata = entityMetadata({
  title: "Pricing",
  description,
  path: "/pricing",
  type: "website",
});

const plans = [
  {
    name: "Free",
    availability: "Available in Phase 1",
    billing: "Free forever",
    features: "Public graph, search, and every public entity and index page",
  },
  {
    name: "Pro",
    availability: "Planned for Phase 2",
    billing: "Monthly subscription",
    features: "Export interactive framework matches and save matching plans to personal projects",
  },
  {
    name: "Scholar",
    availability: "Planned for Phase 3",
    billing: "Monthly or annual, with academic pricing",
    features: "AI framework generation, cross-project graph comparison, and API quota",
  },
] as const;

export default function PricingPage() {
  return (
    <StaticPage title="Pricing">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Syrtag Pricing",
        description,
        url: absoluteUrl("/pricing"),
        isPartOf: { "@type": "WebSite", name: "Syrtag", url: absoluteUrl("/") },
      }} />
      <p><strong>Public content is free forever.</strong> Paid plans will cover tools and personal research capabilities, never access to public content pages.</p>
      <div className="responsive-table pricing-table" aria-label="Syrtag plan comparison">
        {plans.map((plan) => (
          <article key={plan.name}>
            <strong>{plan.name}</strong>
            <span><b>Availability</b>{plan.availability}</span>
            <span><b>Billing</b>{plan.billing}</span>
            <span><b>Included</b>{plan.features}</span>
          </article>
        ))}
      </div>
      <h2>What stays open</h2>
      <p>The public graph, search, all entity detail pages, and every public page listed in the sitemap remain freely accessible. Future gating will apply only to tool outputs and personalized features.</p>
      <p>Phase 2/3 功能上线后将在此开通。</p>
    </StaticPage>
  );
}
