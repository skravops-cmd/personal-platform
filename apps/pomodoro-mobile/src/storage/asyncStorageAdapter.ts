import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const asyncStorageAdapter: StoragePort = {
  async load() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!isStoredPomodoroState(parsed)) {
        await AsyncStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return normalizeStoredState(parsed);
    } catch {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  async save(state) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  async clear() {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
