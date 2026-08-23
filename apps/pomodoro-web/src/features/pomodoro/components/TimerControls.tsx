import { Button } from "@personal-platform/ui";

type TimerControlsProps = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="timer-controls">
      {isRunning ? (
        <Button onClick={onPause}>Pause</Button>
      ) : (
        <Button onClick={onStart}>Start</Button>
      )}

      <Button variant="secondary" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
