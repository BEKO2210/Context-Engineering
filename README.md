# Context Engineering + Closed-Loop Agent Benchmarks

A production-grade template repository for AI-assisted development workflows with
built-in quality gates, benchmark-driven feedback loops, and structured context
engineering patterns.

**Created by Belkis Aslani**

## What Is This

This repo provides:

- **Context Engineering templates** — AGENTS.md, structured docs, copy-paste prompts
  that give AI coding agents the context they need to work effectively
- **Closed-loop benchmark system** — Automated scoring (0–100) across build, quality,
  security, performance, and maintainability categories
- **Orchestrator framework** — A state-machine-based controller that reads benchmark
  scores, diagnoses gaps, and outputs structured fix plans
- **CI pipeline** — GitHub Actions workflow that gates merges on benchmark scores

## Quickstart

```bash
# Install dependencies
npm install

# Run typecheck
npm run typecheck

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm test

# Build
npm run build

# Run benchmarks (outputs score to reports/)
npm run benchmark

# Run orchestrator dry-run (diagnoses gaps, prints fix plan)
npm run orchestrator:dry
```

## Repository Structure

```
├── AGENTS.md                    # Project-wide persistent context for AI agents
├── README.md                    # This file
├── package.json                 # Node.js project configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.js             # ESLint flat config
├── .prettierrc                  # Prettier configuration
├── .editorconfig                # Editor configuration
├── docs/                        # Documentation
│   ├── index.md                 # Documentation index
│   ├── decisions.md             # Architecture Decision Records
│   ├── patterns.md              # Context engineering patterns
│   ├── anti-patterns.md         # Known pitfalls
│   ├── benchmarks.md            # Benchmark system docs
│   └── orchestrator.md          # Orchestrator design docs
├── prompts/                     # Copy-paste prompt templates
│   ├── CLAUDE_CODE_BOOTSTRAP.md # Session bootstrap prompt
│   ├── FEATURE_REQUEST_TEMPLATE.md
│   ├── BUGFIX_TEMPLATE.md
│   └── REFACTOR_TEMPLATE.md
├── src/                         # Source code
│   └── index.ts                 # Main entry point
├── benchmarks/                  # Benchmark system
│   ├── scorecard.json           # Category weights
│   ├── thresholds.json          # Minimum score targets
│   ├── types.ts                 # Type definitions
│   ├── score.ts                 # Score computation
│   ├── run.ts                   # Main benchmark runner
│   └── runners/                 # Individual runners
│       ├── build.ts
│       ├── typecheck.ts
│       ├── lint.ts
│       ├── test.ts
│       ├── deps.ts
│       └── maintainability.ts
├── tools/orchestrator/          # Closed-loop controller
│   ├── types.ts
│   ├── state.ts                 # State machine
│   ├── controller.ts            # Controller logic
│   ├── loop.ts                  # Main loop
│   ├── diagnose.ts              # Gap analysis
│   ├── fixplan.ts               # Fix plan generation
│   └── run.ts                   # CLI entry point
├── examples/context-minimal/    # Minimal example project
│   ├── AGENTS.md
│   ├── README.md
│   ├── src/example.ts
│   └── tests/example.test.ts
├── reports/                     # Generated reports (gitignored)
├── memory/                      # Accumulated lessons
│   ├── lessons.json
│   └── patterns.md
└── .github/workflows/ci.yml    # CI pipeline
```

## How AGENTS.md Works

`AGENTS.md` is the project-wide persistent context file. AI coding agents (Claude Code,
Cursor, etc.) read this file first to understand:

- **Identity**: What this project is
- **Hard rules**: Non-negotiable constraints
- **Decision rules**: How to handle common decisions
- **Where to find things**: Map of the codebase
- **Anti-patterns**: Things to avoid

Keep it under 200 lines and update it with every architectural change.

## How Prompts Work

The `prompts/` directory contains copy-paste prompt templates for common tasks:

| Prompt                        | Use Case                           |
| ----------------------------- | ---------------------------------- |
| `CLAUDE_CODE_BOOTSTRAP.md`    | Starting a new Claude Code session |
| `FEATURE_REQUEST_TEMPLATE.md` | Implementing a new feature         |
| `BUGFIX_TEMPLATE.md`          | Fixing a bug                       |
| `REFACTOR_TEMPLATE.md`        | Refactoring code                   |

Copy the template, fill in the blanks, and paste it to your AI coding agent.

## How Benchmarks Work

The benchmark system scores repository health on a **0–100 scale**:

| Category        | Weight | What It Checks                      |
| --------------- | ------ | ----------------------------------- |
| Build           | 30     | TypeScript compilation, bundle size |
| Quality         | 20     | Lint errors, test results           |
| Security        | 20     | Secret scanning, dependency policy  |
| Performance     | 20     | Bundle size proxy                   |
| Maintainability | 10     | File sizes, code duplication        |

**Hard gates**: If build or typecheck fails, total score is capped at 40.

Output is written to:

- `reports/latest-score.json` — Latest run (overwritten each time)
- `reports/history.jsonl` — Append-only history (one JSON line per run)

## How to Extend Runners

1. Create a new file in `benchmarks/runners/` implementing:
   ```typescript
   import type { RunnerResult } from "../types.js";
   export async function run(): Promise<RunnerResult> {
     return { name: "myRunner", score: 100, passed: true, details: "OK", errors: [] };
   }
   ```
2. Register it in `benchmarks/run.ts` by importing and adding to the `RUNNERS` map
3. Add it to a category in `benchmarks/scorecard.json`

## How the Orchestrator Works

The orchestrator implements a closed-loop control system:

```
Measure → Diagnose → Plan → Execute → Repeat
```

In **dry-run mode** (`npm run orchestrator:dry`), it:

1. Runs benchmarks to measure current score
2. Identifies categories below their thresholds
3. Generates a structured fix plan with priorities
4. Prints the plan to stdout (no files modified)

This provides the framework for future autonomous agent workflows while keeping
humans in the loop during the template stage.

## License

MIT — Belkis Aslani
