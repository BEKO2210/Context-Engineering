import type {
  OrchestratorState,
  OrchestratorPhase,
  OrchestratorConfig,
} from "./types.js";

const VALID_TRANSITIONS: Record<OrchestratorPhase, OrchestratorPhase[]> = {
  IDLE: ["MEASURING"],
  MEASURING: ["DIAGNOSING", "DONE", "FAILED"],
  DIAGNOSING: ["PLANNING", "DONE"],
  PLANNING: ["EXECUTING", "FAILED"],
  EXECUTING: ["MEASURING", "DONE", "FAILED"],
  DONE: [],
  FAILED: [],
};

export function createInitialState(config: OrchestratorConfig): OrchestratorState {
  return {
    phase: "IDLE",
    iteration: 0,
    maxIterations: config.maxIterations,
    targetScore: config.targetScore,
    dryRun: config.dryRun,
    latestReport: null,
    diagnosis: [],
    fixPlan: null,
    history: [],
  };
}

export function transition(
  state: OrchestratorState,
  nextPhase: OrchestratorPhase,
): OrchestratorState {
  const allowed = VALID_TRANSITIONS[state.phase];
  if (!allowed.includes(nextPhase)) {
    throw new Error(
      `Invalid transition: ${state.phase} -> ${nextPhase}. Allowed: ${allowed.join(", ")}`,
    );
  }

  return {
    ...state,
    phase: nextPhase,
  };
}

export function isTerminal(phase: OrchestratorPhase): boolean {
  return phase === "DONE" || phase === "FAILED";
}
