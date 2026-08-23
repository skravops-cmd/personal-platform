import { POMODORO_DURATIONS } from "./constants";
import { getNextMode } from "./getNextMode";
import type { PomodoroMode } from "./types";

export type TimerState = {
  mode: PomodoroMode;
  remainingSeconds: number;
  completedSessions: number;
  lastUpdatedAt: number;
};

export type TimerTickResult = TimerState & {
  justCompleted: boolean;
};

function computeRemaining(
  remainingSeconds: number,
  elapsedSeconds: number,
): number {
  return remainingSeconds - elapsedSeconds;
}

function completeTimer(
  state: TimerState,
  now: number,
  elapsedSeconds: number,
  durations: Record<PomodoroMode, number>,
): TimerState {
  const completedSessions =
    state.mode === "work"
      ? state.completedSessions + 1
      : state.completedSessions;

  const nextMode = getNextMode(state.mode, completedSessions);
  const carry = Math.abs(
    computeRemaining(state.remainingSeconds, elapsedSeconds),
  );

  return {
    mode: nextMode,
    remainingSeconds: durations[nextMode] + carry,
    completedSessions,
    lastUpdatedAt: now,
  };
}

export function resolveTimerTick(
  state: TimerState,
  now: number,
  durations: Record<PomodoroMode, number> = POMODORO_DURATIONS,
): TimerTickResult {
  const elapsedSeconds = Math.floor(
    (now - state.lastUpdatedAt) / 1000,
  );

  if (elapsedSeconds <= 0) {
    return { ...state, justCompleted: false };
  }

  const remaining = computeRemaining(
    state.remainingSeconds,
    elapsedSeconds,
  );

  if (remaining <= 0) {
    const updated = completeTimer(state, now, elapsedSeconds, durations);
    return { ...updated, justCompleted: true };
  }

  return {
    ...state,
    remainingSeconds: remaining,
    lastUpdatedAt: state.lastUpdatedAt + elapsedSeconds * 1000,
    justCompleted: false,
  };
}

export function restoreTimerState(
  state: TimerState,
  now: number,
  durations: Record<PomodoroMode, number> = POMODORO_DURATIONS,
): TimerState {
  const elapsedSeconds = Math.floor(
    (now - state.lastUpdatedAt) / 1000,
  );

  if (elapsedSeconds <= 0) {
    return state;
  }

  const remaining = computeRemaining(
    state.remainingSeconds,
    elapsedSeconds,
  );

  if (remaining <= 0) {
    return completeTimer(state, now, elapsedSeconds, durations);
  }

  return {
    ...state,
    remainingSeconds: remaining,
    lastUpdatedAt: state.lastUpdatedAt + elapsedSeconds * 1000,
  };
}

/**
 * Restore timer state from persisted data, reconciling elapsed time only when
 * the timer was running at the time it was saved.
 *
 * When `wasRunning` is false or undefined (legacy data), the stored
 * `remainingSeconds` is treated as accurate and no time is subtracted. This
 * prevents the "pause-restart" bug where a paused timer loses time after app
 * restart.
 *
 * When `wasRunning` is true, delegates to `restoreTimerState` which subtracts
 * elapsed wall-clock time from `remainingSeconds`.
 */
export function reconcileOnRestore(
  state: TimerState & { wasRunning?: boolean },
  now: number,
  durations: Record<PomodoroMode, number> = POMODORO_DURATIONS,
): TimerState {
  if (!state.wasRunning) {
    // Timer was paused (or legacy data without the flag). The stored
    // remainingSeconds is accurate — anchor lastUpdatedAt to now so the next
    // tick starts fresh without subtracting idle time.
    return {
      mode: state.mode,
      remainingSeconds: state.remainingSeconds,
      completedSessions: state.completedSessions,
      lastUpdatedAt: now,
    };
  }

  // Timer was running — reconcile elapsed wall-clock time.
  return restoreTimerState(state, now, durations);
}
