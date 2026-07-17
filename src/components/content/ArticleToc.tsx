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
  const links = items.map((item) => <a key={item.id} href={`#${item.id}`} aria-current={activeId === item.id ? "location" : undefined}>{item.label}</a>);
  return <nav className="article-toc" aria-label="On this page"><strong>On this page</strong><div>{links}</div><details><summary>On this page</summary><div>{links}</div></details></nav>;
}
