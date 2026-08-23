import { describe, expect, it } from "vitest";

import {
  reconcileOnRestore,
  resolveTimerTick,
  restoreTimerState,
} from "./resolveTimerTick";
import { POMODORO_DURATIONS } from "./constants";
import type { TimerState } from "./resolveTimerTick";

function workState(
  overrides: Partial<TimerState> = {},
): TimerState {
  return {
    mode: "work",
    remainingSeconds: POMODORO_DURATIONS.work,
    completedSessions: 0,
    lastUpdatedAt: 1000,
    ...overrides,
  };
}

describe("resolveTimerTick", () => {
  it("returns unchanged state when no time has elapsed", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const result = resolveTimerTick(state, 1000);
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.work,
    );
    expect(result.justCompleted).toBe(false);
  });

  it("returns unchanged state when less than one second elapsed", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const result = resolveTimerTick(state, 1500);
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.work,
    );
    expect(result.justCompleted).toBe(false);
  });

  it("decrements remaining seconds by elapsed whole seconds", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const result = resolveTimerTick(state, 4000);
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.work - 3,
    );
    expect(result.lastUpdatedAt).toBe(4000);
    expect(result.justCompleted).toBe(false);
  });

  it("snaps lastUpdatedAt to whole-second boundary", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const result = resolveTimerTick(state, 3750);
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.work - 2,
    );
    expect(result.lastUpdatedAt).toBe(3000);
    expect(result.justCompleted).toBe(false);
  });

  it("completes timer and transitions to short break after work", () => {
    const state = workState({
      remainingSeconds: 1,
      lastUpdatedAt: 1000,
    });
    const result = resolveTimerTick(state, 2000);
    expect(result.mode).toBe("shortBreak");
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.shortBreak,
    );
    expect(result.completedSessions).toBe(1);
    expect(result.justCompleted).toBe(true);
  });

  it("carries over fractional second on completion", () => {
    const state = workState({
      remainingSeconds: 1,
      lastUpdatedAt: 1000,
    });
    const result = resolveTimerTick(state, 3000);
    expect(result.mode).toBe("shortBreak");
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.shortBreak + 1,
    );
    expect(result.justCompleted).toBe(true);
  });

  it("transitions to long break after fourth work session", () => {
    const state = workState({
      remainingSeconds: 1,
      completedSessions: 3,
      lastUpdatedAt: 1000,
    });
    const result = resolveTimerTick(state, 2000);
    expect(result.mode).toBe("longBreak");
    expect(result.completedSessions).toBe(4);
    expect(result.justCompleted).toBe(true);
  });

  it("completes short break and transitions back to work", () => {
    const state: TimerState = {
      mode: "shortBreak",
      remainingSeconds: 1,
      completedSessions: 2,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 2000);
    expect(result.mode).toBe("work");
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.work,
    );
    expect(result.completedSessions).toBe(2);
    expect(result.justCompleted).toBe(true);
  });

  it("completes long break and transitions back to work", () => {
    const state: TimerState = {
      mode: "longBreak",
      remainingSeconds: 1,
      completedSessions: 4,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 2000);
    expect(result.mode).toBe("work");
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.work,
    );
    expect(result.justCompleted).toBe(true);
  });

  it("does not increment completedSessions for break modes", () => {
    const state: TimerState = {
      mode: "shortBreak",
      remainingSeconds: 1,
      completedSessions: 3,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 2000);
    expect(result.completedSessions).toBe(3);
  });
});

describe("restoreTimerState", () => {
  it("returns unchanged state when no time has elapsed", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const result = restoreTimerState(state, 1000);
    expect(result).toEqual(state);
  });

  it("returns unchanged state when less than one second elapsed", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const result = restoreTimerState(state, 500);
    expect(result).toEqual(state);
  });

  it("decrements remaining seconds for elapsed time", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const result = restoreTimerState(state, 60000);
    expect(result.remainingSeconds).toBe(
      POMODORO_DURATIONS.work - 59,
    );
    expect(result.lastUpdatedAt).toBe(60000);
  });

  it("transitions to next mode when timer would have completed", () => {
    const state = workState({ lastUpdatedAt: 1000 });
    const futureTime = 1000 + (POMODORO_DURATIONS.work + 1) * 1000;
    const result = restoreTimerState(state, futureTime);
    expect(result.mode).toBe("shortBreak");
    expect(result.completedSessions).toBe(1);
  });

  it("completes immediately when remaining seconds is zero and time has elapsed", () => {
    const state = workState({
      remainingSeconds: 0,
      lastUpdatedAt: 1000,
    });
    const result = restoreTimerState(state, 5000);
    expect(result.mode).toBe("shortBreak");
    expect(result.completedSessions).toBe(1);
  });
});

const CUSTOM_DURATIONS: Record<PomodoroMode, number> = {
  work: 45 * 60,
  shortBreak: 10 * 60,
  longBreak: 20 * 60,
};

describe("resolveTimerTick with custom durations", () => {
  it("uses custom work duration as initial remaining", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: CUSTOM_DURATIONS.work,
      completedSessions: 0,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 4000, CUSTOM_DURATIONS);
    expect(result.remainingSeconds).toBe(CUSTOM_DURATIONS.work - 3);
  });

  it("transitions to short break using custom shortBreak duration", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 0,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 2000, CUSTOM_DURATIONS);
    expect(result.mode).toBe("shortBreak");
    expect(result.remainingSeconds).toBe(CUSTOM_DURATIONS.shortBreak);
    expect(result.justCompleted).toBe(true);
  });

  it("transitions to long break using custom longBreak duration", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 3,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 2000, CUSTOM_DURATIONS);
    expect(result.mode).toBe("longBreak");
    expect(result.remainingSeconds).toBe(CUSTOM_DURATIONS.longBreak);
    expect(result.justCompleted).toBe(true);
  });

  it("transitions back to work using custom work duration", () => {
    const state: TimerState = {
      mode: "shortBreak",
      remainingSeconds: 1,
      completedSessions: 2,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 2000, CUSTOM_DURATIONS);
    expect(result.mode).toBe("work");
    expect(result.remainingSeconds).toBe(CUSTOM_DURATIONS.work);
    expect(result.justCompleted).toBe(true);
  });

  it("carries over excess time using custom durations", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 0,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 3000, CUSTOM_DURATIONS);
    expect(result.mode).toBe("shortBreak");
    expect(result.remainingSeconds).toBe(CUSTOM_DURATIONS.shortBreak + 1);
  });

  it("falls back to POMODORO_DURATIONS when no durations provided", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 0,
      lastUpdatedAt: 1000,
    };
    const result = resolveTimerTick(state, 2000);
    expect(result.mode).toBe("shortBreak");
    expect(result.remainingSeconds).toBe(POMODORO_DURATIONS.shortBreak);
  });
});

describe("restoreTimerState with custom durations", () => {
  it("transitions to next mode using custom durations", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 0,
      lastUpdatedAt: 1000,
    };
    const result = restoreTimerState(state, 2000, CUSTOM_DURATIONS);
    expect(result.mode).toBe("shortBreak");
    expect(result.remainingSeconds).toBe(CUSTOM_DURATIONS.shortBreak);
    expect(result.completedSessions).toBe(1);
  });

  it("falls back to POMODORO_DURATIONS when no durations provided", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: POMODORO_DURATIONS.work,
      completedSessions: 0,
      lastUpdatedAt: 1000,
    };
    const futureTime = 1000 + (POMODORO_DURATIONS.work + 1) * 1000;
    const result = restoreTimerState(state, futureTime);
    expect(result.mode).toBe("shortBreak");
    expect(result.completedSessions).toBe(1);
  });
});

describe("reconcileOnRestore", () => {
  it("does not subtract elapsed time when wasRunning is false", () => {
    const state: TimerState & { wasRunning: boolean } = {
      mode: "work",
      remainingSeconds: 1200,
      completedSessions: 0,
      lastUpdatedAt: 1000,
      wasRunning: false,
    };
    const result = reconcileOnRestore(state, 1000 + 600_000);
    expect(result.remainingSeconds).toBe(1200);
    expect(result.mode).toBe("work");
    expect(result.completedSessions).toBe(0);
  });

  it("does not subtract elapsed time when wasRunning is undefined (legacy data)", () => {
    const state: TimerState = {
      mode: "work",
      remainingSeconds: 1200,
      completedSessions: 0,
      lastUpdatedAt: 1000,
    };
    const result = reconcileOnRestore(state, 1000 + 600_000);
    expect(result.remainingSeconds).toBe(1200);
    expect(result.mode).toBe("work");
  });

  it("anchors lastUpdatedAt to now when paused", () => {
    const state: TimerState & { wasRunning: boolean } = {
      mode: "work",
      remainingSeconds: 1200,
      completedSessions: 0,
      lastUpdatedAt: 1000,
      wasRunning: false,
    };
    const now = 1000 + 600_000;
    const result = reconcileOnRestore(state, now);
    expect(result.lastUpdatedAt).toBe(now);
  });

  it("subtracts elapsed time when wasRunning is true", () => {
    const state: TimerState & { wasRunning: boolean } = {
      mode: "work",
      remainingSeconds: 1200,
      completedSessions: 0,
      lastUpdatedAt: 1000,
      wasRunning: true,
    };
    const result = reconcileOnRestore(state, 1000 + 300_000);
    expect(result.remainingSeconds).toBe(1200 - 300);
  });

  it("transitions to next mode when wasRunning is true and timer would have completed", () => {
    const state: TimerState & { wasRunning: boolean } = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 0,
      lastUpdatedAt: 1000,
      wasRunning: true,
    };
    const result = reconcileOnRestore(state, 1000 + 5000);
    expect(result.mode).toBe("shortBreak");
    expect(result.completedSessions).toBe(1);
    expect(result.remainingSeconds).toBe(POMODORO_DURATIONS.shortBreak + 4);
  });

  it("does not transition when wasRunning is false even if enough time has elapsed", () => {
    const state: TimerState & { wasRunning: boolean } = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 0,
      lastUpdatedAt: 1000,
      wasRunning: false,
    };
    const result = reconcileOnRestore(state, 1000 + 600_000);
    expect(result.mode).toBe("work");
    expect(result.completedSessions).toBe(0);
    expect(result.remainingSeconds).toBe(1);
  });

  it("uses custom durations when wasRunning is true", () => {
    const state: TimerState & { wasRunning: boolean } = {
      mode: "work",
      remainingSeconds: 1,
      completedSessions: 0,
      lastUpdatedAt: 1000,
      wasRunning: true,
    };
    const result = reconcileOnRestore(state, 2000, CUSTOM_DURATIONS);
    expect(result.mode).toBe("shortBreak");
    expect(result.remainingSeconds).toBe(CUSTOM_DURATIONS.shortBreak);
  });

  it("preserves completedSessions when wasRunning is false", () => {
    const state: TimerState & { wasRunning: boolean } = {
      mode: "work",
      remainingSeconds: 600,
      completedSessions: 3,
      lastUpdatedAt: 1000,
      wasRunning: false,
    };
    const result = reconcileOnRestore(state, 1000 + 600_000);
    expect(result.completedSessions).toBe(3);
  });
});
