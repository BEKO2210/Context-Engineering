import { describe, it, expect } from "vitest";
import { validateContext, readabilityScore, extractHeadings } from "../src/example.js";

describe("validateContext", () => {
  it("returns valid for a complete context document", () => {
    const doc = `# AGENTS.md
## Identity
This is a test project.
## Rules
1. Follow the rules.
## Structure
- src/ — source code
`;
    const result = validateContext(doc);
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it("returns missing sections for incomplete document", () => {
    const doc = `# AGENTS.md
## Identity
This is a test project.
`;
    const result = validateContext(doc);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("## Rules");
    expect(result.missing).toContain("## Structure");
  });

  it("returns all missing for empty document", () => {
    const result = validateContext("");
    expect(result.valid).toBe(false);
    expect(result.missing).toHaveLength(3);
  });
});

describe("readabilityScore", () => {
  it("returns 0 for empty content", () => {
    expect(readabilityScore("")).toBe(0);
  });

  it("returns high score for well-structured content", () => {
    const doc = `# Title
## Section One
Short clear lines.
## Section Two
More short lines.
## Section Three
Final section.
`;
    const score = readabilityScore(doc);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it("penalizes very long lines", () => {
    const longLine = "x".repeat(150);
    const doc = Array(10).fill(longLine).join("\n");
    const score = readabilityScore(doc);
    expect(score).toBeLessThan(80);
  });
});

describe("extractHeadings", () => {
  it("extracts all headings from markdown", () => {
    const doc = `# Title
## Section One
Some content.
## Section Two
More content.
### Subsection
Details.
`;
    const headings = extractHeadings(doc);
    expect(headings).toEqual(["Title", "Section One", "Section Two", "Subsection"]);
  });

  it("returns empty array for no headings", () => {
    expect(extractHeadings("Just plain text.")).toEqual([]);
  });
});
