import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet } from "react-native";
import {
  getNextMode,
  MODE_VERBS,
  POMODORO_MODE_LABELS,
  type PomodoroMode,
} from "@personal-platform/pomodoro-core";
import { fontSize, fontWeight, spacing } from "@personal-platform/design-tokens/tokens";
import { useThemeColors } from "../hooks/useThemeColors";

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
  const c = useThemeColors();
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

  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const accessibilityLabel = showCompleted
    ? `Session complete, taking ${nextLabel}`
    : `${POMODORO_MODE_LABELS[mode]}, ${minutes} minutes ${seconds} seconds remaining`;

  return (
    <>
      <Text
        style={[
          styles.timer,
          { color: justCompleted ? c.success : c.text },
        ]}
        accessibilityRole="timer"
        accessibilityLabel={accessibilityLabel}
      >
        {display}
      </Text>
      <Text style={[styles.status, { color: isRunning ? c.text : c.textMuted }]}>{statusText}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: fontSize.timer,
    fontWeight: fontWeight.bold,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
    marginBottom: spacing[2],
  },
  status: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: "center",
    marginBottom: spacing[6],
  },
});
