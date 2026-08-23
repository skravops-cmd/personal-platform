/**
 * Design tokens — single source of truth.
 *
 * All values here are platform-agnostic:
 * - Colors: hex strings
 * - Spacing / radii / fontSize: numbers representing pixels
 * - FontWeight: numeric strings ("400", "700")
 *
 * Run `pnpm build` to regenerate src/tokens.css from these values.
 */

/**
 * Shared shape for light and dark color palettes.
 * Consumers should type their theme-dependent color values as `ThemeColors`
 * so both `colors` and `darkColors` are assignable.
 */
export type ThemeColors = {
  readonly background: string;
  readonly surface: string;
  readonly surfaceSubtle: string;
  readonly text: string;
  readonly textMuted: string;
  readonly primary: string;
  readonly primaryHover: string;
  readonly primaryText: string;
  readonly border: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
};

export const colors: ThemeColors = {
  background: "#f7f7f5",
  surface: "#ffffff",
  surfaceSubtle: "#f0f0ed",
  text: "#20201e",
  textMuted: "#70706b",
  primary: "#d9574c",
  primaryHover: "#c74b41",
  primaryText: "#ffffff",
  border: "#deded8",
  success: "#3d8b5f",
  warning: "#c48a32",
  danger: "#c94b4b",
};

export const darkColors: ThemeColors = {
  background: "#1a1a1d",
  surface: "#242428",
  surfaceSubtle: "#2e2e33",
  text: "#ececec",
  textMuted: "#9a9a9a",
  primary: "#e0645a",
  primaryHover: "#d0584e",
  primaryText: "#ffffff",
  border: "#3a3a40",
  success: "#5aad78",
  warning: "#d9a04a",
  danger: "#dc6060",
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  /** Semantic timer font size (px). Web overrides via fontSizeSpecial.timer for responsive clamp(). */
  timer: 64,
} as const;

export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

/**
 * All token values in a single object.
 *
 * This is the canonical source consumed by the CSS generator.
 * Categories are organized by their CSS variable prefix.
 *
 * `fontFamily` and `fontSizeSpecial` produce CSS custom properties
 * but are not re-exported for React Native consumption — the raw
 * CSS strings have no platform-agnostic numeric equivalent.
 */
export const tokens = {
  colors,
  darkColors,
  spacing,
  radii,
  fontSize,
  fontWeight,
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSizeSpecial: {
    timer: "clamp(4rem, 15vw, 7rem)",
  },
  contentWidth: {
    sm: "32rem",
    md: "48rem",
    lg: "72rem",
  },
  shadows: {
    sm: "0 1px 2px rgb(0 0 0 / 0.05)",
    md: "0 8px 30px rgb(0 0 0 / 0.08)",
    lg: "0 20px 50px rgb(0 0 0 / 0.12)",
  },
  focus: {
    ring: "2px solid #d9574c",
    offset: "2px",
  },
} as const;
