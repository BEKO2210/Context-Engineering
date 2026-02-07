# Feature Request Prompt Template

Use this prompt when asking an AI agent to implement a new feature.

---

## Task: Implement [FEATURE NAME]

### Context

- Read `AGENTS.md` for project rules
- Read `docs/patterns.md` for approved patterns
- Current benchmark score: [RUN `npm run benchmark` FIRST]

### Requirements

1. [Describe the feature clearly]
2. [List acceptance criteria]
3. [Specify any constraints]

### Files to Create/Modify

- [ ] [List expected file changes]

### Quality Checklist

- [ ] TypeScript strict mode passes (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All tests pass (`npm test`)
- [ ] New tests added for new functionality
- [ ] Benchmark score >= threshold (`npm run benchmark`)
- [ ] No new dependencies unless justified
- [ ] No secrets or credentials in code
- [ ] AGENTS.md updated if architecture changed

### Anti-Patterns to Avoid

- Do not add unnecessary dependencies
- Do not skip writing tests
- Do not ignore TypeScript errors with `any`
- Do not hardcode configuration values
