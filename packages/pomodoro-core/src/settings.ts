import { POMODORO_DURATIONS } from "./constants";
import type { PomodoroMode } from "./types";

// ── Types ──────────────────────────────────────────────────

export type ThemeSetting = "light" | "dark" | "system";

export type PomodoroSettings = {
  durations: Record<PomodoroMode, number>;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  theme: ThemeSetting;
  hapticFeedback: boolean;
};

export type PomodoroSettingsInput = {
  durations?: Partial<Record<PomodoroMode, number>>;
  autoStartBreaks?: boolean;
  autoStartWork?: boolean;
  theme?: ThemeSetting;
  hapticFeedback?: boolean;
};

// ── Duration bounds ────────────────────────────────────────

export type DurationBounds = {
  min: number;
  max: number;
};

export const DURATION_BOUNDS: Record<PomodoroMode, DurationBounds> = {
  work: { min: 60, max: 7200 },
  shortBreak: { min: 60, max: 3600 },
  longBreak: { min: 60, max: 3600 },
};

// ── Defaults ───────────────────────────────────────────────

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  durations: { ...POMODORO_DURATIONS },
  autoStartBreaks: true,
  autoStartWork: true,
  theme: "system",
  hapticFeedback: true,
};

// ── Validation ─────────────────────────────────────────────

function isValidDuration(
  value: unknown,
  bounds: DurationBounds,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= bounds.min &&
    value <= bounds.max
  );
}

function isValidDurationMap(
  value: unknown,
): value is Record<PomodoroMode, number> {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  const modes: PomodoroMode[] = ["work", "shortBreak", "longBreak"];
  return modes.every((mode) =>
    isValidDuration(obj[mode], DURATION_BOUNDS[mode]),
  );
}

export function isValidSettings(
  value: unknown,
): value is PomodoroSettings {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (!isValidDurationMap(obj.durations)) return false;
  if (typeof obj.autoStartBreaks !== "boolean") return false;
  if (typeof obj.autoStartWork !== "boolean") return false;
  if (typeof obj.hapticFeedback !== "boolean") return false;
  if (!["light", "dark", "system"].includes(obj.theme as string))
    return false;

  return true;
}

// ── Merge ──────────────────────────────────────────────────

function clampDuration(
  value: number,
  bounds: DurationBounds,
): number {
  return Math.max(bounds.min, Math.min(bounds.max, value));
}

function normalizeTheme(value: unknown): ThemeSetting {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return DEFAULT_POMODORO_SETTINGS.theme;
}

export function mergeSettings(
  partial: PomodoroSettingsInput,
  base: PomodoroSettings = DEFAULT_POMODORO_SETTINGS,
): PomodoroSettings {
  const durations = { ...base.durations };

  if (partial.durations) {
    for (const mode of ["work", "shortBreak", "longBreak"] as const) {
      const raw = partial.durations[mode];
      if (raw !== undefined) {
        durations[mode] = clampDuration(
          Math.round(raw),
          DURATION_BOUNDS[mode],
        );
      }
    }
  }

  return {
    durations,
    autoStartBreaks:
      partial.autoStartBreaks ?? base.autoStartBreaks,
    autoStartWork:
      partial.autoStartWork ?? base.autoStartWork,
    theme: normalizeTheme(partial.theme ?? base.theme),
    hapticFeedback:
      partial.hapticFeedback ?? base.hapticFeedback,
  };
}
