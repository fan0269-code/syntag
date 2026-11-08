import Link from "next/link";
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
      eyebrow="Trust"
      description="Current public contact and correction-intake status"
    >
      <h2>Contact status</h2>
      <p>Syrtag does not currently publish or represent an email address or form as a monitored contact channel.</p>
      <p>A registered entity or individual operator appears on the About page only when the owner fills those slots. Unfinished slots are not a legal name, and they are not a contact address.</p>
      <h2>Correction status</h2>
      <p>Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and data-handling process are established.</p>
      <p>The correction intake is unpublished. Do not send personal or sensitive data to an unpublished intake. This page is not a form, and it does not offer an address.</p>
      <h2>Response timeframe</h2>
      <p>No response or resolution timeframe is currently promised.</p>

      <h2>What a future correction would include</h2>
      <p>A public correction route is not open. Before one exists, the operator has to publish a monitored channel and a data-handling process. A later correction notice would name the page, the wording that changed, and the source used to check the change. Until that process exists, do not send personal or sensitive information to Syrtag.</p>
      <p>Read the <Link href="/editorial-policy">editorial policy</Link> and the <Link href="/about">about</Link> page for the current identity and responsibility limits.</p>

      <h2>Unpublished operator slots</h2>
      <p>These labels are empty on purpose. They are not contact addresses, and sending material to them is not possible from this page.</p>
      <dl className="owner-slots">
        <div>
          <dt>Contact channel</dt>
          <dd>Not published and not monitored.</dd>
        </div>
        <div>
          <dt>Corrections process</dt>
          <dd>Not established.</dd>
        </div>
      </dl>
    </StaticPage>
  );
}
