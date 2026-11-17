import Link from "next/link";
import { routesForSlugs, type ReadingRoute } from "@/lib/published-reading-routes";

export function IndexChoiceGuide({
  routes,
  items,
  hrefForSlug,
  title,
  intro,
}: {
  routes: readonly ReadingRoute[];
  items: ReadonlyArray<{ slug: string }>;
  hrefForSlug: (slug: string) => string;
  title: string;
  intro: string;
}) {
  const visible = routesForSlugs(routes, new Set(items.map((item) => item.slug)));
  if (!visible.length) return null;

  return (
    <section className="prose-section" aria-label={title}>
      <h2>{title}</h2>
      <p>{intro}</p>
      <div className="responsive-table">
        {visible.map((route) => (
          <article key={route.slug}>
            <strong><Link href={hrefForSlug(route.slug)}>{route.heading}</Link></strong>
            <span>{route.prompt}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
