import type {
  StoragePort,
  StoredPomodoroState,
} from "@personal-platform/pomodoro-core";

const STORAGE_KEY = "personal-platform:pomodoro";

function isStoredPomodoroState(
  value: unknown,
): value is StoredPomodoroState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.mode === "string" &&
    typeof obj.remainingSeconds === "number" &&
    typeof obj.completedSessions === "number" &&
    typeof obj.lastUpdatedAt === "number"
  );
}

function normalizeStoredState(raw: StoredPomodoroState): StoredPomodoroState {
  return {
    ...raw,
    wasRunning: typeof raw.wasRunning === "boolean" ? raw.wasRunning : false,
  };
}

function readStoredState(): StoredPomodoroState | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isStoredPomodoroState(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return normalizeStoredState(parsed);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export const localStorageAdapter: StoragePort = {
  load() {
    return Promise.resolve(readStoredState());
  },

  save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return Promise.resolve();
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    return Promise.resolve();
  },
};
