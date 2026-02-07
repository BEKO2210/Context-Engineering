# AGENTS.md — Project-Wide Persistent Context

## Identity

This is the **Context Engineering + Closed-Loop Agent Benchmarks** template repository,
created by Belkis Aslani. It provides a production-grade scaffold for AI-assisted
development workflows with built-in quality gates and benchmark-driven feedback loops.

## Hard Rules

1. **Benchmark-first policy**: Every change must pass `npm run benchmark` before merge.
   Score must meet or exceed the target in `benchmarks/thresholds.json`.
2. **No secrets in repo**: The CI pipeline scans for leaked keys/tokens. Any match fails
   the build immediately.
3. **ESM only**: All TypeScript uses ES modules. No `require()`, no CommonJS.
4. **Strict TypeScript**: `strict: true` in tsconfig. No `any` without justification.
5. **Minimal dependencies**: Every new dependency must be justified. The dep scanner
   enforces a maximum count and a blocklist.
6. **Deterministic benchmarks**: All benchmark runners must produce identical scores
   given identical input. No network calls, no randomness.

## Decision Rules

- **Adding a runner**: Create a new file in `benchmarks/runners/`, implement the
  `BenchmarkRunner` interface from `benchmarks/types.ts`, register it in
  `benchmarks/run.ts`.
- **Changing weights**: Edit `benchmarks/scorecard.json`. Weights must sum to 100.
- **Changing thresholds**: Edit `benchmarks/thresholds.json`. Document the reason
  in `docs/decisions.md`.
- **Adding orchestrator steps**: Extend `tools/orchestrator/controller.ts` state
  machine. Document in `docs/orchestrator.md`.

## Where to Find Things

| What               | Where                        |
| ------------------ | ---------------------------- |
| Project docs       | `docs/`                      |
| Copy-paste prompts | `prompts/`                   |
| Benchmark runners  | `benchmarks/runners/`        |
| Benchmark config   | `benchmarks/scorecard.json`  |
| Score thresholds   | `benchmarks/thresholds.json` |
| Orchestrator       | `tools/orchestrator/`        |
| Reports            | `reports/`                   |
| Example project    | `examples/context-minimal/`  |
| Lessons learned    | `memory/lessons.json`        |
| Patterns catalog   | `memory/patterns.md`         |

## Anti-Patterns

- **Skipping benchmarks**: Never merge without a passing benchmark run.
- **Manual scoring**: Always use the automated runner; manual overrides mask regressions.
- **Fat dependencies**: Do not add large UI kits or utility libraries (lodash, etc.)
  when a few lines of code suffice.
- **Ignoring thresholds**: If a threshold is too strict, discuss and lower it explicitly
  rather than disabling the check.
- **Context rot**: Keep AGENTS.md and docs/ current. Stale context is worse than no
  context.

## Benchmark-First Policy

Every PR must include:

1. `npm run benchmark` output showing score >= target
2. If score dropped, an explanation in the PR description
3. Updated `reports/latest-score.json` committed alongside changes
