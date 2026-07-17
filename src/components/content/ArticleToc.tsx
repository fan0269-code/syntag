"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string };

export function ArticleToc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".entity-page");
    if (!article) return;
    const headings = Array.from(article.querySelectorAll<HTMLHeadingElement>(".prose-section > h2"));
    const nextItems = headings.map((heading, index) => {
      const id = heading.parentElement?.id || `section-${index + 1}`;
      if (heading.parentElement) heading.parentElement.id = id;
      return { id, label: heading.textContent?.trim() || `Section ${index + 1}` };
    });
    const frame = window.requestAnimationFrame(() => {
      setItems(nextItems);
      setActiveId(nextItems[0]?.id ?? "");
    });

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveId(visible.target.id);
    }, { rootMargin: "-18% 0px -70%", threshold: 0 });
    headings.forEach((heading) => heading.parentElement && observer.observe(heading.parentElement));
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  if (items.length < 2) return null;
  return <ArticleTocMarkup items={items} activeId={activeId} />;
}

export function ArticleTocMarkup({ items, activeId }: { items: TocItem[]; activeId: string }) {
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <nav className="article-toc article-toc--responsive" aria-label="On this page" data-current-section={activeItem?.id ?? ""}>
      <details className="article-toc__details">
        <summary className="article-toc__trigger" aria-controls="article-toc-list">
          <span className="article-toc__label">On this page</span>
          <span className="article-toc__current">{activeItem?.label ?? "Section"}</span>
        </summary>
        <ol id="article-toc-list" className="article-toc__list">
          {items.map((item) => (
            <li key={item.id} className="article-toc__item">
              <a className="article-toc__link" href={`#${item.id}`} aria-current={activeId === item.id ? "location" : undefined}>{item.label}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
