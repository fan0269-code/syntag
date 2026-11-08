import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const promptFiles = [
  "prompts/16-w1-f0-human-review.md",
  "prompts/17-w2-f0-unarchive-allowlist.md",
  "prompts/18-w3-published-surface-honesty.md",
  "prompts/19-w4-f1-life-course-concepts.md",
  "prompts/20-w5-teacher-identity-abstract-narrowing.md",
  "prompts/21-w6-phase-closeout.md",
] as const;

test("next-phase prompt files exist and are listed in README in order", () => {
  const readme = readFileSync("prompts/README.md", "utf8");
  const currentBlock = readme.slice(
    readme.indexOf("## 当前执行入口"),
    readme.indexOf("## 2026-08-03"),
  );

  assert.match(currentBlock, /docs\/roadmaps\/2026-11-08-content-optimization-and-next-phase\.md/);
  for (const file of promptFiles) {
    assert.match(currentBlock, new RegExp(file.replaceAll("/", "\\/")));
  }

  const first = currentBlock.indexOf(promptFiles[0]);
  const last = currentBlock.indexOf(promptFiles[promptFiles.length - 1]);
  assert.ok(first >= 0 && last > first, "W1 must appear before W6 in the current-entry block");
});

test("W1 forbids impersonating a reviewer and W2 requires U3 authorization", () => {
  const w1 = readFileSync("prompts/16-w1-f0-human-review.md", "utf8");
  const w2 = readFileSync("prompts/17-w2-f0-unarchive-allowlist.md", "utf8");
  const plan = readFileSync("docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md", "utf8");

  assert.match(w1, /不得充当审核者/);
  assert.match(w1, /不得把 status 改为 `published`/);
  assert.match(w2, /没有 W1 交接里的书面 `publication_authorization`，本窗口立即停止/);
  assert.match(plan, /本 PR 不改 `src\/data\/corpus\/`/);
  assert.match(plan, /不是 AdSense 申请/);
});
