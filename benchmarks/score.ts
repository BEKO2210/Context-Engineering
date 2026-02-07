import type {
  BenchmarkReport,
  CategoryConfig,
  CategoryScore,
  RunnerResult,
} from "./types.js";

export function computeScore(
  categories: CategoryConfig[],
  results: Map<string, RunnerResult>,
  totalMinimum: number,
): BenchmarkReport {
  const categoryScores: Record<string, CategoryScore> = {};

  // Check hard gates (build + typecheck)
  const buildResult = results.get("build");
  const typecheckResult = results.get("typecheck");
  const hardGateFailed =
    (buildResult !== undefined && !buildResult.passed) ||
    (typecheckResult !== undefined && !typecheckResult.passed);

  for (const category of categories) {
    const runnerResults = category.runners
      .map((r) => results.get(r))
      .filter((r): r is RunnerResult => r !== undefined);

    const avgScore =
      runnerResults.length > 0
        ? Math.round(
            runnerResults.reduce((sum, r) => sum + r.score, 0) / runnerResults.length,
          )
        : 0;

    const weighted = Math.round((avgScore * category.weight) / 100);
    const allPassed = runnerResults.every((r) => r.passed);

    categoryScores[category.name] = {
      score: avgScore,
      weight: category.weight,
      weighted,
      details: runnerResults.map((r) => r.details).join("; "),
      passed: allPassed,
    };
  }

  let total = Object.values(categoryScores).reduce((sum, c) => sum + c.weighted, 0);

  // Hard gate cap
  if (hardGateFailed) {
    total = Math.min(total, 40);
  }

  return {
    timestamp: new Date().toISOString(),
    total,
    categories: categoryScores,
    passed: total >= totalMinimum,
    hardGateFailed,
  };
}
