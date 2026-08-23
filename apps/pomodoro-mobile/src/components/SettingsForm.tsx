import { useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import type { PomodoroMode, PomodoroSettings, PomodoroSettingsInput, ThemeSetting } from "@personal-platform/pomodoro-core";
import { POMODORO_MODE_LABELS, DURATION_BOUNDS } from "@personal-platform/pomodoro-core";
import { fontSize, fontWeight, spacing, radii } from "@personal-platform/design-tokens/tokens";
import { useThemeColors } from "../hooks/useThemeColors";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SettingsFormProps = {
  settings: PomodoroSettings;
  onUpdate: (partial: PomodoroSettingsInput) => void;
};

const DURATION_MODES: PomodoroMode[] = ["work", "shortBreak", "longBreak"];

const THEME_OPTIONS: { value: ThemeSetting; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const MINUTES_STEP = 5;

function DurationField({
  mode,
  value,
  onChange,
}: {
  mode: PomodoroMode;
  value: number;
  onChange: (minutes: number) => void;
}) {
  const c = useThemeColors();
  const bounds = DURATION_BOUNDS[mode];
  const minutes = Math.round(value / 60);
  const minMinutes = Math.ceil(bounds.min / 60);
  const maxMinutes = Math.floor(bounds.max / 60);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: c.text }]}>{POMODORO_MODE_LABELS[mode]}</Text>
      <View style={styles.durationRow}>
        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: c.surfaceSubtle }]}
          onPress={() => onChange(Math.max(minMinutes, minutes - MINUTES_STEP))}
          disabled={minutes <= minMinutes}
          accessibilityLabel={`Decrease ${POMODORO_MODE_LABELS[mode]} duration`}
        >
          <Text style={[styles.stepBtnText, { color: c.text }]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.durationValue, { color: c.text }]}>{minutes} min</Text>
        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: c.surfaceSubtle }]}
          onPress={() => onChange(Math.min(maxMinutes, minutes + MINUTES_STEP))}
          disabled={minutes >= maxMinutes}
          accessibilityLabel={`Increase ${POMODORO_MODE_LABELS[mode]} duration`}
        >
          <Text style={[styles.stepBtnText, { color: c.text }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const c = useThemeColors();

  return (
    <TouchableOpacity
      style={[styles.fieldRow, { borderBottomColor: c.border }]}
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.create(
          150,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity,
        ));
        onChange(!checked);
      }}
      activeOpacity={0.7}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
    >
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <View
        style={[
          styles.toggle,
          {
            backgroundColor: checked ? c.primary : c.surfaceSubtle,
            borderColor: checked ? c.primary : c.border,
          },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: checked ? c.primaryText : c.text,
            },
            checked && styles.toggleThumbOn,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

export function SettingsForm({ settings, onUpdate }: SettingsFormProps) {
  const c = useThemeColors();

  const handleDurationChange = useCallback(
    (mode: PomodoroMode, minutes: number) => {
      onUpdate({ durations: { [mode]: minutes * 60 } });
    },
    [onUpdate],
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: c.text }]}>Settings</Text>

        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: c.primary }]}>Durations</Text>
          {DURATION_MODES.map((mode) => (
            <DurationField
              key={mode}
              mode={mode}
              value={settings.durations[mode]}
              onChange={(minutes) => handleDurationChange(mode, minutes)}
            />
          ))}
        </View>

        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: c.primary }]}>Behavior</Text>
          <ToggleField
            label="Auto-start breaks"
            checked={settings.autoStartBreaks}
            onChange={(v) => onUpdate({ autoStartBreaks: v })}
          />
          <ToggleField
            label="Auto-start work"
            checked={settings.autoStartWork}
            onChange={(v) => onUpdate({ autoStartWork: v })}
          />
          <ToggleField
            label="Haptic feedback"
            checked={settings.hapticFeedback}
            onChange={(v) => onUpdate({ hapticFeedback: v })}
          />
        </View>

        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: c.primary }]}>Appearance</Text>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.themeBtn,
                  settings.theme === opt.value
                    ? { backgroundColor: c.primary, borderColor: c.primary }
                    : { backgroundColor: c.surfaceSubtle, borderColor: c.border },
                ]}
                onPress={() => onUpdate({ theme: opt.value })}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.themeBtnText,
                    settings.theme === opt.value
                      ? { color: c.primaryText }
                      : { color: c.text },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing[6],
  },
  header: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[6],
  },
  group: {
    marginBottom: spacing[6],
  },
  groupTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.12,
    marginBottom: spacing[3],
    textTransform: "uppercase",
  },
  field: {
    marginBottom: spacing[4],
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  label: {
    fontSize: fontSize.md,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
    marginTop: spacing[2],
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  durationValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    minWidth: 60,
    textAlign: "center",
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  toggleThumbOn: {
    alignSelf: "flex-end",
  },
  themeRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  themeBtn: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: "center",
  },
  themeBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
