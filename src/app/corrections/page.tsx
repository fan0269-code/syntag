import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "Contact and corrections",
  description: "Current contact and correction-intake limitations for the Syrtag independent research-navigation project.",
  path: "/corrections",
  type: "website",
});

export default function CorrectionsPage() {
  return (
    <StaticPage
      title="Contact and corrections"
      description="Current public contact and correction-intake status"
    >
      <h2>Contact status</h2>
      <p>Syrtag does not currently publish or represent an email address or form as a monitored contact channel.</p>
      <h2>Correction status</h2>
      <p>Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and data-handling process are established.</p>
      <h2>Response timeframe</h2>
      <p>No response or resolution timeframe is currently promised.</p>
    </StaticPage>
  );
}
