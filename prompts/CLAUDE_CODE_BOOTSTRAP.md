# Claude Code Bootstrap Prompt

Use this prompt when starting a new Claude Code session in this repository.

---

You are working in a Context Engineering template repository. Before doing anything:

1. **Read AGENTS.md** at the repository root. It contains hard rules, decision
   rules, and the project structure map.

2. **Run the benchmarks** to understand current repo health:

   ```bash
   npm run benchmark
   ```

3. **Check the latest score**:

   ```bash
   cat reports/latest-score.json
   ```

4. **Understand the quality gates**:
   - Build and typecheck must pass (hard gate)
   - Total score must meet threshold in `benchmarks/thresholds.json`
   - No secrets in repo
   - Dependencies must be within limits

5. **Before making changes**, check:
   - `docs/decisions.md` for architectural context
   - `docs/patterns.md` for approved patterns
   - `docs/anti-patterns.md` for things to avoid
   - `memory/lessons.json` for accumulated project lessons

6. **After making changes**, always run:

   ```bash
   npm run typecheck && npm run lint && npm test && npm run benchmark
   ```

7. **If benchmark score dropped**, run the orchestrator for diagnosis:
   ```bash
   npm run orchestrator:dry
   ```
