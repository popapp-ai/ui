import { execSync } from "node:child_process";
import type { PackageManager } from "./detector.js";
import { logger } from "./logger.js";

/**
 * Install npm dependencies using the detected package manager.
 * Prefers `npx expo install` for Expo projects (handles native module compatibility).
 */
export function installDependencies(
  deps: string[],
  options: {
    packageManager: PackageManager;
    isExpo: boolean;
    cwd?: string;
  },
): void {
  if (deps.length === 0) return;

  const { packageManager, isExpo, cwd = process.cwd() } = options;
  const depList = deps.join(" ");

  let cmd: string;

  if (isExpo) {
    cmd = `npx expo install ${depList}`;
  } else {
    switch (packageManager) {
      case "bun":
        cmd = `bun add ${depList}`;
        break;
      case "pnpm":
        cmd = `pnpm add ${depList}`;
        break;
      case "yarn":
        cmd = `yarn add ${depList}`;
        break;
      default:
        cmd = `npm install ${depList}`;
    }
  }

  logger.info(`Installing dependencies: ${depList}`);

  try {
    execSync(cmd, { cwd, stdio: "inherit" });
  } catch {
    logger.warn(
      `Automatic install failed. Please run manually:\n  ${cmd}`,
    );
  }
}
