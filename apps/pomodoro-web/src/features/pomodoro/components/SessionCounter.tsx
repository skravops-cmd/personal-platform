type SessionCounterProps = {
  completedSessions: number;
};

export function SessionCounter({
  completedSessions,
}: SessionCounterProps) {
  return (
    <p className="session-counter">
      Sessions completed: {completedSessions}
    </p>
  );
}
