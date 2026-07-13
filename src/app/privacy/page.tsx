import { StaticPage } from "@/components/content/StaticPage"; import { entityMetadata } from "@/lib/seo";
export const metadata = entityMetadata({ title: "Privacy", description: "Syrtag privacy information.", path: "/privacy", type: "website" });
export default function PrivacyPage() { return <StaticPage title="Privacy"><p>Syrtag does not require an account in Phase 1. Standard server logs and privacy-preserving analytics may be used to operate and improve the site.</p><p>If advertising is enabled in a later phase, this page will be updated before the service changes.</p></StaticPage>; }
