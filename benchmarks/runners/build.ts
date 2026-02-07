import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { RunnerResult } from "../types.js";

function getDistSize(dir: string): number {
  let total = 0;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        total += getDistSize(fullPath);
      } else {
        total += statSync(fullPath).size;
      }
    }
  } catch {
    // dist/ may not exist yet
  }
  return total;
}

export async function run(): Promise<RunnerResult> {
  const errors: string[] = [];
  let buildSuccess = false;

  try {
    execSync("npx tsc", {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 60_000,
    });
    buildSuccess = true;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown build error";
    errors.push(`Build failed: ${message.slice(0, 500)}`);
  }

  const distSize = getDistSize(join(process.cwd(), "dist"));
  const distSizeKB = Math.round(distSize / 1024);

  let score = 0;
  if (buildSuccess) {
    score = 100;
    // Penalize large bundles (proxy for performance)
    if (distSize > 512 * 1024) {
      score -= 20;
    } else if (distSize > 256 * 1024) {
      score -= 10;
    }
  }

  return {
    name: "build",
    score: Math.max(0, score),
    passed: buildSuccess,
    details: buildSuccess
      ? `Build succeeded. dist/ size: ${distSizeKB} KB`
      : `Build failed with ${errors.length} error(s)`,
    errors,
  };
}
