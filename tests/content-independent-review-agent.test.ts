import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const skillPath = new URL("../.agents/skills/content-independent-review-agent/SKILL.md", import.meta.url);
const agentConfigPath = new URL("../.agents/skills/content-independent-review-agent/agents/openai.yaml", import.meta.url);

test("independent review agent exposes a separate, read-only release gate", async () => {
  const [skill, agentConfig] = await Promise.all([
    readFile(skillPath, "utf8"),
    readFile(agentConfigPath, "utf8"),
  ]);

  assert.match(skill, /name: content-independent-review-agent/);
  assert.match(skill, /独立审核闸门/);
  assert.ok(skill.includes("review_verdict: PASS | FAIL | BLOCKED"));
  assert.ok(skill.includes("review_decision: pending_review"));
  assert.ok(skill.includes("只读"));
  assert.ok(skill.includes("不得修改 `src/`、`prisma/`、`tests/`"));
  assert.ok(skill.includes("不得把 Agent 的 PASS 视为 owner 批准"));
  assert.ok(skill.includes("不得 commit、push、deploy 或发布"));
  assert.ok(skill.includes("content update agent 的上下文"));
  assert.ok(skill.includes("docs/research/independent-review"));
  assert.ok(skill.includes("逐条"));
  assert.ok(skill.includes("PASS 只有在所有适用检查项均通过且无未决阻断时才允许"));

  assert.match(agentConfig, /display_name: "Content Independent Review Agent"/);
  assert.match(agentConfig, /Use \$content-independent-review-agent/);
});
