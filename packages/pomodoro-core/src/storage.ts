import type { PomodoroMode } from "./types";
import type { PomodoroSettings } from "./settings";

export type StoredPomodoroState = {
  mode: PomodoroMode;
  remainingSeconds: number;
  completedSessions: number;
  lastUpdatedAt: number;
  /** Whether the timer was running when this state was last saved. Undefined in
   *  legacy data is treated as false (paused), preventing incorrect elapsed-time
   *  reconciliation when a paused timer is restored after app restart. */
  wasRunning?: boolean;
};

export interface StoragePort {
  load(): Promise<StoredPomodoroState | null>;
  save(state: StoredPomodoroState): Promise<void>;
  clear(): Promise<void>;
}

export interface SettingsStoragePort {
  load(): Promise<PomodoroSettings | null>;
  save(settings: PomodoroSettings): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Platform-specific notification adapter. The core never schedules
 * notifications directly — it exposes this interface and lets each platform
 * provide an implementation suited to its OS capabilities.
 */
export interface NotificationPort {
  /** Schedule a local notification for when the current session completes. */
  scheduleCompletion(atTimestampMs: number): Promise<string | void>;
  /** Cancel a previously scheduled notification by its ID. */
  cancelScheduled(id: string | void): Promise<void>;
  /** Whether the platform can send notifications right now. */
  isAvailable(): boolean;
}
