import { useCallback } from "react";
import type { PomodoroMode } from "@personal-platform/pomodoro-core";
import { POMODORO_MODE_LABELS } from "@personal-platform/pomodoro-core";
import type { PomodoroSettings, PomodoroSettingsInput, ThemeSetting } from "@personal-platform/pomodoro-core";
import { DURATION_BOUNDS } from "@personal-platform/pomodoro-core";

type SettingsFormProps = {
  settings: PomodoroSettings;
  onUpdate: (partial: PomodoroSettingsInput) => void;
  onBack: () => void;
};

const DURATION_MODES: PomodoroMode[] = ["work", "shortBreak", "longBreak"];

const THEME_OPTIONS: { value: ThemeSetting; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function DurationField({
  mode,
  value,
  onChange,
}: {
  mode: PomodoroMode;
  value: number;
  onChange: (minutes: number) => void;
}) {
  const bounds = DURATION_BOUNDS[mode];
  const minutes = Math.round(value / 60);
  const minMinutes = Math.ceil(bounds.min / 60);
  const maxMinutes = Math.floor(bounds.max / 60);

  return (
    <div className="settings-field">
      <label className="settings-label" htmlFor={`duration-${mode}`}>
        {POMODORO_MODE_LABELS[mode]}
      </label>
      <div className="settings-duration-row">
        <input
          id={`duration-${mode}`}
          type="range"
          min={minMinutes}
          max={maxMinutes}
          value={minutes}
          onChange={(e) => onChange(Number(e.target.value))}
          className="settings-range"
        />
        <span className="settings-duration-value">{minutes} min</span>
      </div>
    </div>
  );
}

function ToggleField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="settings-field settings-field--row">
      <label className="settings-label" htmlFor={id}>
        {label}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        className={`settings-toggle${checked ? " settings-toggle--on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="settings-toggle-thumb" />
      </button>
    </div>
  );
}

export function SettingsForm({
  settings,
  onUpdate,
  onBack,
}: SettingsFormProps) {
  const handleDurationChange = useCallback(
    (mode: PomodoroMode, minutes: number) => {
      onUpdate({ durations: { [mode]: minutes * 60 } });
    },
    [onUpdate],
  );

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button
          className="settings-back"
          onClick={onBack}
          aria-label="Back to timer"
        >
          ← Timer
        </button>
        <h1 className="settings-title">Settings</h1>
      </header>

      <section className="settings-group">
        <h2 className="settings-group-title">Durations</h2>
        {DURATION_MODES.map((mode) => (
          <DurationField
            key={mode}
            mode={mode}
            value={settings.durations[mode]}
            onChange={(minutes) => handleDurationChange(mode, minutes)}
          />
        ))}
      </section>

      <section className="settings-group">
        <h2 className="settings-group-title">Behavior</h2>
        <ToggleField
          id="auto-start-breaks"
          label="Auto-start breaks"
          checked={settings.autoStartBreaks}
          onChange={(v) => onUpdate({ autoStartBreaks: v })}
        />
        <ToggleField
          id="auto-start-work"
          label="Auto-start work"
          checked={settings.autoStartWork}
          onChange={(v) => onUpdate({ autoStartWork: v })}
        />
      </section>

      <section className="settings-group">
        <h2 className="settings-group-title">Appearance</h2>
        <div className="settings-theme-row">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`settings-theme-btn${settings.theme === opt.value ? " settings-theme-btn--active" : ""}`}
              onClick={() => onUpdate({ theme: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
