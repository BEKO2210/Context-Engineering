import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Thresholds } from "../../benchmarks/types.js";
import type { OrchestratorConfig } from "./types.js";
import { runLoop } from "./loop.js";

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const maxIterations = 5;

  const thresholds: Thresholds = JSON.parse(
    readFileSync(join(process.cwd(), "benchmarks/thresholds.json"), "utf-8"),
  );

  const config: OrchestratorConfig = {
    maxIterations,
    targetScore: thresholds.totalMinimum,
    dryRun,
  };

  const finalState = await runLoop(config, thresholds.categories);

  console.log("\n========================================");
  console.log("Orchestrator finished");
  console.log(`  Final phase: ${finalState.phase}`);
  console.log(`  Iterations: ${finalState.iteration}`);
  console.log(`  Final score: ${finalState.latestReport?.total ?? "N/A"}`);
  console.log(`  Target: ${finalState.targetScore}`);
  console.log("========================================");

  if (finalState.history.length > 0) {
    console.log("\nScore history:");
    for (const entry of finalState.history) {
      console.log(`  Iteration ${entry.iteration}: ${entry.score} (${entry.phase})`);
    }
  }

  if (finalState.latestReport && finalState.latestReport.total < finalState.targetScore) {
    console.log(
      `\nTarget not met: ${finalState.latestReport.total} < ${finalState.targetScore}`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Orchestrator failed:", err);
  process.exit(1);
});
