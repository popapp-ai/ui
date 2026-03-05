const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Watch the monorepo root so registry/ changes trigger hot reload
config.watchFolders = [monorepoRoot];

// Resolve @popapp/* aliases to registry/
config.resolver.extraNodeModules = {
  "@popapp/theme": path.resolve(monorepoRoot, "registry/theme"),
  "@popapp/components": path.resolve(monorepoRoot, "registry/components"),
  "@popapp/hooks": path.resolve(monorepoRoot, "registry/hooks"),
  "@popapp/utils": path.resolve(monorepoRoot, "registry/utils"),
};

// Ensure node_modules resolve from both example/ and root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Required for pnpm: Metro must follow symlinks into .pnpm store for SHA-1 hashing
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// Exclude irrelevant monorepo directories from being watched
// Use anchored paths to avoid blocking .pnpm paths containing "cli"
const escRoot = monorepoRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
config.resolver.blockList = [
  new RegExp(`^${escRoot}/cli/.*`),
  new RegExp(`^${escRoot}/public/.*`),
  new RegExp(`^${escRoot}/\\.claude/.*`),
];

module.exports = config;
