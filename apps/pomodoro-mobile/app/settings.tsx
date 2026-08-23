import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../src/hooks/useSettings";
import { useResolvedTheme } from "../src/hooks/useTheme";
import { useThemeColors } from "../src/hooks/useThemeColors";
import { SettingsForm } from "../src/components/SettingsForm";
import { fontSize, fontWeight, spacing } from "@personal-platform/design-tokens/tokens";

function SettingsContent() {
  const router = useRouter();
  const { settings, loaded, updateSettings } = useSettings();
  const theme = useResolvedTheme(settings.theme);
  const c = useThemeColors();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.backBtnText, { color: c.primary }]}>← Timer</Text>
        </TouchableOpacity>
      </View>
      {loaded && (
        <SettingsForm settings={settings} onUpdate={updateSettings} />
      )}
    </SafeAreaView>
  );
}

export default function SettingsScreen() {
  return <SettingsContent />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[1],
  },
  backBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
