# Context Engineering Anti-Patterns

## Anti-Pattern 1: Context Dumping

**Problem**: Stuffing everything into AGENTS.md — entire API docs, full schemas,
lengthy examples.

**Why it's bad**: AI context windows are finite. Irrelevant context dilutes
attention on what matters.

**Fix**: Keep AGENTS.md under 200 lines. Use `docs/` for deep reference material
and link to it.

## Anti-Pattern 2: Stale Context

**Problem**: Writing AGENTS.md once and never updating it.

**Why it's bad**: Stale rules cause AI agents to make wrong decisions based
on outdated information.

**Fix**: Treat AGENTS.md like code. Review it in every PR that changes architecture.

## Anti-Pattern 3: Implicit Rules

**Problem**: Having project conventions that exist only in team members' heads.

**Why it's bad**: AI agents cannot read minds. They will violate unwritten rules.

**Fix**: Write every rule down. If an AI agent makes a mistake, add a rule
to prevent it next time.

## Anti-Pattern 4: Manual Quality Checks

**Problem**: Relying on humans to verify code quality, security, performance.

**Why it's bad**: Humans miss things. Checks are inconsistent. They don't scale.

**Fix**: Automate everything via benchmark runners. Gate CI on scores.

## Anti-Pattern 5: Dependency Creep

**Problem**: Adding packages for trivial functionality (left-pad syndrome).

**Why it's bad**: Each dependency adds supply chain risk, update burden, and
potential breakage.

**Fix**: Use the dep scanner to enforce a blocklist and max dependency count.

## Anti-Pattern 6: Score Gaming

**Problem**: Tweaking thresholds down to make the benchmark pass instead of
fixing actual issues.

**Why it's bad**: Defeats the purpose of quality gates.

**Fix**: Document every threshold change in `docs/decisions.md` with justification.
Review threshold changes in PRs.

## Anti-Pattern 7: Over-Engineering the Orchestrator

**Problem**: Building a fully autonomous code-editing agent on day one.

**Why it's bad**: The complexity is enormous and the failure modes are dangerous.

**Fix**: Start with dry-run mode. Output fix plans as structured data. Let humans
review before execution. Graduate to automation incrementally.
