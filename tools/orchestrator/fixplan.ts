import type { DiagnosisItem, FixPlan, FixAction } from "./types.js";

const CATEGORY_SUGGESTIONS: Record<
  string,
  { description: string; suggestedFiles: string[] }
> = {
  build: {
    description: "Fix TypeScript compilation errors",
    suggestedFiles: ["tsconfig.json", "src/"],
  },
  quality: {
    description: "Fix lint errors and failing tests",
    suggestedFiles: ["eslint.config.js", "src/", "tests/"],
  },
  security: {
    description: "Remove secrets and blocked dependencies",
    suggestedFiles: ["package.json", ".env"],
  },
  performance: {
    description: "Reduce bundle size and optimize build output",
    suggestedFiles: ["tsconfig.json", "src/"],
  },
  maintainability: {
    description: "Reduce file sizes and eliminate code duplication",
    suggestedFiles: ["src/", "tools/"],
  },
};

export function createFixPlan(
  diagnosis: DiagnosisItem[],
  iteration: number,
  totalScore: number,
  targetScore: number,
): FixPlan {
  const actions: FixAction[] = diagnosis.map((item) => {
    const suggestion = CATEGORY_SUGGESTIONS[item.category] ?? {
      description: `Improve ${item.category} score`,
      suggestedFiles: [],
    };

    const priority: FixAction["priority"] =
      item.gap > 30 ? "high" : item.gap > 15 ? "medium" : "low";

    return {
      category: item.category,
      priority,
      description: `${suggestion.description} (current: ${item.currentScore}, target: ${item.threshold}, gap: ${item.gap})`,
      suggestedFiles: suggestion.suggestedFiles,
    };
  });

  return {
    iteration,
    totalScore,
    targetScore,
    actions,
  };
}
