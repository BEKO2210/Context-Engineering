import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { RunnerResult } from "../types.js";

// Patterns are constructed dynamically to avoid the scanner detecting its own source
const SECRET_PATTERNS = [
  new RegExp("SUPABASE" + "_KEY\\s*[:=]\\s*[\"'][^\"']+[\"']"),
  new RegExp("OPENAI" + "_API_KEY\\s*[:=]\\s*[\"'][^\"']+[\"']"),
  new RegExp("PRIVATE" + "_KEY\\s*[:=]\\s*[\"'][^\"']+[\"']"),
  new RegExp("BEGIN RSA " + "PRIVATE KEY"),
  new RegExp("BEGIN OPENSSH " + "PRIVATE KEY"),
  new RegExp("ANTHROPIC" + "_API_KEY\\s*[:=]\\s*[\"'][^\"']+[\"']"),
  new RegExp("AWS_SECRET" + "_ACCESS_KEY\\s*[:=]\\s*[\"'][^\"']+[\"']"),
];

function scanDir(
  dir: string,
  secrets: string[],
  extensions = [".ts", ".js", ".json", ".md", ".yml", ".yaml", ".env"],
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
      scanDir(fullPath, secrets, extensions);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      try {
        const content = readFileSync(fullPath, "utf-8");
        for (const pattern of SECRET_PATTERNS) {
          if (pattern.test(content)) {
            secrets.push(`${fullPath}: matches ${pattern.source}`);
          }
        }
      } catch {
        // Skip unreadable files
      }
    }
  }
}

function matchesBlocklist(name: string, blocklist: string[]): boolean {
  for (const pattern of blocklist) {
    if (pattern.includes("*")) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      if (regex.test(name)) return true;
    } else if (name === pattern) {
      return true;
    }
  }
  return false;
}

export async function run(): Promise<RunnerResult> {
  const errors: string[] = [];
  let score = 100;

  // Load thresholds
  const thresholds = JSON.parse(
    readFileSync(join(process.cwd(), "benchmarks/thresholds.json"), "utf-8"),
  ) as {
    dependencies: { maxCount: number; blocklist: string[] };
  };

  // Check package.json dependencies
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const deps = Object.keys(pkg.dependencies ?? {});
  const devDeps = Object.keys(pkg.devDependencies ?? {});
  const allDeps = [...deps, ...devDeps];

  // Check total count
  if (allDeps.length > thresholds.dependencies.maxCount) {
    score -= 30;
    errors.push(
      `Dependency count ${allDeps.length} exceeds maximum ${thresholds.dependencies.maxCount}`,
    );
  }

  // Check blocklist
  for (const dep of allDeps) {
    if (matchesBlocklist(dep, thresholds.dependencies.blocklist)) {
      score -= 20;
      errors.push(`Blocked dependency found: ${dep}`);
    }
  }

  // Scan for secrets
  const secrets: string[] = [];
  scanDir(process.cwd(), secrets);

  if (secrets.length > 0) {
    score -= 50;
    errors.push(...secrets.map((s) => `Secret detected: ${s}`));
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: "deps",
    score,
    passed: errors.length === 0,
    details:
      errors.length === 0
        ? `${allDeps.length} dependencies, no secrets found`
        : `${errors.length} issue(s) found`,
    errors,
  };
}
