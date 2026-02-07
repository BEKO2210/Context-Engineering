# Refactor Prompt Template

Use this prompt when asking an AI agent to refactor code.

---

## Task: Refactor [TARGET DESCRIPTION]

### Goal

[Describe the refactoring objective — clarity, performance, modularity, etc.]

### Scope

- Files to refactor: [list files]
- Files NOT to touch: [list files that should remain unchanged]

### Context

- Read `AGENTS.md` for project rules
- Read `docs/decisions.md` for architectural context
- Read `docs/patterns.md` for approved patterns
- Current benchmark score: [RUN `npm run benchmark` FIRST]

### Constraints

- Behavior must remain identical (no functional changes)
- All existing tests must continue to pass without modification
- Benchmark score must not decrease
- No new dependencies

### Quality Checklist

- [ ] Refactoring is purely structural (no behavior changes)
- [ ] All tests pass unchanged (`npm test`)
- [ ] TypeScript strict mode passes (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Benchmark score >= previous score (`npm run benchmark`)
- [ ] Maintainability score improved or unchanged
- [ ] No circular dependencies introduced
