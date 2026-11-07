import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { entityMetadata } from "@/lib/seo";

export const metadata = entityMetadata({
  title: "Terms — Educational navigation, not professional advice | Syrtag",
  description: "Syrtag provides educational navigation for research theories. Verify primary sources. Not a substitute for supervision, peer review, or professional advice.",
  path: "/terms",
  type: "website",
});

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of use"
      eyebrow="Trust"
      description="Informational pages for research navigation. Not a credential, a journal, or a writing service."
    >
      <p>Syrtag content is provided for informational and educational purposes. Verify scholarly claims with original sources and your institution&apos;s guidance before relying on them in research work.</p>
      <h2>User responsibility</h2>
      <p>Check the original works and your supervisor before treating a pathway as a dissertation frame. Read the <Link href="/editorial-policy">editorial policy</Link> for how sources and limited review are labeled, and the <Link href="/corrections">corrections</Link> page for the current contact limit.</p>

      <h2>What Syrtag provides</h2>
      <p>Syrtag provides informational pages and, when records are published, a graph for moving among those pages. It is a study aid for reading and comparing research theories. The intended public scope is education and sociology.</p>

      <h2>What Syrtag does not provide</h2>
      <p>Syrtag is not a ghostwriting service, a degree or admissions broker, a journal, or a substitute for supervision. It does not certify academic qualifications, and it does not sell publication, admission, or review outcomes.</p>

      <h2>Published and unpublished material</h2>
      <p>Only records with status published are public. Seed data, draft records, archived records, and the local development demo graph are not published scholarship, even when they exist in the repository or in a development database.</p>

      <h2>Advertising</h2>
      <p>Syrtag does not currently serve advertisements. The <Link href="/privacy">privacy page</Link> is the measurement and advertising boundary. Pricing describes access that exists today and labels anything else as not available.</p>
    </StaticPage>
  );
}
