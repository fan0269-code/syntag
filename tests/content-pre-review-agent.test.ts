import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const skillPath = new URL("../.agents/skills/content-pre-review-agent/SKILL.md", import.meta.url);
const agentConfigPath = new URL("../.agents/skills/content-pre-review-agent/agents/openai.yaml", import.meta.url);

test("content pre-review agent exposes a row-level, human-gated contract", async () => {
  const [skill, agentConfig] = await Promise.all([
    readFile(skillPath, "utf8"),
    readFile(agentConfigPath, "utf8"),
  ]);

  assert.match(skill, /name: content-pre-review-agent/);
  assert.match(skill, /逐条/);
  assert.ok(skill.includes("pre_review_result: PASS | FAIL | BLOCKED"));
  assert.match(skill, /review_decision: pending_review/);
  assert.ok(skill.includes("不得修改 `src/`、`prisma/`、`tests/`"));
  assert.match(skill, /不得 commit、push、deploy 或发布/);
  assert.ok(skill.includes("不得填写或推断 `reviewer identity`"));
  assert.ok(skill.includes("每条内容、主张或关系对应一条审计记录"));
  assert.ok(skill.includes("docs/research/pre-review"));

  assert.match(agentConfig, /display_name: "Content Pre-Review Agent"/);
  assert.match(agentConfig, /Use \$content-pre-review-agent/);
});
