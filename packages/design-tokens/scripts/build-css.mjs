/**
 * Generates src/tokens.css from the canonical src/tokens.ts source.
 *
 * Usage: node scripts/build-css.mjs
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "../src");

// Import the TypeScript tokens via tsx
const { tokens } = await import("../src/tokens.ts");

// ── Helpers ────────────────────────────────────────────────

/**
 * Convert a camelCase key to kebab-case.
 * Numeric keys are kept as-is (e.g. 4 → "4").
 */
function toKebab(key) {
  if (typeof key === "number") return String(key);
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Format a token value for CSS output.
 *
 * - numbers  → converted to rem (÷ 16), except 9999 which stays "9999px"
 * - strings  → passed through as-is (hex colors, raw CSS like clamp(), shadow strings)
 */
function formatValue(value) {
  if (typeof value === "number") {
    if (value === 9999) return "9999px";
    return `${value / 16}rem`;
  }
  return String(value);
}

/**
 * Render a group of tokens as CSS custom properties.
 */
function renderGroup(prefix, group) {
  const lines = [];
  for (const [key, value] of Object.entries(group)) {
    const name = key === "" ? prefix : `${prefix}-${toKebab(key)}`;
    lines.push(`  ${name}: ${formatValue(value)};`);
  }
  return lines.join("\n");
}

// ── Build CSS ──────────────────────────────────────────────

// Filter numeric timer from fontSize — fontSizeSpecial.timer handles the CSS output
const { timer: _timer, ...fontSizeForCss } = tokens.fontSize;

const sections = [
  { comment: "Colors",     prefix: "--color",         group: tokens.colors },
  { comment: "Typography", prefix: "--font-family",   group: { "": tokens.fontFamily } },
  { comment: null,         prefix: "--font-size",     group: fontSizeForCss },
  { comment: null,         prefix: "--font-size",     group: tokens.fontSizeSpecial },
  { comment: null,         prefix: "--font-weight",   group: tokens.fontWeight },
  { comment: "Spacing",    prefix: "--space",         group: tokens.spacing },
  { comment: "Radius",     prefix: "--radius",        group: tokens.radii },
  { comment: "Shadows",    prefix: "--shadow",        group: tokens.shadows },
  { comment: "Layout",     prefix: "--content-width", group: tokens.contentWidth },
  { comment: "Focus",      prefix: "--focus",         group: tokens.focus },
];

const parts = [];
for (const section of sections) {
  if (section.comment) {
    parts.push(`\n  /* ${section.comment} */\n`);
  }
  parts.push(renderGroup(section.prefix, section.group));
}

const css = `/* Generated from src/tokens.ts — do not edit manually. */
:root {${parts.join("\n")}
}

[data-theme="dark"] {
${renderGroup("--color", tokens.darkColors)}
}
`;

// ── Write ──────────────────────────────────────────────────

const outPath = resolve(srcDir, "tokens.css");
writeFileSync(outPath, css, "utf-8");
console.log(`✓ Generated ${outPath}`);
