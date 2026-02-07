import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { RunnerResult } from "../types.js";

interface FileStats {
  path: string;
  lineCount: number;
}

function collectFiles(
  dir: string,
  results: FileStats[],
  extensions = [".ts", ".js"],
): void {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".git" ||
        entry.name === "dist"
      ) {
        continue;
      }
      collectFiles(fullPath, results, extensions);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      try {
        const content = readFileSync(fullPath, "utf-8");
        const lineCount = content.split("\n").length;
        results.push({ path: fullPath, lineCount });
      } catch {
        // Skip unreadable files
      }
    }
  }
}

function detectDuplicateLines(files: FileStats[]): number {
  const lineCounts = new Map<string, number>();

  for (const file of files) {
    try {
      const content = readFileSync(file.path, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        // Skip short/empty lines and common boilerplate
        if (trimmed.length < 20) continue;
        if (trimmed.startsWith("import ") || trimmed.startsWith("export ")) continue;
        if (trimmed === "{" || trimmed === "}" || trimmed === ");") continue;

        lineCounts.set(trimmed, (lineCounts.get(trimmed) ?? 0) + 1);
      }
    } catch {
      // Skip unreadable files
    }
  }

  let duplicateCount = 0;
  for (const [, count] of lineCounts) {
    if (count > 2) {
      duplicateCount += count - 1;
    }
  }

  return duplicateCount;
}

export async function run(): Promise<RunnerResult> {
  const errors: string[] = [];

  // Load thresholds
  const thresholds = JSON.parse(
    readFileSync(join(process.cwd(), "benchmarks/thresholds.json"), "utf-8"),
  ) as {
    maintainability: { maxAvgFileLines: number; maxDuplicateLines: number };
  };

  // Collect file stats from src/ and tools/
  const files: FileStats[] = [];
  collectFiles(join(process.cwd(), "src"), files);
  collectFiles(join(process.cwd(), "tools"), files);
  collectFiles(join(process.cwd(), "benchmarks"), files);

  const fileCount = files.length;
  const avgLines =
    fileCount > 0
      ? Math.round(files.reduce((sum, f) => sum + f.lineCount, 0) / fileCount)
      : 0;

  // Detect duplicate lines
  const duplicateLines = detectDuplicateLines(files);

  let score = 100;

  // Penalize high average file length
  if (avgLines > thresholds.maintainability.maxAvgFileLines) {
    const excess = avgLines - thresholds.maintainability.maxAvgFileLines;
    const penalty = Math.min(30, Math.round(excess / 10));
    score -= penalty;
    errors.push(
      `Average file length ${avgLines} exceeds max ${thresholds.maintainability.maxAvgFileLines}`,
    );
  }

  // Penalize excessive duplication
  if (duplicateLines > thresholds.maintainability.maxDuplicateLines) {
    const excess = duplicateLines - thresholds.maintainability.maxDuplicateLines;
    const penalty = Math.min(30, Math.round(excess / 5));
    score -= penalty;
    errors.push(
      `${duplicateLines} duplicate lines exceed max ${thresholds.maintainability.maxDuplicateLines}`,
    );
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: "maintainability",
    score,
    passed: score >= 40,
    details: `${fileCount} files, avg ${avgLines} lines, ${duplicateLines} duplicate lines`,
    errors,
  };
}
