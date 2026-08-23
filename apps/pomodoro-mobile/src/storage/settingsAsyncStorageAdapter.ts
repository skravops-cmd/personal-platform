import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  isValidSettings,
  type PomodoroSettings,
  type SettingsStoragePort,
} from "@personal-platform/pomodoro-core";

const SETTINGS_KEY = "personal-platform:pomodoro-settings";

export const settingsAsyncStorageAdapter: SettingsStoragePort = {
  async load() {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!isValidSettings(parsed)) {
        await AsyncStorage.removeItem(SETTINGS_KEY);
        return null;
      }

      return parsed;
    } catch {
      await AsyncStorage.removeItem(SETTINGS_KEY);
      return null;
    }
  },

  async save(settings) {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  async clear() {
    await AsyncStorage.removeItem(SETTINGS_KEY);
  },
};
