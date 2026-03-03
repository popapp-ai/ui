import type { PopAppConfig } from "./config.js";

/**
 * Rewrite canonical `@popapp/` imports to the user's configured aliases.
 *
 * Registry files use canonical imports like:
 *   import { useTheme } from "@popapp/theme/use-theme";
 *   import { TouchableScale } from "@popapp/components/touchable-scale";
 *   import { impactLight } from "@popapp/utils/haptics";
 *
 * This function rewrites them based on popapp.json aliases:
 *   import { useTheme } from "@/lib/theme/use-theme";
 *   import { TouchableScale } from "@/components/ui/touchable-scale";
 *   import { impactLight } from "@/lib/haptics";
 */
export function transformImports(
  source: string,
  config: PopAppConfig,
  pathAlias: string,
): string {
  const { aliases } = config;

  return source
    // @popapp/theme/* -> {alias}{lib}/theme/*
    .replace(
      /@popapp\/theme\/([\w./-]+)/g,
      `${pathAlias}${aliases.lib}/theme/$1`,
    )
    // @popapp/components/* -> {alias}{components}/*
    .replace(
      /@popapp\/components\/([\w./-]+)/g,
      `${pathAlias}${aliases.components}/$1`,
    )
    // @popapp/hooks/* -> {alias}{hooks}/*
    .replace(
      /@popapp\/hooks\/([\w./-]+)/g,
      `${pathAlias}${aliases.hooks}/$1`,
    )
    // @popapp/utils/* -> {alias}{lib}/*
    .replace(
      /@popapp\/utils\/([\w./-]+)/g,
      `${pathAlias}${aliases.lib}/$1`,
    );
}
