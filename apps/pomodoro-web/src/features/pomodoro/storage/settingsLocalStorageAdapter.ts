import {
  isValidSettings,
  type PomodoroSettings,
  type SettingsStoragePort,
} from "@personal-platform/pomodoro-core";

const SETTINGS_KEY = "personal-platform:pomodoro-settings";

function readStoredSettings(): PomodoroSettings | null {
  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isValidSettings(parsed)) {
      localStorage.removeItem(SETTINGS_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(SETTINGS_KEY);
    return null;
  }
}

export const settingsLocalStorageAdapter: SettingsStoragePort = {
  load(): Promise<PomodoroSettings | null> {
    return Promise.resolve(readStoredSettings());
  },

  save(settings: PomodoroSettings): Promise<void> {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return Promise.resolve();
  },

  clear(): Promise<void> {
    localStorage.removeItem(SETTINGS_KEY);
    return Promise.resolve();
  },
};
