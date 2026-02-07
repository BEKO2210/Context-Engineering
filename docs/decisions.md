# Architecture Decision Records

## ADR-001: ESM-Only TypeScript

**Status**: Accepted
**Date**: 2024-01-01
**Author**: Belkis Aslani

**Context**: The project needs a consistent module system. ESM is the standard
going forward for Node.js and aligns with TypeScript's `NodeNext` module resolution.

**Decision**: Use ESM exclusively. Set `"type": "module"` in package.json.
Use `NodeNext` module resolution in tsconfig.

**Consequences**: All imports must use `.js` extensions in compiled output.
No CommonJS `require()` calls allowed.

---

## ADR-002: Vitest Over Jest

**Status**: Accepted
**Date**: 2024-01-01
**Author**: Belkis Aslani

**Context**: Need a fast, ESM-native test runner.

**Decision**: Use Vitest. It supports ESM natively, has fast HMR-based watch mode,
and is compatible with the Jest API surface.

**Consequences**: Test files use `.test.ts` extension. Config via vitest
workspace or inline in `vitest.config.ts` if needed.

---

## ADR-003: Deterministic Benchmarks

**Status**: Accepted
**Date**: 2024-01-01
**Author**: Belkis Aslani

**Context**: Benchmark scores must be reproducible for CI gating.

**Decision**: All benchmark runners operate on local filesystem state only.
No network calls, no randomness, no timestamps in scoring logic.

**Consequences**: Benchmarks can run offline. Scores are comparable across runs.

---

## ADR-004: Flat ESLint Config

**Status**: Accepted
**Date**: 2024-01-01
**Author**: Belkis Aslani

**Context**: ESLint v9 uses flat config by default.

**Decision**: Use `eslint.config.js` flat config format with `typescript-eslint`.

**Consequences**: No `.eslintrc` files. Config is a single JS array export.
