import {
  POMODORO_MODE_LABELS,
  type PomodoroMode,
} from "@personal-platform/pomodoro-core";

type TimerModeSelectorProps = {
  mode: PomodoroMode;
  disabled?: boolean;
  onChange: (mode: PomodoroMode) => void;
};

const modes: PomodoroMode[] = [
  "work",
  "shortBreak",
  "longBreak",
];

export function TimerModeSelector({
  mode,
  disabled = false,
  onChange,
}: TimerModeSelectorProps) {
  return (
    <div
      className="timer-mode-selector"
      role="tablist"
      aria-label="Timer mode"
    >
      {modes.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={mode === item}
          disabled={disabled}
          className={
            item === mode
              ? "timer-mode timer-mode--active"
              : "timer-mode"
          }
          onClick={() => onChange(item)}
        >
          {POMODORO_MODE_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
