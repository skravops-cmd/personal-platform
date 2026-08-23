import { useEffect, useRef, useState } from "react";
import {
  getNextMode,
  MODE_VERBS,
  POMODORO_MODE_LABELS,
  type PomodoroMode,
} from "@personal-platform/pomodoro-core";

type PomodoroTimerProps = {
  minutes: number;
  seconds: number;
  mode: PomodoroMode;
  completedSessions: number;
  isRunning: boolean;
  justCompleted?: boolean;
};

const COMPLETED_MESSAGE_MS = 2500;

export function PomodoroTimer({
  minutes,
  seconds,
  mode,
  completedSessions,
  isRunning,
  justCompleted,
}: PomodoroTimerProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const completedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (justCompleted) {
      setShowCompleted(true);
      completedTimer.current = setTimeout(() => {
        setShowCompleted(false);
      }, COMPLETED_MESSAGE_MS);
    }
    return () => {
      if (completedTimer.current) clearTimeout(completedTimer.current);
    };
  }, [justCompleted]);

  const nextMode = getNextMode(mode, completedSessions);
  const nextLabel = POMODORO_MODE_LABELS[nextMode];

  let statusText: string;
  if (showCompleted) {
    statusText = `Session complete \u2014 taking ${nextLabel}`;
  } else if (isRunning) {
    statusText = `${MODE_VERBS[mode]}...`;
  } else {
    statusText = POMODORO_MODE_LABELS[mode];
  }

  const ariaLabelText = showCompleted
    ? `Session complete, taking ${nextLabel}`
    : `${POMODORO_MODE_LABELS[mode]}, ${minutes} minutes ${seconds} seconds remaining`;

  return (
    <div className="timer-display">
      <div
        className={
          `pomodoro-timer${justCompleted ? " pomodoro-timer--completed" : ""}${isRunning ? " pomodoro-timer--running" : ""}`
        }
        role="timer"
        aria-label={ariaLabelText}
      >
        <span>{String(minutes).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
      <p className="timer-status">{statusText}</p>
      <TimerLiveRegion
        message={
          showCompleted
            ? `Session complete, taking ${nextLabel}`
            : isRunning
              ? `${POMODORO_MODE_LABELS[mode]} started`
              : ""
        }
      />
    </div>
  );
}

/**
 * Visually-hidden region that announces important state changes
 * to screen readers without cluttering every tick.
 */
function TimerLiveRegion({ message }: { message: string }) {
  return (
    <div
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
