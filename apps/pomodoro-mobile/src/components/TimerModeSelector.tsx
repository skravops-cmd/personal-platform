import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  POMODORO_MODE_LABELS,
  type PomodoroMode,
} from "@personal-platform/pomodoro-core";
import { fontSize, fontWeight, radii, spacing } from "@personal-platform/design-tokens/tokens";
import { useThemeColors } from "../hooks/useThemeColors";

type TimerModeSelectorProps = {
  mode: PomodoroMode;
  disabled?: boolean;
  onChange: (mode: PomodoroMode) => void;
};

const modes: PomodoroMode[] = ["work", "shortBreak", "longBreak"];

export function TimerModeSelector({ mode, disabled = false, onChange }: TimerModeSelectorProps) {
  const c = useThemeColors();

  return (
    <View
      style={[styles.container, disabled && styles.containerDisabled]}
      accessibilityRole="tablist"
      accessibilityLabel="Timer mode"
    >
      {modes.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => onChange(item)}
          disabled={disabled}
          style={[
            styles.tab,
            item === mode && {
              backgroundColor: c.surfaceSubtle,
              borderBottomWidth: 2,
              borderBottomColor: c.primary,
            },
          ]}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityLabel={POMODORO_MODE_LABELS[item]}
          accessibilityState={{
            selected: item === mode,
            disabled,
          }}
        >
          <Text
            style={[
              styles.label,
              { color: item === mode ? c.text : c.textMuted },
              item === mode && styles.labelActive,
            ]}
          >
            {POMODORO_MODE_LABELS[item]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[2],
    marginBottom: spacing[8],
  },
  containerDisabled: {
    opacity: 0.5,
  },
  tab: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  label: {
    fontSize: fontSize.sm,
  },
  labelActive: {
    fontWeight: fontWeight.semibold,
  },
});
