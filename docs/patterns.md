# Context Engineering Patterns

## Pattern 1: AGENTS.md as Single Source of Truth

Place an `AGENTS.md` file at the repository root. This file is the first thing
any AI agent reads when entering your codebase. Keep it:

- **Compact**: Under 200 lines
- **High-signal**: Only rules that affect every interaction
- **Current**: Update it with every architectural change

## Pattern 2: Layered Context

```
AGENTS.md          → Project-wide rules (always loaded)
docs/              → Deep reference (loaded on demand)
prompts/           → Task-specific context (copy-paste)
memory/            → Accumulated lessons (append-only)
```

Each layer serves a different frequency of access. AGENTS.md is always present;
docs are consulted for deep dives; prompts are used per-task; memory grows over time.

## Pattern 3: Benchmark-Driven Quality Gates

Instead of trusting vibes, define measurable quality thresholds:

1. Define categories (build, lint, tests, security, performance, maintainability)
2. Assign weights that sum to 100
3. Set minimum score thresholds
4. Gate CI on the total score

This creates a tight feedback loop: change code → run benchmark → see score → fix.

## Pattern 4: Copy-Paste Prompts

Store reusable prompt templates in `prompts/`. Each template should:

- State the task type clearly (feature, bugfix, refactor)
- Reference relevant files and patterns
- Include constraints and acceptance criteria
- Be self-contained (no external dependencies)

## Pattern 5: Decision Records

Document every significant architectural choice in `docs/decisions.md`:

- What was decided
- Why it was decided
- What alternatives were considered
- What the consequences are

This prevents re-litigating settled decisions and gives AI agents historical context.

## Pattern 6: Closed-Loop Orchestration

The orchestrator pattern:

1. **Measure**: Run benchmarks, get a score
2. **Diagnose**: Identify which categories are below threshold
3. **Plan**: Generate a structured fix plan
4. **Execute**: Apply fixes (or recommend them in dry-run mode)
5. **Repeat**: Loop until score meets target or max iterations reached

This is the foundation for autonomous agent workflows.

## Pattern 7: Minimal Dependencies

Every dependency is a liability:

- Increases attack surface
- Adds maintenance burden
- Risks supply chain compromise

Prefer writing 10 lines of code over adding a package. The dep scanner
enforces this policy automatically.
