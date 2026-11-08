import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "Framework Builder",
  description: "A guided research-framework tool is planned for a future Syrtag phase.",
  path: "/framework-builder",
  type: "website",
  noindex: true,
});

export default function FrameworkBuilderPage() {
  return (
    <StaticPage
      title="Framework Builder"
      eyebrow="Planned"
      description="A guided research-framework tool is planned. It is not available today."
    >
      <p>The Framework Builder is planned for a later phase. It is not live, and this page is not a product launch.</p>
      <p>The current site focuses on source-aware navigation pages and, when records are published, a graph for moving among those pages. The intended public scope is education and sociology. Draft, archived, and local demo records are not published scholarship.</p>
      <p>For now, use the <Link href="/topics">topics</Link>, <Link href="/theories">theories</Link>, and <Link href="/about">about</Link> pages to see what is published and what remains unpublished.</p>
    </StaticPage>
  );
}
