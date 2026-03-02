// ============================================================================
// PopApp UI — Theme Tokens
// Pure TypeScript design tokens for React Native. No CSS variables, no Tailwind.
// ============================================================================

// ---------------------------------------------------------------------------
// Color tokens
// ---------------------------------------------------------------------------

export interface ColorTokens {
  // Brand
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;

  // Surfaces
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  card: string;
  cardForeground: string;
  cardSecondary: string;

  // Text
  foreground: string;
  foregroundSecondary: string;
  muted: string;
  mutedForeground: string;

  // UI
  border: string;
  icon: string;

  // Semantic
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;

  // Allow custom extensions
  [key: string]: string;
}

// ---------------------------------------------------------------------------
// Combined theme
// ---------------------------------------------------------------------------

export interface Theme {
  colors: ColorTokens;
  colorScheme: "light" | "dark" | string;
}

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

export const lightColors: ColorTokens = {
  primary: "#000000",
  primaryForeground: "#ffffff",
  accent: "#007AFF",
  accentForeground: "#ffffff",

  background: "#ffffff",
  backgroundSecondary: "#f5f5f5",
  backgroundTertiary: "#e0e0e0",
  card: "#ffffff",
  cardForeground: "#11181C",
  cardSecondary: "#f0f0f0",

  foreground: "#11181C",
  foregroundSecondary: "#687076",
  muted: "#c0c0c0",
  mutedForeground: "#687076",

  border: "#e0e0e0",
  icon: "#687076",

  destructive: "#e53935",
  destructiveForeground: "#ffffff",
  success: "#34C759",
  successForeground: "#ffffff",
  warning: "#FF9500",
  warningForeground: "#ffffff",
  info: "#007AFF",
  infoForeground: "#ffffff",
};

export const darkColors: ColorTokens = {
  primary: "#ffffff",
  primaryForeground: "#000000",
  accent: "#0A84FF",
  accentForeground: "#ffffff",

  background: "#000000",
  backgroundSecondary: "#111111",
  backgroundTertiary: "#2a2a2a",
  card: "#1a1a1a",
  cardForeground: "#ECEDEE",
  cardSecondary: "#222222",

  foreground: "#ECEDEE",
  foregroundSecondary: "#9BA1A6",
  muted: "#555555",
  mutedForeground: "#9BA1A6",

  border: "#2a2a2a",
  icon: "#9BA1A6",

  destructive: "#ef5350",
  destructiveForeground: "#ffffff",
  success: "#30D158",
  successForeground: "#ffffff",
  warning: "#FFB74D",
  warningForeground: "#000000",
  info: "#64D2FF",
  infoForeground: "#000000",
};
