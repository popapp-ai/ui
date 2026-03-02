import { useContext } from "react";
import { ThemeContext } from "@popapp/theme/provider";
import type { Theme } from "@popapp/theme/tokens";

/**
 * Access the current theme tokens.
 *
 * Must be used inside a `<ThemeProvider>`.
 *
 * ```tsx
 * const { colors, colorScheme } = useTheme();
 * ```
 */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error(
      "useTheme must be used within a <ThemeProvider>. " +
        "Wrap your root layout in <ThemeProvider> to fix this."
    );
  }
  return theme;
}
