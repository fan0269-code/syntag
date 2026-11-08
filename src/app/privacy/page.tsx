import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "Privacy",
  description: "What Syrtag does not collect, and the current advertising boundary.",
  path: "/privacy",
  type: "website",
});

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy"
      eyebrow="Trust"
      description="Advertising, email, and tracking cookies are not enabled."
    >
      <h2>Current measurement boundary</h2>
      <p>Syrtag does not use third-party on-site behavioural analytics. It does not collect research questions or raw site-search terms for analytics.</p>
      <p>Google Search Console is an external, aggregate search-performance tool. It can report how pages appear in Google Search; it is not used to collect a visitor&apos;s research question inside Syrtag.</p>

      <h2>Services not enabled</h2>
      <p>Syrtag has not enabled advertising technology, email services, or tracking cookies. This page will be updated before those practices change.</p>
      <p>No advertising script is loaded. While advertising stays off, the site does not publish an ads.txt publisher authorization and does not publish a google-adsense-account metadata tag. Either signal would be added only in the same change that updates this page, and only if the operator later chooses to serve ads.</p>
      <p>Syrtag does not ask visitors to click advertisements. Navigation labels are not advertisements. The <Link href="/about">about</Link> page repeats the same advertising-off boundary in plain language.</p>

      <h2>What this page does not promise</h2>
      <p>This page describes current site behavior. It is not a notice that an advertising partner is already receiving visitor data, and it is not consent language for personalized ads. If advertising is enabled later, this page has to name the cookies, identifiers, and partners involved before any tag loads.</p>
    </StaticPage>
  );
}
