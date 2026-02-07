import { execSync } from "node:child_process";
import type { RunnerResult } from "../types.js";

export async function run(): Promise<RunnerResult> {
  const errors: string[] = [];
  let passed = false;

  try {
    const output = execSync("npx vitest run --reporter=json", {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 120_000,
    }).toString();

    // Try to parse JSON from the output (vitest may prepend non-JSON lines)
    const jsonStart = output.indexOf("{");
    if (jsonStart >= 0) {
      const json = JSON.parse(output.slice(jsonStart)) as {
        numTotalTests: number;
        numPassedTests: number;
        numFailedTests: number;
        success: boolean;
      };
      passed = json.success;
      if (!passed) {
        errors.push(`${json.numFailedTests} test(s) failed out of ${json.numTotalTests}`);
      }
    } else {
      passed = true; // No JSON output usually means tests passed
    }
  } catch (err) {
    if (err && typeof err === "object" && "stdout" in err) {
      const stdout = (err as { stdout: Buffer }).stdout?.toString() ?? "";
      const failLines = stdout
        .split("\n")
        .filter((line) => line.includes("FAIL") || line.includes("AssertionError"));
      errors.push(...failLines.slice(0, 10));
    }
    if (errors.length === 0) {
      errors.push("Test execution failed");
    }
  }

  return {
    name: "test",
    score: passed ? 100 : 0,
    passed,
    details: passed ? "All tests passed" : `Test failures detected`,
    errors,
  };
}
