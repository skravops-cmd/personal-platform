import { useSettings } from "./hooks/useSettings";
import { SettingsForm } from "./components/SettingsForm";

type SettingsPageProps = {
  onBack: () => void;
};

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { settings, loaded, updateSettings } = useSettings();

  return (
    <main className="settings-page-wrapper">
      {loaded ? (
        <SettingsForm
          settings={settings}
          onUpdate={updateSettings}
          onBack={onBack}
        />
      ) : (
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
        </div>
      )}
    </main>
  );
}
