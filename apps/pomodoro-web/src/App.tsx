import { useState } from "react";
import { SettingsProvider } from "./features/pomodoro/hooks/useSettings";
import { ThemeProvider } from "./features/pomodoro/hooks/useTheme";
import { PomodoroPage } from "./features/pomodoro/PomodoroPage";
import { SettingsPage } from "./features/pomodoro/SettingsPage";

type View = "timer" | "settings";

function AppContent() {
  const [view, setView] = useState<View>("timer");

  if (view === "settings") {
    return <SettingsPage onBack={() => setView("timer")} />;
  }

  return <PomodoroPage onNavigateSettings={() => setView("settings")} />;
}

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
