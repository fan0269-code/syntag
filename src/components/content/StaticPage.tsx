import { PageFrame } from "@/components/common/PageFrame";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) { return <PageFrame><article className="entity-page content-layout"><Breadcrumbs path={[{ label: "Home", href: "/" }, { label: title }]} /><header className="entity-page__hero"><h1>{title}</h1></header><div className="static-prose">{children}</div></article></PageFrame>; }
