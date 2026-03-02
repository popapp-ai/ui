import type { PopAppConfig } from "./config.js";

// ---------------------------------------------------------------------------
// Registry types
// ---------------------------------------------------------------------------

export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  docs?: string;
  meta?: {
    platforms?: string[];
    optionalDeps?: string[];
    animationTier?: number;
    tags?: string[];
  };
}

export interface Registry {
  name: string;
  homepage?: string;
  items: RegistryItem[];
}

// ---------------------------------------------------------------------------
// Fetch registry index
// ---------------------------------------------------------------------------

export async function fetchRegistry(config: PopAppConfig): Promise<Registry> {
  const url = `${config.registryUrl}/registry.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry from ${url}: ${res.status}`);
  }
  return res.json() as Promise<Registry>;
}

// ---------------------------------------------------------------------------
// Fetch a single registry item (with inlined content) from /r/{name}.json
// ---------------------------------------------------------------------------

export async function fetchRegistryItem(
  config: PopAppConfig,
  name: string,
): Promise<RegistryItem> {
  const url = `${config.registryUrl}/r/${name}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch component "${name}" from ${url}: ${res.status}`);
  }
  return res.json() as Promise<RegistryItem>;
}

// ---------------------------------------------------------------------------
// Fetch a raw file (fallback for registries without /r/ build output)
// ---------------------------------------------------------------------------

export async function fetchFile(
  config: PopAppConfig,
  filePath: string,
): Promise<string> {
  const url = `${config.registryUrl}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

// ---------------------------------------------------------------------------
// Check if registry has built /r/ output
// ---------------------------------------------------------------------------

export async function hasBuiltRegistry(config: PopAppConfig): Promise<boolean> {
  try {
    const url = `${config.registryUrl}/r/index.json`;
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Resolve dependencies (topological sort)
// ---------------------------------------------------------------------------

export function resolveDependencies(
  names: string[],
  registry: Registry,
  installed: string[] = [],
): RegistryItem[] {
  const itemMap = new Map(registry.items.map((i) => [i.name, i]));
  const resolved: RegistryItem[] = [];
  const visited = new Set<string>(installed);

  function visit(name: string) {
    if (visited.has(name)) return;
    visited.add(name);

    const item = itemMap.get(name);
    if (!item) {
      throw new Error(
        `Component "${name}" not found in registry. Run "npx popapp list" to see available components.`
      );
    }

    // Resolve registry deps first
    for (const dep of item.registryDependencies ?? []) {
      visit(dep);
    }

    resolved.push(item);
  }

  for (const name of names) {
    visit(name);
  }

  return resolved;
}
