import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({ title: "Privacy", description: "Syrtag privacy information.", path: "/privacy", type: "website" });

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy">
      <h2>Current measurement boundary</h2>
      <p>Syrtag does not use third-party on-site behavioural analytics. It does not collect research questions or raw site-search terms for analytics.</p>
      <p>Google Search Console is an external, aggregate search-performance tool. It can report how pages appear in Google Search; it is not used to collect a visitor&apos;s research question inside Syrtag.</p>
      <h2>Services not enabled</h2>
      <p>Syrtag has not enabled advertising technology, email services, or tracking cookies. This page will be updated before those practices change.</p>
    </StaticPage>
  );
}
