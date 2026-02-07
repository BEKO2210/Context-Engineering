# Closed-Loop Orchestrator

## Overview

The orchestrator implements a closed-loop control system for repository health.
It reads benchmark scores, diagnoses problems, generates fix plans, and
(in future versions) applies fixes automatically. The current implementation
supports **dry-run mode only**.

## Architecture

```
┌──────────┐    ┌───────────┐    ┌──────────┐    ┌──────────┐
│ Measure  │───▶│ Diagnose  │───▶│  Plan    │───▶│ Execute  │
│(benchmark│    │(find gaps)│    │(fix plan)│    │(dry-run) │
└──────────┘    └───────────┘    └──────────┘    └──────────┘
      ▲                                                │
      └────────────────────────────────────────────────┘
                        Loop until target met
```

## State Machine

The orchestrator maintains state across iterations:

- **IDLE**: Initial state, no benchmark data loaded
- **MEASURING**: Running benchmarks
- **DIAGNOSING**: Analyzing results to find gaps
- **PLANNING**: Generating fix plan
- **EXECUTING**: Applying fixes (dry-run: printing plan)
- **DONE**: Target score met or max iterations reached
- **FAILED**: Unrecoverable error

## Files

| File                               | Purpose                      |
| ---------------------------------- | ---------------------------- |
| `tools/orchestrator/types.ts`      | Type definitions             |
| `tools/orchestrator/state.ts`      | State machine implementation |
| `tools/orchestrator/controller.ts` | Main controller logic        |
| `tools/orchestrator/loop.ts`       | Iteration loop               |
| `tools/orchestrator/diagnose.ts`   | Gap analysis                 |
| `tools/orchestrator/fixplan.ts`    | Fix plan generation          |
| `tools/orchestrator/run.ts`        | CLI entry point              |

## Dry-Run Mode

In dry-run mode (`--dry-run` flag), the orchestrator:

1. Runs benchmarks
2. Identifies categories below threshold
3. Prints a structured fix plan to stdout
4. Does NOT modify any files

## Extending

To add orchestrator capabilities:

1. Define new states in `tools/orchestrator/types.ts`
2. Add transitions in `tools/orchestrator/state.ts`
3. Implement logic in `tools/orchestrator/controller.ts`
4. Document changes here
