import fs from "node:fs";
import path from "node:path";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function isExpoProject(cwd: string = process.cwd()): boolean {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return false;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return !!(
      pkg.dependencies?.expo ||
      pkg.devDependencies?.expo ||
      fs.existsSync(path.join(cwd, "app.json"))
    );
  } catch {
    return false;
  }
}

export function detectPathAlias(cwd: string = process.cwd()): string {
  const tsconfigPath = path.join(cwd, "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) return "@/";

  try {
    // Simple parse — ignores comments in tsconfig (good enough for most projects)
    const raw = fs.readFileSync(tsconfigPath, "utf-8");
    const tsconfig = JSON.parse(raw.replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*?\*\//g, ""));
    const paths = tsconfig.compilerOptions?.paths ?? {};

    for (const [alias] of Object.entries(paths)) {
      if (alias.endsWith("/*")) {
        return alias.replace("/*", "/");
      }
    }
  } catch {
    // ignore parse errors
  }

  return "@/";
}
