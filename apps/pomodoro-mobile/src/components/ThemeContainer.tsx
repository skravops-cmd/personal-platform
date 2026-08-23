import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

export function ThemeContainer() {
  const c = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
