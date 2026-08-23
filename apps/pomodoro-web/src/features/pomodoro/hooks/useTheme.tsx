import {
  createContext,
  useContext,
  useEffect,
} from "react";

import type { ThemeSetting } from "@personal-platform/pomodoro-core";

import { useSettings } from "./useSettings";

type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ResolvedTheme;
  setting: ThemeSetting;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setting: "system",
});

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(setting: ThemeSetting): ResolvedTheme {
  if (setting === "system") return getSystemTheme();
  return setting;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const resolved = resolveTheme(settings.theme);

  // Apply data-theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolved);
  }, [resolved]);

  return (
    <ThemeContext.Provider value={{ theme: resolved, setting: settings.theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
