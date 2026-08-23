import { describe, expect, it } from "vitest";

import {
  DEFAULT_POMODORO_SETTINGS,
  DURATION_BOUNDS,
  isValidSettings,
  mergeSettings,
  type PomodoroSettings,
  type PomodoroSettingsInput,
} from "./settings";

describe("DEFAULT_POMODORO_SETTINGS", () => {
  it("has 25 minute work duration", () => {
    expect(DEFAULT_POMODORO_SETTINGS.durations.work).toBe(25 * 60);
  });

  it("has 5 minute short break", () => {
    expect(DEFAULT_POMODORO_SETTINGS.durations.shortBreak).toBe(5 * 60);
  });

  it("has 15 minute long break", () => {
    expect(DEFAULT_POMODORO_SETTINGS.durations.longBreak).toBe(15 * 60);
  });

  it("enables auto start breaks", () => {
    expect(DEFAULT_POMODORO_SETTINGS.autoStartBreaks).toBe(true);
  });

  it("enables auto start work", () => {
    expect(DEFAULT_POMODORO_SETTINGS.autoStartWork).toBe(true);
  });

  it("defaults to system theme", () => {
    expect(DEFAULT_POMODORO_SETTINGS.theme).toBe("system");
  });

  it("enables haptic feedback", () => {
    expect(DEFAULT_POMODORO_SETTINGS.hapticFeedback).toBe(true);
  });
});

describe("DURATION_BOUNDS", () => {
  it("allows work between 1 and 120 minutes", () => {
    expect(DURATION_BOUNDS.work.min).toBe(60);
    expect(DURATION_BOUNDS.work.max).toBe(7200);
  });

  it("allows short break between 1 and 60 minutes", () => {
    expect(DURATION_BOUNDS.shortBreak.min).toBe(60);
    expect(DURATION_BOUNDS.shortBreak.max).toBe(3600);
  });

  it("allows long break between 1 and 60 minutes", () => {
    expect(DURATION_BOUNDS.longBreak.min).toBe(60);
    expect(DURATION_BOUNDS.longBreak.max).toBe(3600);
  });
});

describe("isValidSettings", () => {
  it("accepts valid settings", () => {
    expect(isValidSettings(DEFAULT_POMODORO_SETTINGS)).toBe(true);
  });

  it("rejects null", () => {
    expect(isValidSettings(null)).toBe(false);
  });

  it("rejects non-object", () => {
    expect(isValidSettings("hello")).toBe(false);
  });

  it("rejects missing durations", () => {
    const { durations: _, ...rest } = DEFAULT_POMODORO_SETTINGS;
    void _;
    expect(isValidSettings(rest)).toBe(false);
  });

  it("rejects duration below minimum", () => {
    const settings: PomodoroSettings = {
      ...DEFAULT_POMODORO_SETTINGS,
      durations: { ...DEFAULT_POMODORO_SETTINGS.durations, work: 30 },
    };
    expect(isValidSettings(settings)).toBe(false);
  });

  it("rejects duration above maximum", () => {
    const settings: PomodoroSettings = {
      ...DEFAULT_POMODORO_SETTINGS,
      durations: { ...DEFAULT_POMODORO_SETTINGS.durations, work: 7201 },
    };
    expect(isValidSettings(settings)).toBe(false);
  });

  it("accepts boundary values", () => {
    const settings: PomodoroSettings = {
      ...DEFAULT_POMODORO_SETTINGS,
      durations: { work: 60, shortBreak: 60, longBreak: 3600 },
    };
    expect(isValidSettings(settings)).toBe(true);
  });

  it("rejects invalid theme", () => {
    const settings = {
      ...DEFAULT_POMODORO_SETTINGS,
      theme: "blue",
    };
    expect(isValidSettings(settings)).toBe(false);
  });

  it("rejects non-boolean autoStartBreaks", () => {
    const settings = {
      ...DEFAULT_POMODORO_SETTINGS,
      autoStartBreaks: "yes",
    };
    expect(isValidSettings(settings)).toBe(false);
  });

  it("rejects non-boolean hapticFeedback", () => {
    const settings = {
      ...DEFAULT_POMODORO_SETTINGS,
      hapticFeedback: 1,
    };
    expect(isValidSettings(settings)).toBe(false);
  });
});

describe("mergeSettings", () => {
  it("returns defaults for empty input", () => {
    const result = mergeSettings({});
    expect(result).toEqual(DEFAULT_POMODORO_SETTINGS);
  });

  it("overrides specific durations", () => {
    const result = mergeSettings({
      durations: { work: 30 * 60 },
    });
    expect(result.durations.work).toBe(30 * 60);
    expect(result.durations.shortBreak).toBe(5 * 60);
  });

  it("clamps duration below minimum", () => {
    const result = mergeSettings({
      durations: { work: 10 },
    });
    expect(result.durations.work).toBe(60);
  });

  it("clamps duration above maximum", () => {
    const result = mergeSettings({
      durations: { work: 99999 },
    });
    expect(result.durations.work).toBe(7200);
  });

  it("rounds fractional durations", () => {
    const result = mergeSettings({
      durations: { work: 1500.7 },
    });
    expect(result.durations.work).toBe(1501);
  });

  it("overrides autoStartBreaks", () => {
    const result = mergeSettings({ autoStartBreaks: false });
    expect(result.autoStartBreaks).toBe(false);
    expect(result.autoStartWork).toBe(true);
  });

  it("overrides theme", () => {
    const result = mergeSettings({ theme: "dark" });
    expect(result.theme).toBe("dark");
  });

  it("overrides hapticFeedback", () => {
    const result = mergeSettings({ hapticFeedback: false });
    expect(result.hapticFeedback).toBe(false);
  });

  it("merges multiple fields at once", () => {
    const result = mergeSettings({
      durations: { work: 45 * 60, shortBreak: 10 * 60 },
      theme: "dark",
      autoStartBreaks: false,
    });
    expect(result.durations.work).toBe(45 * 60);
    expect(result.durations.shortBreak).toBe(10 * 60);
    expect(result.durations.longBreak).toBe(15 * 60);
    expect(result.theme).toBe("dark");
    expect(result.autoStartBreaks).toBe(false);
    expect(result.autoStartWork).toBe(true);
  });

  it("uses provided base when given", () => {
    const customBase: PomodoroSettings = {
      ...DEFAULT_POMODORO_SETTINGS,
      autoStartBreaks: false,
      autoStartWork: false,
    };
    const result = mergeSettings({}, customBase);
    expect(result.autoStartBreaks).toBe(false);
    expect(result.autoStartWork).toBe(false);
  });

  it("always produces valid settings", () => {
    const result = mergeSettings({
      durations: { work: -100, shortBreak: 99999 },
      theme: "invalid" as never,
    });
    expect(isValidSettings(result)).toBe(true);
  });
});
