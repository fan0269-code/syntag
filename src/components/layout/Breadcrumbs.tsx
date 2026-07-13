import Link from "next/link";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLdBreadcrumb";
import { canonicalEntityIndexHref } from "@/lib/entity-routes";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ path }: { path: BreadcrumbItem[] }) {
  const canonicalPath = path.map((item) => ({ ...item, href: canonicalEntityIndexHref(item.href) }));
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {canonicalPath.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {index > 0 && <span className="breadcrumbs__separator" aria-hidden="true">/</span>}
            {item.href && index < path.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current={index === path.length - 1 ? "page" : undefined}>{item.label}</span>}
          </span>
        ))}
      </nav>
      <JsonLdBreadcrumb items={canonicalPath} />
    </>
  );
}
