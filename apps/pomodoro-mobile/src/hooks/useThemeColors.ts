import { colors, darkColors, type ThemeColors } from "@personal-platform/design-tokens/tokens";
import { useSettings } from "./useSettings";
import { useResolvedTheme } from "./useTheme";

export function useThemeColors(): ThemeColors {
  const { settings } = useSettings();
  const theme = useResolvedTheme(settings.theme);
  return theme === "dark" ? darkColors : colors;
}
