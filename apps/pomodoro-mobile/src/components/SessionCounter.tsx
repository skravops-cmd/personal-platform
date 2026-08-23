import { Text, StyleSheet } from "react-native";
import { fontSize, spacing } from "@personal-platform/design-tokens/tokens";
import { useThemeColors } from "../hooks/useThemeColors";

type SessionCounterProps = {
  completedSessions: number;
};

export function SessionCounter({ completedSessions }: SessionCounterProps) {
  const c = useThemeColors();

  return (
    <Text style={[styles.counter, { color: c.textMuted }]}>
      Sessions completed: {completedSessions}
    </Text>
  );
}

const styles = StyleSheet.create({
  counter: {
    marginTop: spacing[6],
    fontSize: fontSize.sm,
    textAlign: "center",
  },
});
