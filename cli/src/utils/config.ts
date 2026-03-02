import fs from "node:fs";
import path from "node:path";

export interface PopAppConfig {
  $schema?: string;
  registryUrl: string;
  aliases: {
    components: string;
    hooks: string;
    lib: string;
  };
  typescript: boolean;
  installedComponents: string[];
}

const CONFIG_FILE = "popapp.json";

export function getConfigPath(cwd: string = process.cwd()): string {
  return path.join(cwd, CONFIG_FILE);
}

export function configExists(cwd: string = process.cwd()): boolean {
  return fs.existsSync(getConfigPath(cwd));
}

export function readConfig(cwd: string = process.cwd()): PopAppConfig {
  const configPath = getConfigPath(cwd);
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No popapp.json found. Run "npx popapp init" first.`,
    );
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export function writeConfig(
  config: PopAppConfig,
  cwd: string = process.cwd(),
): void {
  const configPath = getConfigPath(cwd);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}

export function createDefaultConfig(): PopAppConfig {
  return {
    $schema: "https://popapp.dev/schema/config.json",
    registryUrl: "https://popapp-ai.github.io/ui",
    aliases: {
      components: "components/ui",
      hooks: "hooks",
      lib: "lib",
    },
    typescript: true,
    installedComponents: [],
  };
}
