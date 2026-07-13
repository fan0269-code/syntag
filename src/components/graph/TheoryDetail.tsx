"use client";

import Link from "next/link";
import type { GraphNodeModel } from "./types";
import { entityDetailHref, isEntityType } from "@/lib/entity-routes";

export function TheoryDetail({ node, onClose }: { node: GraphNodeModel | null; onClose: () => void }) {
  const articleHref = node?.data?.articleHref ?? (node?.data?.slug && isEntityType(node.type) ? entityDetailHref(node.type, node.data.slug) : undefined);
  return (
    <aside className={`theory-detail${node ? " theory-detail--open" : ""}`} aria-hidden={!node} aria-label="Selected node details">
      {node && <>
        <button className="theory-detail__close" type="button" onClick={onClose} aria-label="Close details">×</button>
        <span className="theory-detail__type">{node.type}</span>
        <h2>{node.label}</h2>
        <p>{node.data?.summary || "An entry in the Syrtag research knowledge graph."}</p>
        {node.data?.concepts && node.data.concepts.length > 0 && <div className="theory-detail__concepts"><h3>Core concepts</h3><div>{node.data.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div></div>}
        {articleHref && <Link href={articleHref} className="theory-detail__article">Read Full Article <span aria-hidden="true">→</span></Link>}
      </>}
    </aside>
  );
}
