import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cssFiles = [
  "src/app/globals.css",
  "src/app/styles/shell.css",
  "src/app/styles/search.css",
  "src/app/styles/graph.css",
  "src/app/styles/content.css",
];
const styles = cssFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const layout = readFileSync("src/app/layout.tsx", "utf8");

function tokenValue(name: string) {
  const match = styles.match(new RegExp(`${name}:\\s*([^;]+);`));
  assert.ok(match, `Expected ${name} to be defined`);
  return match[1].trim();
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  assert.match(normalized, /^[0-9a-f]{6}$/i, `Expected ${hex} to be a 6-digit hex color`);

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16) / 255,
    g: Number.parseInt(normalized.slice(2, 4), 16) / 255,
    b: Number.parseInt(normalized.slice(4, 6), 16) / 255,
  };
}

function channelLuminance(channel: number) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: string, background: string) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  const fgLum = 0.2126 * channelLuminance(fg.r) + 0.7152 * channelLuminance(fg.g) + 0.0722 * channelLuminance(fg.b);
  const bgLum = 0.2126 * channelLuminance(bg.r) + 0.7152 * channelLuminance(bg.g) + 0.0722 * channelLuminance(bg.b);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

test("global CSS exposes shared UI design tokens", () => {
  assert.equal(tokenValue("--control-height"), "44px");
  assert.equal(tokenValue("--control-height-compact"), "36px");

  for (const token of [
    "--space-1",
    "--space-2",
    "--space-3",
    "--space-4",
    "--space-6",
    "--space-8",
    "--type-xs",
    "--type-sm",
    "--type-base",
    "--type-lg",
    "--type-xl",
    "--status-success",
    "--status-info",
    "--status-warning",
    "--status-danger",
    "--motion-duration-fast",
    "--motion-duration-base",
    "--motion-ease-standard",
    "--container-page",
    "--container-article",
  ]) {
    assert.ok(styles.includes(`${token}:`), `Missing ${token}`);
  }
});

test("focus and reusable control styles are wired to tokens", () => {
  assert.ok(styles.includes("--focus-ring-color:"), "Missing focus ring color token");
  assert.ok(styles.includes("--focus-ring-width:"), "Missing focus ring width token");
  assert.ok(styles.includes("--focus-ring-offset:"), "Missing focus ring offset token");
  assert.match(styles, /:focus-visible\s*\{[\s\S]*?outline:\s*var\(--focus-ring-width\)\s+solid\s+var\(--focus-ring-color\)/);
  assert.match(styles, /\.btn\s*\{[\s\S]*?min-height:\s*var\(--control-height\)/);
  assert.match(styles, /\.icon-control\s*\{[\s\S]*?height:\s*var\(--control-height\)[\s\S]*?width:\s*var\(--control-height\)/);
});

test("motion tokens include a reduced motion baseline", () => {
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(styles, /animation-duration:\s*0\.01ms\s*!important/);
  assert.match(styles, /transition-duration:\s*0\.01ms\s*!important/);
  assert.match(styles, /scroll-behavior:\s*auto\s*!important/);
});

test("low fit text color keeps WCAG AA contrast on warm surfaces", () => {
  const fitLow = tokenValue("--fit-low");
  const bgSurface = tokenValue("--bg-surface");
  const bgPage = tokenValue("--bg-page");

  assert.ok(contrastRatio(fitLow, bgSurface) >= 4.5, "--fit-low must be AA on --bg-surface");
  assert.ok(contrastRatio(fitLow, bgPage) >= 4.5, "--fit-low must be AA on --bg-page");
});

test("fonts are self-hosted through next/font rather than CSS Google imports", () => {
  assert.doesNotMatch(styles, /@import\s+url\(["']?https:\/\/fonts\.googleapis\.com/i);
  assert.doesNotMatch(styles, /fonts\.gstatic\.com/i);
  assert.match(layout, /from\s+"next\/font\/google"/);
  assert.match(layout, /Inter\(/);
  assert.match(layout, /Source_Serif_4\(/);
  assert.match(layout, /variable:\s*"--font-inter"/);
  assert.match(layout, /variable:\s*"--font-source-serif"/);
  assert.match(styles, /--font-body:\s*var\(--font-inter\)/);
  assert.match(styles, /--font-heading:\s*var\(--font-source-serif\)/);
});
