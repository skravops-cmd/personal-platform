import type { PomodoroMode } from "./types";

export const POMODORO_DURATIONS: Record<PomodoroMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const POMODORO_MODE_LABELS: Record<PomodoroMode, string> = {
  work: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export const MODE_VERBS: Record<PomodoroMode, string> = {
  work: "Focusing",
  shortBreak: "Resting",
  longBreak: "Resting",
};
