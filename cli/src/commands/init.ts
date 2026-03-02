import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import { logger } from "../utils/logger.js";
import {
  configExists,
  createDefaultConfig,
  writeConfig,
  readConfig,
} from "../utils/config.js";
import {
  detectPackageManager,
  detectPathAlias,
  isExpoProject,
} from "../utils/detector.js";
import { add } from "./add.js";

export async function init(options: { yes?: boolean } = {}) {
  const cwd = process.cwd();

  if (configExists(cwd)) {
    logger.warn("popapp.json already exists. Skipping init.");
    return;
  }

  logger.info("Initializing PopApp UI...");
  logger.break();

  const isExpo = isExpoProject(cwd);
  const pkgManager = detectPackageManager(cwd);
  const detectedAlias = detectPathAlias(cwd);

  if (isExpo) {
    logger.info(`Detected Expo project (${pkgManager})`);
  } else {
    logger.info(`Detected React Native project (${pkgManager})`);
  }

  let response: { components: string; lib: string; hooks: string; alias: string };

  if (options.yes) {
    // Use defaults without prompting
    response = {
      components: "components/ui",
      lib: "lib",
      hooks: "hooks",
      alias: detectedAlias,
    };
    logger.info(`Using defaults: components/ui, lib, hooks, alias: ${detectedAlias}`);
  } else {
    const prompted = await prompts([
      {
        type: "text",
        name: "components",
        message: "Component directory:",
        initial: "components/ui",
      },
      {
        type: "text",
        name: "lib",
        message: "Lib directory (theme, utils):",
        initial: "lib",
      },
      {
        type: "text",
        name: "hooks",
        message: "Hooks directory:",
        initial: "hooks",
      },
      {
        type: "text",
        name: "alias",
        message: "Path alias:",
        initial: detectedAlias,
      },
    ]);

    if (!prompted.components) {
      logger.error("Init cancelled.");
      process.exit(1);
    }
    response = prompted;
  }

  // Create config
  const config = createDefaultConfig();
  config.aliases.components = response.components;
  config.aliases.lib = response.lib;
  config.aliases.hooks = response.hooks;

  writeConfig(config, cwd);
  logger.success("Created popapp.json");

  // Install foundation items (theme, haptics, use-color-scheme) via the add command
  logger.break();
  logger.info("Installing theme system...");
  await add(["theme", "haptics", "use-color-scheme"], { yes: true });

  const alias = response.alias as string;

  logger.break();
  logger.success("PopApp UI initialized!");
  logger.break();
  logger.info("Next steps:");
  logger.info(`  1. Wrap your root layout in <ThemeProvider>:`);
  logger.break();
  logger.info(`     import { ThemeProvider } from "${alias}${response.lib}/theme/provider";`);
  logger.break();
  logger.info(`     <ThemeProvider>`);
  logger.info(`       <App />`);
  logger.info(`     </ThemeProvider>`);
  logger.break();
  logger.info(`  2. Add components: npx popapp add button card`);
}
