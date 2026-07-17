import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const deploymentScriptUrl = new URL("../ops/deploy-production.sh", import.meta.url);
const rollbackScriptUrl = new URL("../ops/rollback-production.sh", import.meta.url);
const deploymentWorkflowUrl = new URL("../.github/workflows/deploy-production.yml", import.meta.url);

type WorkflowStep = {
  uses: string | null;
  runCommands: string[];
};

function indentation(line: string) {
  return line.length - line.trimStart().length;
}

function extractStepRunCommands(stepLines: string[], stepIndentation: number) {
  const runLineIndex = stepLines.findIndex((line, index) => {
    const isFirstStepProperty = index === 0 && /^-\s+run:\s*/.test(line.trim());
    const isNestedStepProperty = index > 0
      && indentation(line) === stepIndentation + 2
      && /^run:\s*/.test(line.trim());

    return isFirstStepProperty || isNestedStepProperty;
  });

  if (runLineIndex === -1) {
    return [];
  }

  const runDeclaration = stepLines[runLineIndex].trim().replace(/^-\s+/, "");
  const inlineRunCommand = /^run:\s*(.+)$/.exec(runDeclaration);
  if (inlineRunCommand !== null && !/^[|>][-+]?$/.test(inlineRunCommand[1])) {
    return [inlineRunCommand[1]];
  }

  const runIndentation = indentation(stepLines[runLineIndex]);
  const nextPropertyOffset = stepLines
    .slice(runLineIndex + 1)
    .findIndex((line) => line.trim().length > 0 && indentation(line) <= runIndentation);
  const runBlockEnd = nextPropertyOffset === -1
    ? stepLines.length
    : runLineIndex + nextPropertyOffset + 1;

  return stepLines
    .slice(runLineIndex + 1, runBlockEnd)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

function extractDeploySteps(workflow: string): WorkflowStep[] {
  const workflowLines = workflow.split("\n");
  const jobsIndex = workflowLines.findIndex((line) => /^jobs:\s*$/.test(line.trim()));

  if (jobsIndex === -1) {
    return [];
  }

  const jobsIndentation = indentation(workflowLines[jobsIndex]);
  const deployJobIndex = workflowLines.findIndex((line, index) =>
    index > jobsIndex
    && indentation(line) === jobsIndentation + 2
    && /^deploy:\s*$/.test(line.trim()),
  );

  if (deployJobIndex === -1) {
    return [];
  }

  const deployJobIndentation = indentation(workflowLines[deployJobIndex]);
  const nextJobOffset = workflowLines
    .slice(deployJobIndex + 1)
    .findIndex((line) => line.trim().length > 0 && indentation(line) === deployJobIndentation);
  const deployJobEnd = nextJobOffset === -1
    ? workflowLines.length
    : deployJobIndex + nextJobOffset + 1;
  const stepsIndex = workflowLines.findIndex((line, index) =>
    index > deployJobIndex
    && index < deployJobEnd
    && indentation(line) === deployJobIndentation + 2
    && /^steps:\s*$/.test(line.trim()),
  );

  if (stepsIndex === -1) {
    return [];
  }

  const stepsIndentation = indentation(workflowLines[stepsIndex]);
  const nextStepsPropertyOffset = workflowLines
    .slice(stepsIndex + 1, deployJobEnd)
    .findIndex((line) => line.trim().length > 0 && indentation(line) <= stepsIndentation);
  const stepsEnd = nextStepsPropertyOffset === -1
    ? deployJobEnd
    : stepsIndex + nextStepsPropertyOffset + 1;
  const stepIndexes = workflowLines
    .map((line, index) => ({ line, index }))
    .filter(({ line, index }) =>
      index > stepsIndex
      && index < stepsEnd
      && indentation(line) === stepsIndentation + 2
      && /^-\s+/.test(line.trim()),
    )
    .map(({ index }) => index);

  return stepIndexes.map((stepIndex, index) => {
    const stepEnd = stepIndexes[index + 1] ?? stepsEnd;
    const stepLines = workflowLines.slice(stepIndex, stepEnd);
    const stepIndentation = indentation(workflowLines[stepIndex]);
    const usesLine = stepLines.find((line, lineIndex) => {
      const isFirstStepProperty = lineIndex === 0 && /^-\s+uses:\s*/.test(line.trim());
      const isNestedStepProperty = lineIndex > 0
        && indentation(line) === stepIndentation + 2
        && /^uses:\s*/.test(line.trim());

      return isFirstStepProperty || isNestedStepProperty;
    });
    const usesMatch = usesLine === undefined
      ? null
      : /^(?:-\s+)?uses:\s*(.+)$/.exec(usesLine.trim());

    return {
      uses: usesMatch?.[1] ?? null,
      runCommands: extractStepRunCommands(stepLines, stepIndentation),
    };
  });
}

function installsTrackedDeploymentScript(step: WorkflowStep) {
  const transferCommandIndex = step.runCommands.findIndex((command) =>
    /^scp\s+(?:[^\s]+\s+)*ops\/deploy-production\.sh\s+(?:"\$DEPLOY_USER@\$DEPLOY_HOST:\/tmp\/syrtag-deploy-production\.sh"|\$DEPLOY_USER@\$DEPLOY_HOST:\/tmp\/syrtag-deploy-production\.sh)\s*$/.test(command),
  );
  const remoteInstallCommandIndex = step.runCommands.findIndex((command) =>
    /^ssh\s+(?:[^\s]+\s+)*"\$DEPLOY_USER@\$DEPLOY_HOST"\s+["']\s*sudo\s+install\s+-m\s+755\s+\/tmp\/syrtag-deploy-production\.sh\s+\/var\/www\/syrtag\.com\/deploy-production\.sh\s*["']\s*$/.test(command),
  );

  return transferCommandIndex !== -1
    && remoteInstallCommandIndex !== -1
    && transferCommandIndex < remoteInstallCommandIndex;
}

test("production deployment migrates, seeds, then builds", async () => {
  const deploymentScript = await readFile(deploymentScriptUrl, "utf8");
  const commands = deploymentScript
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  const migrationIndex = commands.indexOf("npx prisma migrate deploy");
  const seedIndex = commands.indexOf("npm run db:seed");
  const buildIndex = commands.indexOf("npm run build");

  assert.notEqual(migrationIndex, -1, "deployment must apply Prisma migrations");
  assert.notEqual(seedIndex, -1, "deployment must seed published content");
  assert.notEqual(buildIndex, -1, "deployment must build after data preparation");
  assert.ok(
    migrationIndex < seedIndex && seedIndex < buildIndex,
    "deployment must run migrations, then seed content, then build",
  );
});

test("production deployment workflow uses a tracked deployment script without sed", async () => {
  const deploymentWorkflow = await readFile(deploymentWorkflowUrl, "utf8");
  const workflowWithoutLineContinuations = deploymentWorkflow.replace(/\\[ \t]*\r?\n[ \t]*/g, " ");
  const deploySteps = extractDeploySteps(deploymentWorkflow);
  const checkoutStepIndex = deploySteps.findIndex((step) => step.uses === "actions/checkout@v4");
  const scriptInstallationStepIndex = deploySteps.findIndex(installsTrackedDeploymentScript);
  const deploymentStepIndex = deploySteps.findIndex((step) =>
    step.runCommands.some((command) =>
      /^ssh\s+(?:[^\s]+\s+)*"\$DEPLOY_USER@\$DEPLOY_HOST"\s+["']\s*sudo\s+\/var\/www\/syrtag\.com\/deploy-production\.sh\s*["']\s*$/.test(command),
    ),
  );

  assert.deepEqual(
    {
      checksOutRepositoryInDeployJob: checkoutStepIndex !== -1,
      checkoutPrecedesScriptTransfer: checkoutStepIndex !== -1
        && scriptInstallationStepIndex !== -1
        && checkoutStepIndex < scriptInstallationStepIndex,
      transfersAndInstallsVersionedDeploymentScript: scriptInstallationStepIndex !== -1,
      executesInstalledDeploymentScriptOverSsh: deploymentStepIndex !== -1,
      installsScriptBeforeDeployment: scriptInstallationStepIndex !== -1
        && deploymentStepIndex !== -1
        && scriptInstallationStepIndex < deploymentStepIndex,
      usesSeparateInstallAndDeploySteps: scriptInstallationStepIndex !== -1
        && deploymentStepIndex !== -1
        && scriptInstallationStepIndex !== deploymentStepIndex,
      doesNotPatchWorkflowWithSed: !/\bsed\b[^\n]*(?:\s-i\b|\s--in-place\b)/.test(workflowWithoutLineContinuations),
    },
    {
      checksOutRepositoryInDeployJob: true,
      checkoutPrecedesScriptTransfer: true,
      transfersAndInstallsVersionedDeploymentScript: true,
      executesInstalledDeploymentScriptOverSsh: true,
      installsScriptBeforeDeployment: true,
      usesSeparateInstallAndDeploySteps: true,
      doesNotPatchWorkflowWithSed: true,
    },
  );
});

test("production deployment preserves a rollback snapshot and rolls back failed health checks", async () => {
  const deploymentScript = await readFile(deploymentScriptUrl, "utf8");
  const rollbackScript = await readFile(rollbackScriptUrl, "utf8");

  assert.match(deploymentScript, /rollback-[^\n]*\.tar\.gz/);
  assert.match(deploymentScript, /rollback-production\.sh/);
  assert.match(deploymentScript, /health check failed/i);
  assert.match(rollbackScript, /flock\s+-n/);
  assert.match(rollbackScript, /systemctl stop syrtag/);
  assert.match(rollbackScript, /git -C "\$\{APP_DIR\}" reset --hard "\$\{previous_commit\}"/);
  assert.match(rollbackScript, /npm ci/);
  assert.match(rollbackScript, /systemctl restart syrtag/);
  assert.match(rollbackScript, /curl\s+--fail/);
});

test("production workflow installs rollback script and probes the public site three times", async () => {
  const deploymentWorkflow = await readFile(deploymentWorkflowUrl, "utf8");

  assert.match(deploymentWorkflow, /ops\/rollback-production\.sh/);
  assert.match(deploymentWorkflow, /https:\/\/syrtag\.com/);
  assert.match(deploymentWorkflow, /for attempt in \{1\.\.3\}/);
  assert.match(deploymentWorkflow, /rollback-production\.sh/);
  assert.match(deploymentWorkflow, /exit 1/);
});
