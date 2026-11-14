import { PageFrame } from "@/components/common/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { AdScreenKind } from "@/lib/ad-screen";

type StaticPageProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  lede?: string;
  adScreen?: AdScreenKind;
  children: React.ReactNode;
};

export function StaticPage({ title, eyebrow, description, lede, adScreen = "policy", children }: StaticPageProps) {
  return <PageFrame adScreen={adScreen}><article className="entity-page content-layout static-page"><Breadcrumbs path={[{ label: "Home", href: "/" }, { label: title }]} /><header className="entity-page__hero static-page__hero">{eyebrow && <span className="static-page__eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p className="static-page__description">{description}</p>}{lede && <p className="static-page__lede">{lede}</p>}</header><div className="static-prose">{children}</div></article></PageFrame>;
}
