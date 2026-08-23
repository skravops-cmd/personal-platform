import {
  Card,
} from "@personal-platform/ui";

import { PomodoroTimer } from "./components/PomodoroTimer";
import { TimerControls } from "./components/TimerControls";
import { SessionCounter } from "./components/SessionCounter";
import { TimerModeSelector } from "./components/TimerModeSelector";
import { usePomodoro } from "./hooks/usePomodoro";
import { useNotifications } from "./hooks/useNotifications";
import { useSettings } from "./hooks/useSettings";

type PomodoroPageProps = {
  onNavigateSettings?: () => void;
};

export function PomodoroPage({ onNavigateSettings }: PomodoroPageProps) {
  const { settings } = useSettings();
  const pomodoro = usePomodoro(undefined, settings.durations, {
    autoStartBreaks: settings.autoStartBreaks,
    autoStartWork: settings.autoStartWork,
  });

  useNotifications(
    pomodoro.isRunning,
    pomodoro.minutes * 60 + pomodoro.seconds,
  );

  return (
    <main className="pomodoro-page">
      <header className="pomodoro-header">
        <div className="pomodoro-title-row">
          <h1>Pomodoro</h1>
          {onNavigateSettings && (
            <button
              className="settings-gear"
              onClick={onNavigateSettings}
              aria-label="Settings"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <Card
        className={
          `timer-card${!pomodoro.loaded ? " timer-card--loading" : ""}`
        }
      >
        <TimerModeSelector
          mode={pomodoro.mode}
          disabled={pomodoro.isRunning}
          onChange={pomodoro.setMode}
        />

        <PomodoroTimer
          minutes={pomodoro.minutes}
          seconds={pomodoro.seconds}
          mode={pomodoro.mode}
          completedSessions={pomodoro.completedSessions}
          isRunning={pomodoro.isRunning}
          justCompleted={pomodoro.justCompleted}
        />

        <TimerControls
          isRunning={pomodoro.isRunning}
          onStart={pomodoro.start}
          onPause={pomodoro.pause}
          onReset={pomodoro.reset}
        />

        <SessionCounter
          completedSessions={
            pomodoro.completedSessions
          }
        />
      </Card>
    </main>
  );
}
