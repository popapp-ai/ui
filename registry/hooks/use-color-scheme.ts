import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * Returns the current color scheme ('light' | 'dark'), defaulting to 'light'.
 */
export function useColorScheme(): "light" | "dark" {
  return useRNColorScheme() ?? "light";
}
