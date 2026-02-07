import type { BenchmarkReport } from "../../benchmarks/types.js";

export type OrchestratorPhase =
  | "IDLE"
  | "MEASURING"
  | "DIAGNOSING"
  | "PLANNING"
  | "EXECUTING"
  | "DONE"
  | "FAILED";

export interface DiagnosisItem {
  category: string;
  currentScore: number;
  threshold: number;
  gap: number;
  details: string;
}

export interface FixAction {
  category: string;
  priority: "high" | "medium" | "low";
  description: string;
  suggestedFiles: string[];
}

export interface FixPlan {
  iteration: number;
  totalScore: number;
  targetScore: number;
  actions: FixAction[];
}

export interface OrchestratorState {
  phase: OrchestratorPhase;
  iteration: number;
  maxIterations: number;
  targetScore: number;
  dryRun: boolean;
  latestReport: BenchmarkReport | null;
  diagnosis: DiagnosisItem[];
  fixPlan: FixPlan | null;
  history: Array<{
    iteration: number;
    score: number;
    phase: OrchestratorPhase;
  }>;
}

export interface OrchestratorConfig {
  maxIterations: number;
  targetScore: number;
  dryRun: boolean;
}
