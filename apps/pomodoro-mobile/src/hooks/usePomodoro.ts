import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import {
  POMODORO_DURATIONS,
  reconcileOnRestore,
  resolveTimerTick,
  type PomodoroMode,
  type TimerState,
} from "@personal-platform/pomodoro-core";
import type { StoragePort } from "@personal-platform/pomodoro-core";
import { asyncStorageAdapter } from "../storage/asyncStorageAdapter";

type PomodoroViewModel = {
  loaded: boolean;
  mode: PomodoroMode;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  completedSessions: number;
  justCompleted: boolean;
  reconciled: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setMode: (mode: PomodoroMode) => void;
};

type InternalState = TimerState & {
  isRunning: boolean;
};

const COMPLETED_FEEDBACK_MS = 1500;

function buildDefaultState(
  durations: Record<PomodoroMode, number>,
): InternalState {
  return {
    mode: "work",
    remainingSeconds: durations.work,
    completedSessions: 0,
    lastUpdatedAt: Date.now(),
    isRunning: false,
  };
}

export function usePomodoro(
  storage: StoragePort = asyncStorageAdapter,
  durations: Record<PomodoroMode, number> = POMODORO_DURATIONS,
  options?: { autoStartBreaks?: boolean; autoStartWork?: boolean },
): PomodoroViewModel {
  const [state, setState] = useState<InternalState>(() =>
    buildDefaultState(durations),
  );
  const [loaded, setLoaded] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [reconciled, setReconciled] = useState(false);
  const completedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageRef = useRef(storage);
  storageRef.current = storage;
  const durationsRef = useRef(durations);
  durationsRef.current = durations;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const prevModeRef = useRef<PomodoroMode>(buildDefaultState(durations).mode);
  const reconciledVersionRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    storageRef.current.load().then((stored) => {
      if (cancelled) {
        return;
      }

      if (stored) {
        const restored = reconcileOnRestore(stored, Date.now(), durationsRef.current);
        const prevMode = stored.mode;
        setState((current) => ({
          ...current,
          ...restored,
        }));
        prevModeRef.current = prevMode;
        reconciledVersionRef.current += 1;
        setReconciled(true);
      }

      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const stateToSave = {
      mode: state.mode,
      remainingSeconds: state.remainingSeconds,
      completedSessions: state.completedSessions,
      lastUpdatedAt: state.lastUpdatedAt,
      wasRunning: state.isRunning,
    };
    void storageRef.current.save(stateToSave);
  }, [state, loaded]);

  // Clear justCompleted after feedback window
  useEffect(() => {
    if (!justCompleted) {
      return;
    }

    completedTimer.current = setTimeout(() => {
      setJustCompleted(false);
    }, COMPLETED_FEEDBACK_MS);

    return () => {
      if (completedTimer.current) {
        clearTimeout(completedTimer.current);
      }
    };
  }, [justCompleted]);

  /** Core reconciliation tick — shared by the 250ms interval and the AppState
   *  handler. Computes elapsed time via resolveTimerTick and updates React
   *  state. */
  const reconcileTick = useCallback((now: number) => {
    setState((current) => {
      if (!current.isRunning) {
        return current;
      }

      const timerState: TimerState = {
        mode: current.mode,
        remainingSeconds: current.remainingSeconds,
        completedSessions: current.completedSessions,
        lastUpdatedAt: current.lastUpdatedAt,
      };

      const result = resolveTimerTick(timerState, now, durationsRef.current);

      if (result.justCompleted) {
        setJustCompleted(true);
      }

      return {
        ...current,
        mode: result.mode,
        remainingSeconds: result.remainingSeconds,
        completedSessions: result.completedSessions,
        lastUpdatedAt: result.lastUpdatedAt,
        isRunning: !result.justCompleted,
      };
    });
  }, []);

  const start = useCallback(() => {
    setState((current) => ({
      ...current,
      isRunning: true,
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  const pause = useCallback(() => {
    setState((current) => ({
      ...current,
      isRunning: false,
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  const reset = useCallback(() => {
    setState((current) => ({
      ...current,
      remainingSeconds: durationsRef.current[current.mode],
      isRunning: false,
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  const setMode = useCallback((mode: PomodoroMode) => {
    setState((current) => ({
      ...current,
      mode,
      remainingSeconds: durationsRef.current[mode],
      isRunning: false,
      lastUpdatedAt: Date.now(),
    }));
  }, []);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    const interval = setInterval(() => {
      reconcileTick(Date.now());
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [state.isRunning]);

  // Reconcile immediately when the app returns to foreground. On both iOS and
  // Android, setInterval may be suspended while backgrounded. This handler
  // ensures the timer catches up as soon as the user sees it again.
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active" && state.isRunning) {
        reconcileTick(Date.now());
      }
    };

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      sub.remove();
    };
  }, [state.isRunning]);

  // Auto-start after background reconciliation.
  useEffect(() => {
    if (!loaded || !reconciled || state.isRunning) return;

    const opts = optionsRef.current;
    const modeChanged = state.mode !== prevModeRef.current;

    if (modeChanged) {
      const isBreak = state.mode === "shortBreak" || state.mode === "longBreak";
      if (isBreak && opts?.autoStartBreaks) {
        setTimeout(() => start(), 0);
      } else if (state.mode === "work" && opts?.autoStartWork) {
        setTimeout(() => start(), 0);
      }
    }

    prevModeRef.current = state.mode;
  }, [loaded, reconciled, state.mode, state.isRunning, start]);

  const minutes = Math.floor(state.remainingSeconds / 60);
  const seconds = state.remainingSeconds % 60;

  return {
    loaded,
    mode: state.mode,
    minutes,
    seconds,
    isRunning: state.isRunning,
    completedSessions: state.completedSessions,
    justCompleted,
    reconciled,
    start,
    pause,
    reset,
    setMode,
  };
}
