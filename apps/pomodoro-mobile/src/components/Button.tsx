import type { ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { fontSize, fontWeight, radii, spacing } from "@personal-platform/design-tokens/tokens";
import { useThemeColors } from "../hooks/useThemeColors";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
  onPress: () => void;
  children: ReactNode;
  style?: ViewStyle;
};

export function Button({
  variant = "primary",
  onPress,
  children,
  style,
}: ButtonProps) {
  const c = useThemeColors();

  const variantStyle = variantStyles(c)[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, variantStyle.container, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, variantStyle.label]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function variantStyles(c: ReturnType<typeof useThemeColors>): Record<ButtonVariant, { container: ViewStyle; label: TextStyle }> {
  return {
    primary: {
      container: {
        backgroundColor: c.primary,
      },
      label: {
        color: c.primaryText,
      },
    },
    secondary: {
      container: {
        backgroundColor: c.surfaceSubtle,
        borderWidth: 1,
        borderColor: c.border,
      },
      label: {
        color: c.text,
      },
    },
    ghost: {
      container: {
        backgroundColor: "transparent",
      },
      label: {
        color: c.text,
      },
    },
  };
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
