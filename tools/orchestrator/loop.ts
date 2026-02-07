import type { OrchestratorState, OrchestratorConfig } from "./types.js";
import { createInitialState, isTerminal } from "./state.js";
import { measure, runDiagnosis, plan, execute } from "./controller.js";

export async function runLoop(
  config: OrchestratorConfig,
  categoryThresholds: Record<string, number>,
): Promise<OrchestratorState> {
  let state = createInitialState(config);

  console.log("Orchestrator starting...");
  console.log(`  Target score: ${config.targetScore}`);
  console.log(`  Max iterations: ${config.maxIterations}`);
  console.log(`  Dry run: ${config.dryRun}`);
  console.log("");

  // Transition from IDLE to first measurement
  while (!isTerminal(state.phase)) {
    switch (state.phase) {
      case "IDLE":
        state = measure(state);
        break;

      case "MEASURING":
        // Should not reach here in normal flow; measure transitions out
        state = measure(state);
        break;

      case "DIAGNOSING":
        state = runDiagnosis(state, categoryThresholds);
        break;

      case "PLANNING":
        state = plan(state);
        break;

      case "EXECUTING":
        state = execute(state);
        break;

      default:
        throw new Error(`Unexpected phase: ${state.phase}`);
    }

    console.log(
      `[Iteration ${state.iteration}] Phase: ${state.phase}, Score: ${state.latestReport?.total ?? "N/A"}`,
    );
  }

  return state;
}
