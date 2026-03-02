import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * Returns the current color scheme ('light' | 'dark'), defaulting to 'light'.
 */
export function useColorScheme(): "light" | "dark" {
  const scheme = useRNColorScheme();
  return scheme === "dark" ? "dark" : "light";
}
