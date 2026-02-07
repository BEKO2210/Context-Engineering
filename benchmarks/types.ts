export interface RunnerResult {
  name: string;
  score: number; // 0–100
  passed: boolean;
  details: string;
  errors: string[];
}

export interface CategoryConfig {
  name: string;
  weight: number;
  runners: string[];
}

export interface Scorecard {
  categories: CategoryConfig[];
}

export interface Thresholds {
  totalMinimum: number;
  categories: Record<string, number>;
  performance: {
    maxBundleSizeBytes: number;
  };
  dependencies: {
    maxCount: number;
    blocklist: string[];
  };
  maintainability: {
    maxAvgFileLines: number;
    maxDuplicateLines: number;
  };
}

export interface CategoryScore {
  score: number;
  weight: number;
  weighted: number;
  details: string;
  passed: boolean;
}

export interface BenchmarkReport {
  timestamp: string;
  total: number;
  categories: Record<string, CategoryScore>;
  passed: boolean;
  hardGateFailed: boolean;
}

export type BenchmarkRunner = () => Promise<RunnerResult>;
