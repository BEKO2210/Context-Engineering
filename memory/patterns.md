# Accumulated Patterns

## Pattern: Benchmark-First Development

When making any change:

1. Run benchmarks before the change to establish baseline
2. Make the change
3. Run benchmarks after to verify no regression
4. Commit only if score >= threshold

## Pattern: Context Layering

Use AGENTS.md for rules that apply to every interaction.
Use docs/ for reference material consulted on-demand.
Use prompts/ for task-specific context.
Use memory/ for accumulated lessons.

## Pattern: Hard Gates

Critical checks (build, typecheck) should be hard gates that cap the total score.
This prevents a project from scoring well on style while failing to compile.

## Pattern: Structured Fix Plans

When the orchestrator identifies gaps, output a structured plan with:

- Category affected
- Priority level (based on gap size)
- Specific description
- Suggested files to inspect/modify

This makes it actionable for both humans and AI agents.
