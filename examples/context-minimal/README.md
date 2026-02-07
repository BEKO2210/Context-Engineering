# Minimal Context Engineering Example

This is a minimal example showing how to structure a project with context engineering
patterns. It demonstrates:

1. **AGENTS.md** — Project-level persistent context
2. **Source code** — A simple TypeScript module
3. **Tests** — Vitest unit tests

## Structure

```
context-minimal/
├── AGENTS.md           # Project context for AI agents
├── README.md           # This file
├── src/
│   └── example.ts      # Simple module demonstrating patterns
└── tests/
    └── example.test.ts # Tests for the module
```

## Usage

This example is part of the parent template repository. Run tests from the repo root:

```bash
npm test
```
