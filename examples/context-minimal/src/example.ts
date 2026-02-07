/**
 * Validates that a context document has the required sections.
 * A valid context document must contain: Identity, Rules, and Structure sections.
 */
export function validateContext(content: string): {
  valid: boolean;
  missing: string[];
} {
  const requiredSections = ["## Identity", "## Rules", "## Structure"];
  const missing: string[] = [];

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      missing.push(section);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Computes a simple readability score for a document.
 * Based on average line length and total line count.
 * Score ranges from 0 to 100.
 */
export function readabilityScore(content: string): number {
  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  if (lines.length === 0) return 0;

  const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;

  let score = 100;

  // Penalize very long average line length
  if (avgLineLength > 120) {
    score -= 30;
  } else if (avgLineLength > 80) {
    score -= 10;
  }

  // Penalize very long documents (over 500 non-empty lines)
  if (lines.length > 500) {
    score -= 20;
  } else if (lines.length > 200) {
    score -= 10;
  }

  // Bonus for having headings (structured content)
  const headingCount = lines.filter((line) => line.startsWith("#")).length;
  if (headingCount >= 3) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Extracts all section headings from a markdown document.
 */
export function extractHeadings(content: string): string[] {
  return content
    .split("\n")
    .filter((line) => line.startsWith("#"))
    .map((line) => line.replace(/^#+\s*/, "").trim());
}
