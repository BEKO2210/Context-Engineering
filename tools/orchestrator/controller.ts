import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import type { BenchmarkReport } from "../../benchmarks/types.js";
import type { OrchestratorState } from "./types.js";
import { transition } from "./state.js";
import { diagnose } from "./diagnose.js";
import { createFixPlan } from "./fixplan.js";

export function measure(state: OrchestratorState): OrchestratorState {
  let nextState = transition(state, "MEASURING");

  try {
    execSync("npx tsx benchmarks/run.ts", {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 120_000,
    });
  } catch {
    // Benchmark may exit non-zero if score is below target; that's OK,
    // we still read the report.
  }

  const reportPath = join(process.cwd(), "reports/latest-score.json");
  let report: BenchmarkReport;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf-8"));
  } catch {
    return {
      ...transition(nextState, "FAILED"),
      history: [
        ...nextState.history,
        { iteration: nextState.iteration, score: 0, phase: "FAILED" },
      ],
    };
  }

  nextState = {
    ...nextState,
    latestReport: report,
    iteration: nextState.iteration + 1,
    history: [
      ...nextState.history,
      {
        iteration: nextState.iteration + 1,
        score: report.total,
        phase: "MEASURING",
      },
    ],
  };

  // If score meets target, we're done
  if (report.total >= nextState.targetScore) {
    return transition(nextState, "DONE");
  }

  // If max iterations reached, we're done
  if (nextState.iteration >= nextState.maxIterations) {
    return transition(nextState, "DONE");
  }

  return transition(nextState, "DIAGNOSING");
}

export function runDiagnosis(
  state: OrchestratorState,
  categoryThresholds: Record<string, number>,
): OrchestratorState {
  if (!state.latestReport) {
    throw new Error("Cannot diagnose without a benchmark report");
  }

  const items = diagnose(state.latestReport, categoryThresholds);

  if (items.length === 0) {
    return transition({ ...state, diagnosis: [] }, "DONE");
  }

  return transition({ ...state, diagnosis: items }, "PLANNING");
}

export function plan(state: OrchestratorState): OrchestratorState {
  if (!state.latestReport) {
    throw new Error("Cannot plan without a benchmark report");
  }

  const fixPlan = createFixPlan(
    state.diagnosis,
    state.iteration,
    state.latestReport.total,
    state.targetScore,
  );

  return transition({ ...state, fixPlan }, "EXECUTING");
}

export function execute(state: OrchestratorState): OrchestratorState {
  if (!state.fixPlan) {
    throw new Error("Cannot execute without a fix plan");
  }

  if (state.dryRun) {
    // In dry-run mode, print the plan and go back to DONE
    console.log("\n=== DRY RUN: Fix Plan ===");
    console.log(JSON.stringify(state.fixPlan, null, 2));
    console.log("=== END DRY RUN ===\n");
    return transition(state, "DONE");
  }

  // In live mode (future), would apply fixes here
  // For now, loop back to MEASURING
  return transition(state, "MEASURING");
}
