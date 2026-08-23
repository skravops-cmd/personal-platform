import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_POMODORO_SETTINGS,
  mergeSettings,
  type PomodoroSettings,
  type PomodoroSettingsInput,
  type SettingsStoragePort,
} from "@personal-platform/pomodoro-core";

import { settingsLocalStorageAdapter } from "../storage/settingsLocalStorageAdapter";

type SettingsContextValue = {
  settings: PomodoroSettings;
  loaded: boolean;
  updateSettings: (partial: PomodoroSettingsInput) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

type SettingsProviderProps = {
  storage?: SettingsStoragePort;
  children: React.ReactNode;
};

export function SettingsProvider({
  storage = settingsLocalStorageAdapter,
  children,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(
    DEFAULT_POMODORO_SETTINGS,
  );
  const [loaded, setLoaded] = useState(false);
  const storageRef = useRef(storage);
  storageRef.current = storage;

  // Load persisted settings on mount
  useEffect(() => {
    let cancelled = false;

    storageRef.current.load().then((stored) => {
      if (cancelled) return;

      if (stored) {
        setSettings(stored);
      }

      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist settings on change (after loaded)
  useEffect(() => {
    if (!loaded) return;
    void storageRef.current.save(settings);
  }, [settings, loaded]);

  const updateSettings = useCallback(
    (partial: PomodoroSettingsInput) => {
      setSettings((current) => mergeSettings(partial, current));
    },
    [],
  );

  return (
    <SettingsContext.Provider value={{ settings, loaded, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return ctx;
}
