import { logger } from "../utils/logger.js";
import { readConfig, configExists } from "../utils/config.js";
import { fetchRegistry } from "../utils/registry.js";
import pc from "picocolors";

export async function list() {
  const cwd = process.cwd();

  if (!configExists(cwd)) {
    logger.error('No popapp.json found. Run "npx popapp init" first.');
    process.exit(1);
  }

  const config = readConfig(cwd);
  const registry = await fetchRegistry(config);

  logger.info(`Available components (${registry.items.length}):`);
  logger.break();

  const installed = new Set(config.installedComponents);

  // Header
  console.log(
    `  ${pc.dim("Name".padEnd(22))}${pc.dim("Tier")}  ${pc.dim("Description")}`,
  );
  console.log(`  ${"─".repeat(70)}`);

  for (const item of registry.items) {
    const isInstalled = installed.has(item.name);
    const status = isInstalled ? pc.green("✓") : " ";
    const name = isInstalled
      ? pc.green(item.name.padEnd(20))
      : item.name.padEnd(20);
    const tier = String(item.meta?.animationTier ?? "-").padEnd(4);

    console.log(`  ${status} ${name} ${pc.dim(tier)} ${pc.dim(item.description)}`);
  }

  logger.break();
  logger.info(`${pc.green("✓")} = installed`);
}
