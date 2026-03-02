import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import { logger } from "../utils/logger.js";
import { readConfig, writeConfig } from "../utils/config.js";
import { detectPackageManager, detectPathAlias, isExpoProject } from "../utils/detector.js";
import {
  fetchFile,
  fetchRegistry,
  fetchRegistryItem,
  hasBuiltRegistry,
  resolveDependencies,
  type RegistryItem,
} from "../utils/registry.js";
import { transformImports } from "../utils/transformer.js";
import { installDependencies } from "../utils/installer.js";

export async function add(
  components: string[],
  options: { yes?: boolean },
) {
  const cwd = process.cwd();

  let config;
  try {
    config = readConfig(cwd);
  } catch (e: any) {
    logger.error(e.message);
    process.exit(1);
  }

  const pathAlias = detectPathAlias(cwd);

  logger.info("Fetching registry...");
  let registry;
  try {
    registry = await fetchRegistry(config);
  } catch (e: any) {
    logger.error(e.message);
    process.exit(1);
  }

  // Resolve full dependency tree
  let toInstall: RegistryItem[];
  try {
    toInstall = resolveDependencies(
      components,
      registry,
      config.installedComponents,
    );
  } catch (e: any) {
    logger.error(e.message);
    process.exit(1);
  }

  if (toInstall.length === 0) {
    logger.info("All requested components are already installed.");
    return;
  }

  // Check if registry has pre-built /r/{name}.json files (shadcn-compatible)
  const isBuilt = await hasBuiltRegistry(config);

  // Show what will be installed
  logger.break();
  logger.info("Components to install:");
  for (const item of toInstall) {
    const isDirectRequest = components.includes(item.name);
    logger.info(
      `  ${isDirectRequest ? "●" : "○"} ${item.name}${isDirectRequest ? "" : " (dependency)"}`,
    );
  }

  // Collect npm dependencies
  const allNpmDeps = new Set<string>();
  const allOptionalDeps = new Set<string>();

  for (const item of toInstall) {
    for (const dep of item.dependencies ?? []) {
      allNpmDeps.add(dep);
    }
    if (item.meta?.optionalDeps) {
      for (const dep of item.meta.optionalDeps) {
        allOptionalDeps.add(dep);
      }
    }
  }

  if (allNpmDeps.size > 0) {
    logger.break();
    logger.info("Required npm dependencies:");
    for (const dep of allNpmDeps) {
      logger.info(`  ${dep}`);
    }
  }

  // Confirm
  if (!options.yes) {
    logger.break();
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: "Proceed with installation?",
      initial: true,
    });

    if (!proceed) {
      logger.error("Cancelled.");
      process.exit(0);
    }
  }

  // Download and write files
  logger.break();
  for (const item of toInstall) {
    if (isBuilt) {
      // ── Built registry: fetch /r/{name}.json with inlined content ──
      let fullItem: RegistryItem;
      try {
        fullItem = await fetchRegistryItem(config, item.name);
      } catch (e: any) {
        logger.error(e.message);
        process.exit(1);
      }

      for (const file of fullItem.files) {
        if (!file.content) {
          logger.error(`No content in ${file.path} — registry may not be built correctly.`);
          process.exit(1);
        }

        const target = file.target ?? file.path;
        const transformed = transformImports(file.content, config, pathAlias);
        const targetPath = path.join(cwd, target);

        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, transformed);

        logger.success(target);
      }
    } else {
      // ── Raw registry: fetch individual source files ──
      for (const file of item.files) {
        const source = await fetchFile(config, file.path);
        const transformed = transformImports(source, config, pathAlias);

        const target = file.target ?? file.path;
        const targetPath = path.join(cwd, target);

        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, transformed);

        logger.success(target);
      }
    }

    // Track installed component
    if (!config.installedComponents.includes(item.name)) {
      config.installedComponents.push(item.name);
    }
  }

  // Save config
  writeConfig(config, cwd);

  // Install npm dependencies
  if (allNpmDeps.size > 0) {
    logger.break();
    const pkgManager = detectPackageManager(cwd);
    const isExpo = isExpoProject(cwd);

    installDependencies([...allNpmDeps], {
      packageManager: pkgManager,
      isExpo,
      cwd,
    });
  }

  // Ask about optional deps
  if (allOptionalDeps.size > 0) {
    let installOptional = false;

    if (options.yes) {
      logger.info(`Skipping optional enhancements: ${[...allOptionalDeps].join(", ")}`);
    } else {
      logger.break();
      const response = await prompts({
        type: "confirm",
        name: "installOptional",
        message: `Install optional enhancements? (${[...allOptionalDeps].join(", ")})`,
        initial: false,
      });
      installOptional = response.installOptional;
    }

    if (installOptional) {
      const pkgManager = detectPackageManager(cwd);
      const isExpo = isExpoProject(cwd);
      installDependencies([...allOptionalDeps], {
        packageManager: pkgManager,
        isExpo,
        cwd,
      });
    }
  }

  logger.break();
  logger.success("Done! Components added to your project.");
}
