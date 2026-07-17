import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const experience = readFileSync("src/components/graph/KnowledgeGraphExperience.tsx", "utf8");
const canvas = readFileSync("src/components/graph/GraphCanvas.tsx", "utf8");
const detail = readFileSync("src/components/graph/TheoryDetail.tsx", "utf8");

test("graph view controls expose an always-available labelled mode group and readable discipline state", () => {
  assert.match(experience, /className="graph-mobile-controls"/);
  assert.doesNotMatch(experience, /<details className="graph-mobile-controls">/);
  assert.match(experience, /role="group" aria-label="Graph view mode"/);
  assert.match(experience, /aria-pressed=\{mode === entry\.value\}/);
  assert.match(experience, /role="group" aria-label="Disciplines"/);
  assert.match(experience, /aria-pressed=\{entry\.slug === discipline\}/);
  assert.match(experience, /<GraphModeControls mode=\{mode\} setMode=\{changeMode\} \/>/);
  assert.doesNotMatch(experience, /<GraphControls discipline=\{discipline\} disciplines=\{availableDisciplines\} mode=\{mode\} setDiscipline=\{changeDiscipline\} setMode=\{changeMode\} \/>/);
});

test("graph offers visible keyboard instructions, a live selection announcement, and a discoverable node list", () => {
  assert.match(canvas, /className="graph-canvas__instructions"/);
  assert.match(canvas, /Arrow keys to move between nodes/);
  assert.match(canvas, /role="status" aria-live="polite"/);
  assert.match(canvas, /className="graph-canvas__node-picker"/);
  assert.match(canvas, /aria-label="Available graph nodes"/);
  assert.match(canvas, /aria-pressed=\{selected\?\.id === node\.id\}/);
  assert.match(canvas, /aria-expanded=\{selected\?\.id === node\.id\}/);
  assert.match(canvas, /aria-controls="graph-theory-detail"/);
});

test("selected details receive only relationships derived from the current graph edges", () => {
  assert.match(experience, /const selectedRelationships = useMemo/);
  assert.match(experience, /canvasEdges\.filter\(\(edge\) => edge\.source === selected\.id \|\| edge\.target === selected\.id\)/);
  assert.match(experience, /sourceLabel: nodeLabels\.get\(edge\.source\) \?\? edge\.source/);
  assert.match(experience, /targetLabel: nodeLabels\.get\(edge\.target\) \?\? edge\.target/);
  assert.match(experience, /relationships=\{selectedRelationships\}/);
  assert.match(detail, /relationships: GraphRelationship\[\]/);
  assert.match(detail, /<h3>Relationships<\/h3>/);
  assert.match(detail, /relationship\.sourceLabel[\s\S]*→[\s\S]*relationship\.targetLabel/);
});

test("the non-modal detail panel has a 44px control contract, closes with Escape, and restores graph focus", () => {
  assert.match(detail, /role="complementary"/);
  assert.match(detail, /id="graph-theory-detail"/);
  assert.match(detail, /hidden=\{!node\}/);
  assert.match(detail, /className="icon-control theory-detail__close"/);
  assert.match(detail, /event\.key === "Escape"/);
  assert.match(detail, /focusTarget\?\.focus\(\)/);
});

test("canvas opens details on a tap rather than pointerdown and stops continuous animation for reduced motion", () => {
  assert.doesNotMatch(canvas, /onPointerDown=\{[^}]*selectNode\(/);
  assert.match(canvas, /originX: number; originY: number; lastX: number; lastY: number; nodeId\?: string; moved: boolean/);
  assert.match(canvas, /Math\.hypot\(x - active\.originX, y - active\.originY\) > 6/);
  assert.match(canvas, /if \(active\?\.kind !== "node" \|\| active\.moved \|\| !active\.nodeId\) return;/);
  assert.match(canvas, /if \(node\?\.id === active\.nodeId\) selectNode\(node\)/);
  assert.match(canvas, /window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(canvas, /const floatY = reducedMotion \? 0/);
  assert.match(canvas, /context\.lineDashOffset = reducedMotion \? 0/);
  assert.match(canvas, /if \(!reducedMotion\) animationFrame = window\.requestAnimationFrame\(draw\)/);
});
