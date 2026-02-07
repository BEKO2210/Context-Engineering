# Benchmark System

## Overview

The benchmark system scores repository health on a 0–100 scale across
multiple categories. It runs deterministically on local filesystem state
and produces structured JSON output.

## Categories and Weights

| Category        | Weight | Runner                                                      |
| --------------- | ------ | ----------------------------------------------------------- |
| Build           | 30     | `benchmarks/runners/build.ts`                               |
| Quality         | 20     | `benchmarks/runners/lint.ts` + `benchmarks/runners/test.ts` |
| Security        | 20     | `benchmarks/runners/deps.ts`                                |
| Performance     | 20     | (bundle size proxy via build)                               |
| Maintainability | 10     | `benchmarks/runners/maintainability.ts`                     |

## Hard Gates

- If **build fails** → total score capped at 40
- If **typecheck fails** → total score capped at 40

## How It Works

1. `benchmarks/run.ts` loads the scorecard and thresholds
2. It executes each runner in sequence
3. Each runner returns a `RunnerResult` with a score (0–100) and details
4. `benchmarks/score.ts` computes the weighted total
5. Results are written to `reports/latest-score.json`
6. A summary line is appended to `reports/history.jsonl`
7. Exit code is non-zero if total score < target threshold

## Adding a Runner

1. Create a new file in `benchmarks/runners/`
2. Export a function implementing the `BenchmarkRunner` type from `benchmarks/types.ts`
3. Register it in `benchmarks/run.ts`
4. Update `benchmarks/scorecard.json` if adding a new category

## Configuration

- **scorecard.json**: Defines categories, weights, and runner mappings
- **thresholds.json**: Defines minimum score targets (total and per-category)

## Output Format

`reports/latest-score.json`:

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "total": 85,
  "categories": {
    "build": { "score": 100, "weight": 30, "weighted": 30 },
    "quality": { "score": 90, "weight": 20, "weighted": 18 },
    "security": { "score": 80, "weight": 20, "weighted": 16 },
    "performance": { "score": 75, "weight": 20, "weighted": 15 },
    "maintainability": { "score": 60, "weight": 10, "weighted": 6 }
  },
  "passed": true
}
```
