import type { BenchmarkReport } from "../../benchmarks/types.js";
import type { DiagnosisItem } from "./types.js";

export function diagnose(
  report: BenchmarkReport,
  categoryThresholds: Record<string, number>,
): DiagnosisItem[] {
  const items: DiagnosisItem[] = [];

  for (const [name, catScore] of Object.entries(report.categories)) {
    const threshold = categoryThresholds[name] ?? 0;
    if (catScore.score < threshold) {
      items.push({
        category: name,
        currentScore: catScore.score,
        threshold,
        gap: threshold - catScore.score,
        details: catScore.details,
      });
    }
  }

  // Sort by gap descending (worst first)
  items.sort((a, b) => b.gap - a.gap);

  return items;
}
