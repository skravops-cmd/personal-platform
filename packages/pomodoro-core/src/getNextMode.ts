import type { PomodoroMode } from "./types";

export function getNextMode(
  mode: PomodoroMode,
  completedSessions: number,
): PomodoroMode {
  if (mode !== "work") {
    return "work";
  }

  return completedSessions % 4 === 0
    ? "longBreak"
    : "shortBreak";
}
