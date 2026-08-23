import { SettingsProvider } from "../src/hooks/useSettings";
import { ThemeContainer } from "../src/components/ThemeContainer";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ThemeContainer />
    </SettingsProvider>
  );
}
