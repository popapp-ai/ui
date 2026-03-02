#!/usr/bin/env npx tsx
/**
 * Build script for PopApp UI registry.
 *
 * Reads registry.json, inlines file content into each item,
 * and outputs individual JSON files to public/r/{name}.json
 *
 * Usage: npx tsx scripts/build-registry.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(ROOT, "registry.json");
const OUTPUT_DIR = path.join(ROOT, "public", "r");

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  docs?: string;
  meta?: Record<string, unknown>;
  categories?: string[];
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function build() {
  console.log("📦 Building PopApp UI registry...\n");

  // Read source registry
  const registry: Registry = JSON.parse(
    fs.readFileSync(REGISTRY_PATH, "utf-8")
  );

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let count = 0;

  for (const item of registry.items) {
    // Build the registry-item.json output
    const output: Record<string, unknown> = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
    };

    if (item.title) output.title = item.title;
    if (item.description) output.description = item.description;
    if (item.author) output.author = item.author;
    if (item.dependencies?.length) output.dependencies = item.dependencies;
    if (item.devDependencies?.length) output.devDependencies = item.devDependencies;
    if (item.registryDependencies?.length) output.registryDependencies = item.registryDependencies;
    if (item.docs) output.docs = item.docs;
    if (item.meta) output.meta = item.meta;
    if (item.categories?.length) output.categories = item.categories;

    // Inline file contents
    const files: RegistryFile[] = [];
    for (const file of item.files) {
      const filePath = path.join(ROOT, file.path);

      if (!fs.existsSync(filePath)) {
        console.error(`  ❌ File not found: ${file.path}`);
        process.exit(1);
      }

      const content = fs.readFileSync(filePath, "utf-8");

      files.push({
        path: file.path,
        content,
        type: file.type,
        ...(file.target ? { target: file.target } : {}),
      });
    }

    output.files = files;

    // Write output
    const outputPath = path.join(OUTPUT_DIR, `${item.name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");

    console.log(`  ✅ ${item.name}.json (${files.length} file${files.length > 1 ? "s" : ""})`);
    count++;
  }

  // Also write a registry index (optional but nice)
  const indexPath = path.join(OUTPUT_DIR, "index.json");
  const index = registry.items.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    meta: item.meta,
  }));
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
  console.log(`  ✅ index.json (registry index)`);

  // Copy registry.json to public/ as well
  fs.copyFileSync(REGISTRY_PATH, path.join(ROOT, "public", "registry.json"));
  console.log(`  ✅ registry.json (source manifest)`);

  console.log(`\n✨ Built ${count} registry items → public/r/`);
}

build();
