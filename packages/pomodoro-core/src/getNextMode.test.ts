import { describe, expect, it } from "vitest";

import { getNextMode } from "./getNextMode";
import { POMODORO_DURATIONS } from "./constants";

describe("POMODORO_DURATIONS", () => {
  it("has a 25 minute work session", () => {
    expect(POMODORO_DURATIONS.work).toBe(25 * 60);
  });

  it("has a 5 minute short break", () => {
    expect(POMODORO_DURATIONS.shortBreak).toBe(5 * 60);
  });

  it("has a 15 minute long break", () => {
    expect(POMODORO_DURATIONS.longBreak).toBe(15 * 60);
  });
});

describe("getNextMode", () => {
  it("starts a short break after the first work session", () => {
    expect(getNextMode("work", 1)).toBe("shortBreak");
  });

  it("starts a short break after the second work session", () => {
    expect(getNextMode("work", 2)).toBe("shortBreak");
  });

  it("starts a short break after the third work session", () => {
    expect(getNextMode("work", 3)).toBe("shortBreak");
  });

  it("starts a long break after the fourth work session", () => {
    expect(getNextMode("work", 4)).toBe("longBreak");
  });

  it("returns to work after a short break", () => {
    expect(getNextMode("shortBreak", 1)).toBe("work");
  });

  it("returns to work after a long break", () => {
    expect(getNextMode("longBreak", 4)).toBe("work");
  });
});
