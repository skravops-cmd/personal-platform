import { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { usePomodoro } from "../src/hooks/usePomodoro";
import { useNotifications } from "../src/hooks/useNotifications";
import { useSettings } from "../src/hooks/useSettings";
import { useResolvedTheme } from "../src/hooks/useTheme";
import { useThemeColors } from "../src/hooks/useThemeColors";
import { Card } from "../src/components/Card";
import { PomodoroTimer } from "../src/components/PomodoroTimer";
import { TimerModeSelector } from "../src/components/TimerModeSelector";
import { TimerControls } from "../src/components/TimerControls";
import { SessionCounter } from "../src/components/SessionCounter";
import { fontSize, fontWeight, spacing } from "@personal-platform/design-tokens/tokens";

function TimerContent() {
  const router = useRouter();
  const { settings } = useSettings();
  const theme = useResolvedTheme(settings.theme);
  const c = useThemeColors();
  const pomodoro = usePomodoro(undefined, settings.durations, {
    autoStartBreaks: settings.autoStartBreaks,
    autoStartWork: settings.autoStartWork,
  });

  useNotifications(
    pomodoro.isRunning,
    pomodoro.minutes * 60 + pomodoro.seconds,
  );

  useEffect(() => {
    if (pomodoro.justCompleted && settings.hapticFeedback) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [pomodoro.justCompleted, settings.hapticFeedback]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.page}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: c.text }]}>Pomodoro</Text>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={styles.settingsBtn}
              activeOpacity={0.7}
              accessibilityLabel="Settings"
            >
              <Text style={[styles.settingsBtnText, { color: c.primary }]}>Settings</Text>
            </TouchableOpacity>
          </View>

          <Card
            style={[
              styles.card,
              !pomodoro.loaded && styles.cardLoading,
            ]}
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
              completedSessions={pomodoro.completedSessions}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function TimerScreen() {
  return <TimerContent />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[8],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    marginBottom: spacing[8],
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  settingsBtn: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
  },
  settingsBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  cardLoading: {
    opacity: 0.6,
  },
});
