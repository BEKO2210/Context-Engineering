import { execSync } from "node:child_process";
import type { RunnerResult } from "../types.js";

export async function run(): Promise<RunnerResult> {
  const errors: string[] = [];
  let passed = false;
  let warningCount = 0;
  let errorCount = 0;

  try {
    const output = execSync("npx eslint . --format json", {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 60_000,
    }).toString();

    const results = JSON.parse(output) as Array<{
      errorCount: number;
      warningCount: number;
      filePath: string;
      messages: Array<{ message: string; ruleId: string; line: number }>;
    }>;

    for (const file of results) {
      errorCount += file.errorCount;
      warningCount += file.warningCount;
      for (const msg of file.messages.slice(0, 5)) {
        errors.push(`${file.filePath}:${msg.line} - ${msg.message} (${msg.ruleId})`);
      }
    }

    passed = errorCount === 0;
  } catch (err) {
    // ESLint exits non-zero when there are errors
    if (err && typeof err === "object" && "stdout" in err) {
      const stdout = (err as { stdout: Buffer }).stdout?.toString() ?? "";
      try {
        const results = JSON.parse(stdout) as Array<{
          errorCount: number;
          warningCount: number;
          filePath: string;
          messages: Array<{ message: string; ruleId: string; line: number }>;
        }>;
        for (const file of results) {
          errorCount += file.errorCount;
          warningCount += file.warningCount;
          for (const msg of file.messages.slice(0, 3)) {
            errors.push(`${file.filePath}:${msg.line} - ${msg.message} (${msg.ruleId})`);
          }
        }
      } catch {
        errors.push("Failed to parse ESLint output");
      }
    } else {
      errors.push("ESLint execution failed");
    }
  }

  // Score: 100 if no errors, deduct for warnings and errors
  let score = 100;
  score -= errorCount * 10;
  score -= warningCount * 2;
  score = Math.max(0, Math.min(100, score));

  return {
    name: "lint",
    score,
    passed,
    details: `${errorCount} error(s), ${warningCount} warning(s)`,
    errors,
  };
}
