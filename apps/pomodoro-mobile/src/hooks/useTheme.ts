import { useColorScheme } from "react-native";
import type { ThemeSetting } from "@personal-platform/pomodoro-core";

type ResolvedTheme = "light" | "dark";

export function useResolvedTheme(setting: ThemeSetting): ResolvedTheme {
  const systemScheme = useColorScheme();
  const systemTheme: ResolvedTheme = systemScheme === "dark" ? "dark" : "light";

  if (setting === "system") return systemTheme;
  return setting;
}
