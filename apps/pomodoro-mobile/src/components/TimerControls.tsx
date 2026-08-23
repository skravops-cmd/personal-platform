import { View, StyleSheet } from "react-native";
import { Button } from "./Button";
import { spacing } from "@personal-platform/design-tokens/tokens";

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
    <View style={styles.container}>
      {isRunning ? (
        <Button onPress={onPause}>Pause</Button>
      ) : (
        <Button onPress={onStart}>Start</Button>
      )}
      <Button variant="secondary" onPress={onReset}>
        Reset
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[3],
  },
});
