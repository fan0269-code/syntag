"use client";

import Link from "next/link";
import { useCallback, useEffect, type RefObject } from "react";
import type { GraphNodeModel } from "./types";
import { entityDetailHref, isEntityType } from "@/lib/entity-routes";

export type GraphRelationship = {
  id: string;
  sourceLabel: string;
  targetLabel: string;
  type: string;
  label?: string;
};

function formatRelation(type: string) { return type.replaceAll("_", " "); }

export function TheoryDetail({ node, relationships, onClose, returnFocusTarget }: { node: GraphNodeModel | null; relationships: GraphRelationship[]; onClose: () => void; returnFocusTarget?: RefObject<HTMLElement | null> }) {
  const articleHref = node?.data?.articleHref ?? (node?.data?.slug && isEntityType(node.type) ? entityDetailHref(node.type, node.data.slug) : undefined);
  const focusTarget = returnFocusTarget?.current;
  const closeAndReturnFocus = useCallback(() => {
    onClose();
    window.requestAnimationFrame(() => focusTarget?.focus());
  }, [focusTarget, onClose]);

  useEffect(() => {
    if (!node) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndReturnFocus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [closeAndReturnFocus, node]);

  return (
    <aside id="graph-theory-detail" className={`theory-detail${node ? " theory-detail--open" : ""}`} role="complementary" aria-hidden={!node} aria-label={node ? `Selected node details: ${node.label}` : "Selected node details"} hidden={!node}>
      {node && <>
        <button className="icon-control theory-detail__close" type="button" onClick={closeAndReturnFocus} aria-label="Close details">×</button>
        <span className="theory-detail__type">{node.type}</span>
        <h2>{node.label}</h2>
        <p>{node.data?.summary || "An entry in the Syrtag research knowledge graph."}</p>
        {relationships.length > 0 && <div className="theory-detail__relationships"><h3>Relationships</h3><ul>{relationships.map((relationship) => <li key={relationship.id}><span>{relationship.sourceLabel} → {relationship.targetLabel}</span><span>{relationship.label || formatRelation(relationship.type)}</span></li>)}</ul></div>}
        {node.data?.concepts && node.data.concepts.length > 0 && <div className="theory-detail__concepts"><h3>Core concepts</h3><div>{node.data.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div></div>}
        {articleHref && <Link href={articleHref} className="theory-detail__article">View details <span aria-hidden="true">→</span></Link>}
      </>}
    </aside>
  );
}
