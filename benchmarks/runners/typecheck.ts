import { execSync } from "node:child_process";
import type { RunnerResult } from "../types.js";

export async function run(): Promise<RunnerResult> {
  const errors: string[] = [];
  let passed = false;

  try {
    execSync("npx tsc --noEmit", {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 60_000,
    });
    passed = true;
  } catch (err) {
    if (err && typeof err === "object" && "stdout" in err) {
      const errObj = err as { stdout?: Buffer; stderr?: Buffer };
      const stdout = errObj.stdout?.toString() ?? "";
      const stderr = errObj.stderr?.toString() ?? "";
      const output = stdout + stderr;
      const errorLines = output.split("\n").filter((line) => line.includes("error TS"));
      errors.push(...errorLines.slice(0, 20));
      if (errorLines.length > 20) {
        errors.push(`... and ${errorLines.length - 20} more errors`);
      }
    } else {
      errors.push("Typecheck failed with unknown error");
    }
  }

  return {
    name: "typecheck",
    score: passed ? 100 : 0,
    passed,
    details: passed ? "No TypeScript errors" : `${errors.length} type error(s) found`,
    errors,
  };
}
