import React, { createContext, useMemo } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import {
  type Theme,
  type ColorTokens,
  lightColors,
  darkColors,
} from "@popapp/theme/tokens";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<Theme | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface ThemeProviderProps {
  children: React.ReactNode;

  /** Force a color scheme instead of following the system. Default: "system". */
  colorScheme?: "light" | "dark" | "system";

  /** Partial overrides for the light palette. */
  light?: Partial<ColorTokens>;

  /** Partial overrides for the dark palette. */
  dark?: Partial<ColorTokens>;

  /**
   * Named custom themes beyond light/dark.
   * Each entry must be a full ColorTokens object.
   */
  themes?: Record<string, ColorTokens>;

  /** Activate a named custom theme (key from `themes`). */
  activeTheme?: string;
}

export function ThemeProvider({
  children,
  colorScheme: colorSchemeProp = "system",
  light: lightOverrides,
  dark: darkOverrides,
  themes: customThemes,
  activeTheme,
}: ThemeProviderProps) {
  const systemScheme = useRNColorScheme() ?? "light";

  const theme = useMemo<Theme>(() => {
    // Custom named theme takes priority
    if (activeTheme && customThemes?.[activeTheme]) {
      return {
        colors: customThemes[activeTheme],
        colorScheme: activeTheme,
      };
    }

    const resolved =
      colorSchemeProp === "system" ? systemScheme : colorSchemeProp;
    const base = resolved === "dark" ? darkColors : lightColors;
    const overrides = resolved === "dark" ? darkOverrides : lightOverrides;

    return {
      colors: overrides ? { ...base, ...overrides } : base,
      colorScheme: resolved,
    };
  }, [
    systemScheme,
    colorSchemeProp,
    lightOverrides,
    darkOverrides,
    customThemes,
    activeTheme,
  ]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export { ThemeContext };
