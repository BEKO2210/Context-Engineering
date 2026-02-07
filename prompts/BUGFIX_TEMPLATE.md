# Bugfix Prompt Template

Use this prompt when asking an AI agent to fix a bug.

---

## Task: Fix [BUG DESCRIPTION]

### Observed Behavior

[Describe what is happening]

### Expected Behavior

[Describe what should happen]

### Reproduction Steps

1. [Step-by-step reproduction]

### Context

- Read `AGENTS.md` for project rules
- Check `memory/lessons.json` for similar past issues
- Current benchmark score: [RUN `npm run benchmark` FIRST]

### Constraints

- Fix must not break existing tests
- Fix must not lower benchmark score
- Prefer minimal changes — fix the root cause, not symptoms

### Quality Checklist

- [ ] Root cause identified and documented
- [ ] Fix applied with minimal code changes
- [ ] Regression test added
- [ ] All existing tests still pass (`npm test`)
- [ ] TypeScript strict mode passes (`npm run typecheck`)
- [ ] Benchmark score >= threshold (`npm run benchmark`)
- [ ] `memory/lessons.json` updated with lesson learned
