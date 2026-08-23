/**
 * Validates that src/tokens.css matches what would be generated from src/tokens.ts.
 *
 * Usage: node scripts/check.mjs
 * Exit 0 if tokens.css is up to date, exit 1 otherwise.
 *
 * Does NOT write to tokens.css — use `pnpm build` to regenerate.
 */
import { writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "../src");
const tokensPath = resolve(srcDir, "tokens.css");
const tmpPath = resolve(tmpdir(), "design-tokens-check.css");

// ── Generate into temp file ────────────────────────────────

const { tokens } = await import("../src/tokens.ts");

function toKebab(key) {
  if (typeof key === "number") return String(key);
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function formatValue(value) {
  if (typeof value === "number") {
    if (value === 9999) return "9999px";
    return `${value / 16}rem`;
  }
  return String(value);
}

function renderGroup(prefix, group) {
  const lines = [];
  for (const [key, value] of Object.entries(group)) {
    const name = key === "" ? prefix : `${prefix}-${toKebab(key)}`;
    lines.push(`  ${name}: ${formatValue(value)};`);
  }
  return lines.join("\n");
}

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

const generated = `/* Generated from src/tokens.ts — do not edit manually. */
:root {${parts.join("\n")}
}

[data-theme="dark"] {
${renderGroup("--color", tokens.darkColors)}
}
`;

writeFileSync(tmpPath, generated, "utf-8");

// ── Compare ────────────────────────────────────────────────

let exitCode = 0;

try {
  execSync(`diff "${tokensPath}" "${tmpPath}"`, { stdio: "inherit" });
  console.log("✓ tokens.css is up to date.");
} catch {
  console.error("\n✗ tokens.css is out of date.");
  console.error("  Run `pnpm build` inside packages/design-tokens to regenerate.");
  exitCode = 1;
} finally {
  try { unlinkSync(tmpPath); } catch {}
}

process.exit(exitCode);
