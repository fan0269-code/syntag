import { StaticPage } from "@/components/content/StaticPage"; import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Terms of use", description: "Terms for using Syrtag research theory resources.", path: "/terms", type: "website" });
export default function TermsPage() { return <StaticPage title="Terms of use"><p>Syrtag content is provided for informational and educational purposes. Verify scholarly claims with original sources and your institution&apos;s guidance before relying on them in research work.</p></StaticPage>; }
