import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

const roles = [
  {
    name: "content-polish-agent",
    markers: [
      "只润色，不新增事实、关系、来源",
      "polish_verdict: PASS | FAIL | BLOCKED",
      "claim drift",
    ],
  },
  {
    name: "content-layout-agent",
    markers: [
      "只处理排版和页面结构",
      "layout_verdict: PASS | FAIL | BLOCKED",
      "不得修改 `src/`、`prisma/`、`tests/`",
    ],
  },
  {
    name: "content-audit-agent",
    markers: [
      "最终审计闸门",
      "audit_verdict: PASS | FAIL | BLOCKED",
      "不得把 Agent 的 PASS 视为 owner 批准",
    ],
  },
];

test("content pipeline uses separate, row-level agents before implementation", () => {
  for (const role of roles) {
    const skillPath = join(root, ".agents", "skills", role.name, "SKILL.md");
    const configPath = join(root, ".agents", "skills", role.name, "agents", "openai.yaml");
    const skill = readFileSync(skillPath, "utf8");
    const config = readFileSync(configPath, "utf8");

    assert.match(skill, new RegExp(`name: ${role.name}`));
    assert.match(skill, /one article per independent context/);
    assert.match(skill, /review_decision: pending_review/);
    assert.match(skill, /implementation_gate: open \| closed/);
    assert.match(skill, /docs\/research\/content-pipeline/);
    for (const marker of role.markers) assert.match(skill, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

    assert.match(config, new RegExp(`\\$${role.name}`));
    assert.match(config, /separate context/);
  }
});
