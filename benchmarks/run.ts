import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { computeScore } from "./score.js";
import type { RunnerResult, Scorecard, Thresholds } from "./types.js";

import { run as runBuild } from "./runners/build.js";
import { run as runTypecheck } from "./runners/typecheck.js";
import { run as runLint } from "./runners/lint.js";
import { run as runTest } from "./runners/test.js";
import { run as runDeps } from "./runners/deps.js";
import { run as runMaintainability } from "./runners/maintainability.js";

const RUNNERS: Record<string, () => Promise<RunnerResult>> = {
  build: runBuild,
  typecheck: runTypecheck,
  lint: runLint,
  test: runTest,
  deps: runDeps,
  maintainability: runMaintainability,
};

async function main() {
  const root = process.cwd();

  const scorecard: Scorecard = JSON.parse(
    readFileSync(join(root, "benchmarks/scorecard.json"), "utf-8"),
  );

  const thresholds: Thresholds = JSON.parse(
    readFileSync(join(root, "benchmarks/thresholds.json"), "utf-8"),
  );

  // Collect unique runner names
  const runnerNames = new Set<string>();
  for (const cat of scorecard.categories) {
    for (const runner of cat.runners) {
      runnerNames.add(runner);
    }
  }

  // Execute runners
  const results = new Map<string, RunnerResult>();
  for (const name of runnerNames) {
    const runner = RUNNERS[name];
    if (!runner) {
      console.error(`Unknown runner: ${name}`);
      process.exit(1);
    }
    console.log(`Running: ${name}...`);
    const result = await runner();
    results.set(name, result);
    const icon = result.passed ? "PASS" : "FAIL";
    console.log(`  [${icon}] ${name}: ${result.score}/100 — ${result.details}`);
    if (result.errors.length > 0) {
      for (const err of result.errors.slice(0, 5)) {
        console.log(`    - ${err}`);
      }
    }
  }

  // Compute score
  const report = computeScore(scorecard.categories, results, thresholds.totalMinimum);

  // Output
  console.log("\n========================================");
  console.log(`TOTAL SCORE: ${report.total}/100`);
  console.log(`STATUS: ${report.passed ? "PASSED" : "FAILED"}`);
  if (report.hardGateFailed) {
    console.log("HARD GATE: Build or typecheck failed — score capped at 40");
  }
  console.log("========================================");
  console.log("\nCategory breakdown:");
  for (const [name, cat] of Object.entries(report.categories)) {
    console.log(
      `  ${name}: ${cat.score}/100 (weight: ${cat.weight}, weighted: ${cat.weighted})`,
    );
  }

  // Write reports
  mkdirSync(join(root, "reports"), { recursive: true });
  writeFileSync(
    join(root, "reports/latest-score.json"),
    JSON.stringify(report, null, 2) + "\n",
  );

  const historyLine = JSON.stringify({
    timestamp: report.timestamp,
    total: report.total,
    passed: report.passed,
  });
  appendFileSync(join(root, "reports/history.jsonl"), historyLine + "\n");

  console.log("\nReports written:");
  console.log("  - reports/latest-score.json");
  console.log("  - reports/history.jsonl (appended)");

  if (!report.passed) {
    console.log(
      `\nBenchmark FAILED: score ${report.total} < target ${thresholds.totalMinimum}`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Benchmark runner failed:", err);
  process.exit(1);
});
